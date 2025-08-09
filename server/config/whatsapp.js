// import {
//   makeWASocket,
//   useMultiFileAuthState,
//   DisconnectReason,
//   fetchLatestBaileysVersion,
// } from "@whiskeysockets/baileys";
// import qrcode from "qrcode-terminal";

// let socket;
// const store = {}; // You can optionally connect this to a message store like `@adiwajshing/baileys-md`

// const getMessage = (key) => {
//   const { id } = key;
//   return store[id]?.message;
// };

// // 🔌 Start WhatsApp Connection
// export default async function connectWhatsAPP() {
//   const { state, saveCreds } = await useMultiFileAuthState("auth");
//   const { version } = await fetchLatestBaileysVersion();

//   socket = makeWASocket({
//     auth: state,
//     version,
//     browser: ["Chrome", "Desktop", "121.0.0.0"],
//     getMessage,
//     syncFullHistory: false,
//   });

//   socket.ev.on("creds.update", saveCreds);

//   socket.ev.on("connection.update", async (update) => {
//     const { connection, lastDisconnect, qr } = update;

//     if (qr) {
//       console.log("📲 Scan the QR Code below to login to WhatsApp:");
//       qrcode.generate(qr, { small: true });
//     }

//     if (connection === "close") {
//       const shouldReconnect =
//         lastDisconnect?.error?.output?.statusCode !==
//         DisconnectReason.loggedOut;

//       console.log("🔌 Connection closed. Reconnect?", shouldReconnect);

//       if (shouldReconnect) {
//         connectWhatsAPP();
//       } else {
//         console.log("❌ Disconnected. Logged out from WhatsApp.");
//       }
//     }

//     if (connection === "open") {
//       console.log("✅ Connected successfully to WhatsApp!");
//     }
//   });
// }

// // ✅ To be used in API routes or controllers
// export function getSocket() {
//   return socket;
// }

import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import { Boom } from "@hapi/boom"; // Import Boom for better error handling

let socket;
const store = {};
const lastMessageMap = new Map(); // 🆕 Store last message per user

const getMessage = (key) => {
  const { id } = key;
  return store[id]?.message;
};

