import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import workRoutes from "./routes/workRoutes.js";
import valuationRoutes from ".//routes/orderValuationRoutes.js";
import driveRoutes from "./routes/driveRoutes.js";
import BillRoutes from "./routes/billRoutes.js";
import MeetingsRoutes from "./routes/meetingRoutes.js";

let socket;
let isConnected = false;

// import { startWhatsApp } from "./config/whatsapp.js";

import job from "./cron.js";

dotenv.config();

const app = express();

job.start();

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("A.F. Infosys Smart Management CRM, Server is Running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", inquiryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/work", workRoutes);
app.use("/api/messages", MessagesRoutes);
app.use("/api/valuation", valuationRoutes);
app.use("/api/images", driveRoutes);
app.use("/api/bill-data", BillRoutes);
app.use("/api/meetings", MeetingsRoutes);

// Reciept Automation Script Start
async function fetchDataFromSheet(sheetId, recordId) {
  const range = `A${recordId + 1}:AZ${recordId + 1}`;
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&range=${range}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Network response was not ok.`);
  const text = await res.text();
  const json = JSON.parse(text.substring(47).slice(0, -2));
  if (!json.table.rows || json.table.rows.length === 0) {
    throw new Error(`Record with ID '${recordId}' not found.`);
  }
  return json.table.rows[0].c.map((cell) => (cell ? cell.v : ""));
}
function formatJid(phone) {
  if (typeof phone !== "string") phone = String(phone);
  const cleaned = phone.replace(/[^0-9]/g, "");
  if (cleaned.length === 10) return `91${cleaned}@s.whatsapp.net`;
  if (cleaned.length > 10) return `${cleaned}@s.whatsapp.net`;
  return null;
}
function safeNumber(val) {
  const num = parseFloat(val);
  return isNaN(num) ? 0 : num;
}

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
      recordId,
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
      error.message,
    );
    res.status(500).json({ success: false, message: error.message });
  }
});

import { google } from "googleapis";
import survayRoutes from "./routes/survayRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ContactListRoutes from "./routes/contactListRoutes.js";

// --- Google Sheets Configuration ---
// IMPORTANT: Replace with your actual service account key file path and sheet details
const SPREADSHEET_ID = "1_bs5IQ0kDT_xVLwJdihe17yuyY_UfJRKCtwoGvO7T5Y"; // The ID from your sheet's URL
const SHEET_NAME = "AC MAST"; // The name of the specific sheet/tab you want to update

let credentials;

if (!process.env.GOOGLE_CREDENTIALS_JSON) {
  throw new Error("GOOGLE_CREDENTIALS_JSON environment variable is not set.");
}

const rawCredentialsString = process.env.GOOGLE_CREDENTIALS_JSON;
credentials = JSON.parse(rawCredentialsString);

if (credentials.private_key) {
  credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
} else {
  throw new Error("Private key missing in Google credentials JSON.");
}

// --- Google Sheets Authentication ---
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"], // Scope for read/write access
});

// Create Sheets client
const sheets = google.sheets({ version: "v4", auth });

/**
 * Updates a specific range of cells in a Google Sheet.
 * @param {string} range A1 notation (e.g., 'Sheet1!A1', 'Sheet1!C5:D10')
 * @param {Array<Array<any>>} values An array of arrays, where each inner array is a row of values.
 */

async function updateSheetCells(range, values) {
  try {
    // Step 1: Get existing values from the sheet
    const currentData = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
    });

    const existingValues = currentData.data.values || [];

    // Step 2: Only preserve value at index 18 if it's empty in the new data
    const finalValues = values.map((row, rowIndex) => {
      const existingRow = existingValues[rowIndex] || [];
      const updatedRow = [...row]; // clone the row

      if (row[18] === "") {
        updatedRow[18] = existingRow[18] ?? "Meghraj - MEGHRAJ"; // preserve existing if available
      }

      return updatedRow;
    });

    // Step 3: Send updated values
    const request = {
      spreadsheetId: SPREADSHEET_ID,
      range: range,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: finalValues,
      },
    };

    console.log("📝 Final Values (with index 18 handled):", finalValues);

    const response = await sheets.spreadsheets.values.update(request);
    console.log(`✅ Updated ${response.data.updatedCells} cells.`);
    return response.data;
  } catch (err) {
    console.error("❌ Error updating Google Sheet cells:", err.message);
    throw err;
  }
}

/**
 * Appends new rows to the end of a Google Sheet.
 * @param {Array<Array<any>>} values An array of arrays, where each inner array is a row of values.
 */

async function appendSheetRows(values) {
  try {
    const request = {
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1`, // Range can be just the sheet name for appending
      valueInputOption: "USER_ENTERED",
      resource: {
        values: values,
      },
    };
    const response = await sheets.spreadsheets.values.append(request);
    console.log(`Appended ${response.data.updates.updatedCells} cells.`);
    return response.data;
  } catch (err) {
    console.error("Error appending to Google Sheet:", err.message);
    throw err;
  }
}

