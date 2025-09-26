import { getSocket } from "../config/whatsapp.js";

export async function sendMessageToWhatsApp(req, res) {
  const { numbers } = req.body;

  if (!Array.isArray(numbers) || numbers.length === 0) {
    return res.status(400).json({ error: "Missing or invalid numbers array" });
  }

  const imageUrl =
    "https://afinfosys.netlify.app/server/assets/VisitingCard.jpeg";

  const socket = getSocket();
  if (!socket)
    return res.status(503).json({ error: "WhatsApp not connected yet" });

  try {
    if (!socket) throw new Error("WhatsApp not connected yet");

    const results = [];

    for (const rawNumber of numbers) {
      const number = rawNumber.replace(/[^0-9]/g, ""); // Sanitize
      const jid = number.includes("@s.whatsapp.net")
        ? number
        : number + "@s.whatsapp.net";

      try {
        // Send "typing" presence (optional)
        await socket.sendPresenceUpdate("composing", jid);
        await new Promise((r) => setTimeout(r, 800));

        // Send image (no caption)
        await socket.sendMessage(jid, {
          image: { url: imageUrl },
        });

        await socket.sendPresenceUpdate("paused", jid);

        console.log(`📤 Sent Visiting Card to ${jid}`);
        results.push({ number: number, status: "sent" });
      } catch (innerErr) {
        console.error(`❌ Failed for ${jid}:`, innerErr.message);
        results.push({
          number: number,
          status: "failed",
          error: innerErr.message,
        });
      }
    }

    res.json({ success: true, results });
  } catch (err) {
    console.error("❌ Error in sendMessageToWhatsApp:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}