// 🔌 Start WhatsApp Connection
export default async function connectWhatsAPP() {
  const { state, saveCreds } = await useMultiFileAuthState("auth");
  const { version } = await fetchLatestBaileysVersion();

  socket = makeWASocket({
    auth: state,
    version,
    browser: ["Chrome", "Desktop", "121.0.0.0"],
    getMessage,
    syncFullHistory: false,
  });

  socket.ev.on("creds.update", saveCreds);

  socket.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("📲 Scan the QR Code below to login to WhatsApp:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error instanceof Boom &&
        lastDisconnect?.error?.output?.statusCode !==
          DisconnectReason.loggedOut;

      console.log("🔌 Connection closed. Reconnect?", shouldReconnect);

      if (shouldReconnect) {
        connectWhatsAPP(); // Recursively call to reconnect
      } else {
        console.log("❌ Disconnected. Logged out from WhatsApp.");
      }
    }

    if (connection === "open") {
      console.log("✅ Connected successfully to WhatsApp!");
    }
  });

  // socket.ev.on("messages.upsert", async (m) => {
  //   console.log("🔥 Received messages.upsert event");
  //   console.dir(m, { depth: null });

  //   const messages = m.messages || [];
  //   for (const msg of messages) {
  //     const jid = msg.key.remoteJid;
  //     if (jid && msg.message) {
  //       lastMessageMap.set(jid, msg);
  //       console.log("🆕 New message from", jid);
  //     }
  //   }
  // });

  const BOT_START_TIME = Math.floor(Date.now() / 1000); // UNIX timestamp in seconds
  const stopMap = new Map(); // JID => expiry timestamp (ms)

  const DELAY_REPLY_MS = 6500; // 6.5 seconds delay
  const pendingMessages = new Map(); // JID => [{ id, timestamp }]
  const recentActivityMap = new Map(); // JID => timestamp of last manual reply

  const conversationMemory = new Map(); // JID => [ { role, content } ]
  const MAX_HISTORY = 10;

  socket.ev.on("messages.upsert", async ({ messages }) => {
    for (const msg of messages) {
      const { key, messageTimestamp } = msg;
      const jid = key.remoteJid;
      const sender = msg.pushName || "Unknown";

      // ✅ 2. Skip messages sent before bot started
      if (messageTimestamp < BOT_START_TIME) {
        // console.log("⏩ Old message ignored:", extractMessageText(msg));
        continue;
      }

      // ✅ 3. Skip already seen messages
      if (isMessageSeen(key.id)) {
        // console.log("👀 Already replied:", extractMessageText(msg));
        continue;
      }

      // ✅ 4. Extract text
      const text = extractMessageText(msg);
      if (!text) return;

      console.log(`📩 Message from ${sender}: "${text}"`);

      // 🧠 Store user message in conversation history
      const history = conversationMemory.get(jid) || [];
      history.push({ role: "user", content: text });
      if (history.length > MAX_HISTORY) history.shift();
      conversationMemory.set(jid, history);

      // ✅ 7. Delay reply logic (core update)
      pendingMessages.set(jid, [
        ...(pendingMessages.get(jid) || []),
        { id: key.id, msg, timestamp: Date.now() },
      ]);

      // Delay bot reply
      // Start typing while waiting
      await socket.sendPresenceUpdate("composing", jid);

      setTimeout(async () => {
        const pendings = pendingMessages.get(jid);
        if (!pendings) return;

        const current = pendings.find((m) => m.id === key.id);
        if (!current) return;

        const lastManual = recentActivityMap.get(jid);
        if (lastManual && lastManual > current.timestamp) {
          console.log(
            "🙈 Skipping bot reply (manual reply came in time):",
            text
          );
          pendingMessages.set(
            jid,
            pendings.filter((m) => m.id !== key.id)
          );

          // Stop typing since we won't reply
          await socket.sendPresenceUpdate("paused", jid);
          return;
        }

        // const reply = await fetchGeminiReply(sender, jid);
        // const reply = `Hello, ${sender}`;
        // await socket.sendMessage(jid, { text: reply }, { quoted: msg });

        recentActivityMap.set(jid, Date.now());
        // console.log(`🤖 Replied to ${sender}: "${reply}"`);

        // Clean up and stop typing
        pendingMessages.set(
          jid,
          pendings.filter((m) => m.id !== key.id)
        );
        await socket.sendPresenceUpdate("paused", jid);
      }, DELAY_REPLY_MS);

      //
    }
  });

  return socket;
}

const seenMessages = new Map(); // msgId => timestamp

function isMessageSeen(id) {
  const EXPIRY_MS = 1000 * 60 * 60 * 12; // 12 hours
  const now = Date.now();

  // Clean old messages
  for (const [mid, ts] of seenMessages) {
    if (now - ts > EXPIRY_MS) seenMessages.delete(mid);
  }

  if (seenMessages.has(id)) return true;

  seenMessages.set(id, now);
  return false;
}

function extractMessageText(message) {
  const msg = message.message;
  if (msg?.conversation) return msg.conversation;
  if (msg?.extendedTextMessage) return msg.extendedTextMessage.text;
  if (msg?.imageMessage?.caption) return msg.imageMessage.caption;
  if (msg?.videoMessage?.caption) return msg.videoMessage.caption;
  if (msg?.buttonsResponseMessage)
    return msg.buttonsResponseMessage.selectedButtonId;
  if (msg?.listResponseMessage) return msg.listResponseMessage.title;
  return false;
}