app.post("/update-sheet-record", async (req, res) => {
  const { milkatId, rowData } = req.body;
  if (!milkatId || !rowData) {
    return res.status(400).json({
      success: false,
      message: "Missing milkatId or rowData in request.",
    });
  }
  try {
    const getRequest = {
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:AZ`, // Expanded range to AZ to fetch more columns
    };
    const getResponse = await sheets.spreadsheets.values.get(getRequest);
    const rows = getResponse.data.values;

    const MILKAT_COL_INDEX = 5; // Assuming Milkat Number is in column F (index 5)

    let rowIndexToUpdate = -1;
    console.log(`[DEBUG] Received milkatId for update: ${milkatId}`);
    if (rows) {
      for (let i = 0; i < rows.length; i++) {
        if (i === 2) continue; // Skip the 3rd row (index 2)
        const sheetMilkatId = rows[i][MILKAT_COL_INDEX];
        console.log(
          `[DEBUG] Checking row ${i}, Milkat ID in sheet: ${sheetMilkatId}`,
        );
        if (
          sheetMilkatId &&
          parseFloat(sheetMilkatId) === parseFloat(milkatId)
        ) {
          rowIndexToUpdate = i;
          console.log(`[DEBUG] Match found at row index: ${rowIndexToUpdate}`);
          break;
        }
      }
    }

    if (rowIndexToUpdate !== -1) {
      const rowNumber = rowIndexToUpdate + 1; // Google Sheets is 1-indexed
      const rangeToUpdate = `${SHEET_NAME}!A${rowNumber}`; // Update the entire row starting from column A
      console.log(
        `[DEBUG] Updating sheet at row number: ${rowNumber}, range: ${rangeToUpdate}`,
      );

      await updateSheetCells(rangeToUpdate, [rowData]);
      console.log(`Milkat ${milkatId} record updated at row ${rowNumber}`);
      res.status(200).json({
        success: true,
        message: `Record for Milkat ID ${milkatId} updated.`,
      });
    } else {
      await appendSheetRows([rowData]);
      console.log(`Milkat ${milkatId} record not found, appended as new row.`);
      res.status(200).json({
        success: true,
        message: `Record for Milkat ID ${milkatId} appended.`,
      });
    }
  } catch (error) {
    console.error(
      "[Failed] Could not update/append data to sheet:",
      error.message,
    );
    res.status(500).json({ success: false, message: error.message });
  }
});

// Reciept Number Updation on Record (duplicate endpoint - consider merging or renaming)
// This endpoint is duplicated from the original code. I recommend reviewing if it's still needed
// or if its functionality can be merged into `/update-sheet-record`.
// For now, I'm keeping it as is, but flagged for review.

app.post("/update-receipt", async (req, res) => {
  const { milkatId, receiptNumber } = req.body;

  if (!milkatId || !receiptNumber) {
    return res.status(400).json({
      success: false,
      message: "Missing milkatId or receiptNumber in request.",
    });
  }

  try {
    const getRequest = {
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:AZ`, // Expanded range to AZ to get all possible data
    };
    const getResponse = await sheets.spreadsheets.values.get(getRequest);
    const rows = getResponse.data.values;

    const MILKAT_COL_INDEX = 5; // Column F (0-indexed)
    let rowIndexToUpdate = -1;

    for (let i = 0; i < rows.length; i++) {
      if (i === 2) continue; // skip row 3 (index 2)
      const sheetMilkatId = rows[i][MILKAT_COL_INDEX];
      if (sheetMilkatId && parseFloat(sheetMilkatId) === parseFloat(milkatId)) {
        rowIndexToUpdate = i;
        break;
      }
    }

    if (rowIndexToUpdate !== -1) {
      const rowNumber = rowIndexToUpdate + 1;
      const receiptRange = `${SHEET_NAME}!AF${rowNumber}`; // Column 32 (AF)
      const dateRange = `${SHEET_NAME}!AG${rowNumber}`; // Column 33 (AG)

      const today = new Date();
      // Format date as DD/MM/YYYY
      const formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(
        today.getMonth() + 1
      ) // Month is 0-indexed
        .toString()
        .padStart(2, "0")}/${today.getFullYear()}`;

      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          valueInputOption: "RAW",
          data: [
            {
              range: receiptRange,
              values: [[receiptNumber]],
            },
            {
              range: dateRange,
              values: [[formattedDate]],
            },
          ],
        },
      });

      console.log(
        `✅ Receipt ${receiptNumber} and Date updated at row ${rowNumber}`,
      );
      res.status(200).json({
        success: true,
        message: `Receipt and date updated at row ${rowNumber}.`,
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Milkat ID ${milkatId} not found in sheet.`,
      });
    }
  } catch (error) {
    console.error("❌ Error updating receipt and date:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/get-all-sheet-data", async (req, res) => {
  try {
    const getRequest = {
      spreadsheetId: SPREADSHEET_ID,
      // Fetch a very wide range to ensure all possible columns (fields) are included.
      // Assuming 'AZ' covers all fields from EditPage.html
      range: `${SHEET_NAME}!A:AZ`,
    };

    const getResponse = await sheets.spreadsheets.values.get(getRequest);
    const allRows = getResponse.data.values || [];

    // Filter out the third row (index 2) if it's meant to be skipped in general data retrieval
    const filteredRows = allRows.filter((_, index) => index !== 2);

    console.log(`✅ Fetched ${filteredRows.length} rows from sheet.`);
    res.status(200).json({
      success: true,
      data: filteredRows,
      message: `Successfully fetched all data from ${SHEET_NAME}.`,
    });
  } catch (error) {
    console.error("❌ Error fetching all sheet data:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});
// Reciept Automation Script End

app.use("/api/sheet", survayRoutes);
app.use("/api/contactList", ContactListRoutes);

import connectWhatsAPP, {
  checkWhatsAppNumbers,
  sendMessageToWhatsApp,
} from "./config/whatsapp.js";
import MessagesRoutes from "./routes/waFromatRoutes.js";

// import { sendMessageToWhatsApp } from "./controllers/sendController.js";

app.post("/send-message", sendMessageToWhatsApp);
app.post("/check-whatsapp-numbers", checkWhatsAppNumbers);

// Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  connectWhatsAPP();
});
