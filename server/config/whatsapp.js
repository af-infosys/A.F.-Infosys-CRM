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
  const { phoneNumber, message = "Hello from the bot!" } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: "Missing phoneNumber" });
  }

  try {
    if (!socket) throw new Error("WhatsApp not connected yet");

    const jid = number.includes("@s.whatsapp.net")
      ? number
      : number + "@s.whatsapp.net";

    await socket.sendPresenceUpdate("composing", jid);
    await new Promise((res) => setTimeout(res, 1000)); // short delay
    await socket.sendMessage(jid, { message });
    await socket.sendPresenceUpdate("paused", jid);

    console.log(`📤 Sent to ${number}: ${message}`);

    res.json({ success: true, phoneNumber });
  } catch (err) {
    console.error("❌ Error sending message:", err.message);
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
