const app = {};

// --- 5. THE 'SEND RECEIPT' HTTP ENDPOINT (remains the same) ---
app.post("/send-receipt", async (req, res) => {
  if (!isConnected || !socket) {
    return res.status(503).json({
      success: false,
      message: "WhatsApp bot is not connected or ready.",
    });
  }
  const { m_id } = req.body;
  if (!m_id) {
    return res
      .status(400)
      .json({ success: false, message: "Missing m_id in request." });
  }
  try {
    const recordId = parseInt(m_id, 10) + 2;
    console.log(`[Request] Received request for m_id: ${recordId}`);
    const record = await fetchDataFromSheet(
      process.env.GOOGLE_SHEET_ID,
      recordId
    );
    const ownerName = record[1] || "Valued Customer";
    const phoneNumber = record[17];
    // !! Adjust these indices if your sheet changes !!
    const totalAmount = (
      safeNumber(record[19]) +
      safeNumber(record[20]) +
      safeNumber(record[21]) +
      safeNumber(record[22]) +
      safeNumber(record[23]) +
      safeNumber(record[24]) +
      safeNumber(record[25]) +
      safeNumber(record[26]) +
      safeNumber(record[27]) +
      safeNumber(record[28]) +
      safeNumber(record[29]) +
      safeNumber(record[30])
    ).toFixed(2);
    if (!phoneNumber)
      throw new Error(`No phone number at index 17 for m_id ${recordId}`);
    const jid = formatJid(phoneNumber);
    if (!jid) throw new Error(`Invalid phone number: ${phoneNumber}`);
    const receiptUrl = `https://afinfosys.netlify.app/reciept_format.html?m_id=${m_id}`;
    const messageText = `નમસ્તે ${ownerName},\n\nતમારી ગ્રામ પંચાયતની રસીદ તૈયાર છે. કુલ રકમ ₹${totalAmount} છે.\n\nનીચે આપેલા બટન પર ક્લિક કરીને તમારી રસીદ જુઓ અને ચુકવણી કરો.\n${receiptUrl}\n\nઆભાર,\nગ્રામ પંચાયત`;
    const buttonMessage = {
      text: messageText,
      footer: "Meghraj Gram Panchayat",
      templateButtons: [
        {
          index: 1,
          urlButton: {
            displayText: "રસીદ જુઓ / View Receipt",
            url: receiptUrl,
          },
        },
      ],
    };
    await socket.sendMessage(jid, buttonMessage);
    console.log(`[Success] Sent receipt for m_id ${recordId} to ${jid}`);
    res
      .status(200)
      .json({ success: true, message: `Receipt sent to ${phoneNumber}` });
  } catch (error) {
    console.error(
      `[Failed] Could not send receipt for m_id ${m_id}:`,
      error.message
    );
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/send-message", async (req, res) => {
  if (!isConnected || !socket) {
    return res.status(503).json({
      success: false,
      message: "WhatsApp bot is not connected or ready.",
    });
  }
  const { phoneNumber } = req.body;
  if (!phoneNumber) {
    return res
      .status(400)
      .json({ success: false, message: "Missing phoneNumber in request." });
  }

  try {
    const jid = formatJid(phoneNumber);
    if (!jid) throw new Error(`Invalid phone number: ${phoneNumber}`);
    const receiptUrl = `https://afinfosys.netlify.app/reciept_format.html`;
    const messageText = `Hello, test Message`;
    const buttonMessage = {
      text: messageText,
      footer: "Meghraj Gram Panchayat",
      templateButtons: [
        {
          index: 1,
          urlButton: {
            displayText: "View Receipt",
            url: receiptUrl,
          },
        },
      ],
    };
    await socket.sendMessage(jid, buttonMessage);
    console.log(`[Success] Sent receipt for phoneNumber ${phoneNumber}`);
    res
      .status(200)
      .json({ success: true, message: `Receipt sent to ${phoneNumber}` });
  } catch (error) {
    console.error(
      `[Failed] Could not send receipt for phoneNumber ${phoneNumber}:`,
      error.message
    );
    res.status(500).json({ success: false, message: error.message });
  }
});

// --- 6. WHATSAPP CONNECTION LOGIC (THIS IS THE UPDATED PART) --
