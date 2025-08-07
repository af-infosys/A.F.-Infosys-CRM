import {
  makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";

import qrcode from "qrcode-terminal";

let socket;

const getMessage = (key) => {
  const { id } = key;
  return store[id]?.message;
};

// 🔌 WhatsApp Socket Connection
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
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;

      console.log("Connection closed. Reconnect?", shouldReconnect);

      if (shouldReconnect) {
        connectWhatsAPP();
      } else {
        console.log("❌ Disconnected. Logged out from WhatsApp.");
      }
    }

    if (connection === "open") {
      console.log("✅ Connected successfully to WhatsApp!");
    }
  });
}

// ✅ This will be used by your Express API
export async function sendMessageToWhatsApp(req, res) {
  const { numbers } = req.body;

  if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
    return res.status(400).json({ error: "Missing or invalid numbers array" });
  }

  const imageUrl =
    "https://afinfosys.netlify.app/server/assets/VisitingCard.jpeg";

  try {
    if (!socket) throw new Error("WhatsApp not connected yet");

    for (const phone of numbers) {
      const jid = phone.includes("@s.whatsapp.net")
        ? phone
        : phone + "@s.whatsapp.net";

      await socket.sendPresenceUpdate("composing", jid);
      await new Promise((r) => setTimeout(r, 1000));

      await socket.sendMessage(jid, {
        image: { url: imageUrl },
        caption: "", // Send image without caption
      });

      await socket.sendPresenceUpdate("paused", jid);
      console.log(`📤 Sent image to ${jid}`);
    }

    res.json({
      success: true,
      message: `Sent to ${numbers.length} numbers`,
    });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: err.message });
  }
}

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