// 📤 Send Message Endpoint
export async function sendMessageToWhatsApp(req, res) {
  const { number, text, imageUrl, videoUrl } = req.body;

  if (!number) {
    return res.status(400).json({ error: "Missing number" });
  }

  if (!socket || !socket.user) {
    return res.status(503).json({ error: "WhatsApp not connected yet" });
  }

  try {
    const sanitizedNumber = number.replace(/[^0-9]/g, "");
    const jid = sanitizedNumber.includes("@s.whatsapp.net")
      ? sanitizedNumber
      : `${sanitizedNumber}@s.whatsapp.net`;

    const [check] = await socket.onWhatsApp(jid);
    console.log("🟢 Is number on WhatsApp?", check?.exists);

    if (!check?.exists) {
      return res
        .status(400)
        .json({ error: "Number not registered on WhatsApp" });
    }

    await socket.sendPresenceUpdate("composing", jid);
    await new Promise((r) => setTimeout(r, 1000));

    let messageBody = {};
    if (imageUrl) {
      messageBody = { image: { url: imageUrl }, caption: text || "" };
    } else if (videoUrl) {
      messageBody = { video: { url: videoUrl }, caption: text || "" };
    } else if (text) {
      messageBody = { text };
    } else {
      await socket.sendPresenceUpdate("paused", jid);
      return res.status(400).json({ error: "No message content provided" });
    }

    // 🧠 Try quoting last message (if exists) to improve delivery
    const quoted = lastMessageMap.get(jid);
    const options = quoted ? { quoted } : {};
    console.log("Quted", options);

    const result = await socket.sendMessage(jid, messageBody, options);
    console.log("Message Result:", result);

    await socket.sendPresenceUpdate("paused", jid);

    console.log(`📤 Sent to ${jid} with`, messageBody);
    res.json({ success: true, jid: jid });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

// export async function sendMessageToWhatsApp(req, res) {
//   const { number, text, imageUrl, videoUrl } = req.body;

//   if (!number) {
//     return res.status(400).json({ error: "Missing number" });
//   }

//   try {
//     if (!socket)
//       return res.status(503).json({ error: "WhatsApp not connected yet" });

//     const jid = number.includes("@s.whatsapp.net")
//       ? number
//       : number + "@s.whatsapp.net";

//     await socket.sendPresenceUpdate("composing", jid);
//     await new Promise((r) => setTimeout(r, 1000));

//     if (imageUrl) {
//       await socket.sendMessage(jid, {
//         image: { url: imageUrl },
//         caption: text || "",
//       });
//     } else if (videoUrl) {
//       await socket.sendMessage(jid, {
//         video: { url: videoUrl },
//         caption: text || "",
//       });
//     } else if (text) {
//       await socket.sendMessage(jid, { text });
//     }

//     await socket.sendPresenceUpdate("paused", jid);

//     console.log(`📤 Sent to ${jid}`);
//     res.json({ success: true });
//   } catch (err) {
//     console.error("❌ Error:", err.message);
//     res.status(500).json({ error: err.message });
//   }
// }

// checkWhatsAppNumbers.js (Controller or Route handler)
export async function checkWhatsAppNumbers(req, res) {
  const { numbers } = req.body; // expects array of numbers: ["917201840095", "919000000000"]
  if (!Array.isArray(numbers)) {
    return res.status(400).json({ error: "Invalid numbers list" });
  }

  try {
    const results = await Promise.all(
      numbers.map(async (num) => {
        const jid = `${num}@s.whatsapp.net`;
        const result = await socket.onWhatsApp(jid);
        return {
          number: num,
          exists: result?.[0]?.exists || false,
        };
      })
    );

    const valid = results.filter((r) => r.exists).map((r) => r.number);
    const invalid = results.filter((r) => !r.exists).map((r) => r.number);

    return res.json({ valid, invalid });
  } catch (err) {
    console.error("WhatsApp check error:", err);
    return res.status(500).json({ error: "Failed to check numbers" });
  }
}
