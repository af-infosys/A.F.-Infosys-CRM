import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();

const SPREADSHEET_ID = process.env.CRM_SPREADSHEET_ID;
const DATA_SHEET = "MessageFormats";

let credentials;

if (!process.env.GOOGLE_CREDENTIALS_JSON) {
  throw new Error("GOOGLE_CREDENTIALS_JSON environment variable is not set.");
}

try {
  const rawCredentialsString = process.env.GOOGLE_CREDENTIALS_JSON;
  credentials = JSON.parse(rawCredentialsString);

  if (credentials.private_key) {
    credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
  } else {
    throw new Error("Private key missing in Google credentials JSON.");
  }
} catch (e) {
  console.error("Error parsing Google credentials JSON:", e.message);
  throw new Error("Invalid format for GOOGLE_CREDENTIALS_JSON.");
}

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const getSheets = async () => {
  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client });
};

const mapMessageToRow = (message) => {
  return [
    message.uniqueId || "",
    message.title || "",
    message.text || "",
    message.imageLink || "",
    message.videoLink || "",
    message.audioLink || "",
    message.documentLink || "",
    new Date().toISOString(),
  ];
};

const mapRowToMessage = (row) => {
  return {
    uniqueId: row[0],
    title: row[1],
    text: row[2],
    imageLink: row[3],
    videoLink: row[4],
    audioLink: row[5],
    documentLink: row[6],
    timestamp: row[7],
  };
};

const generateUniqueID = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
};

// --- CRUD Functions ---

export const addMessage = async (req, res) => {
  try {
    const googleSheets = await getSheets();
    const { title, text, imageLink, videoLink, audioLink, documentLink } =
      req.body;

    // Basic validation
    if (!title) {
      return res
        .status(400)
        .json({ message: "Missing required 'title' field." });
    }

    const uniqueId = generateUniqueID();
    const message = {
      uniqueId,
      title,
      text,
      imageLink,
      videoLink,
      audioLink,
      documentLink,
    };

    const rowData = mapMessageToRow(message);

    // Append the new row to the sheet
    const response = await googleSheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DATA_SHEET}!A:A`,
      valueInputOption: "RAW",
      resource: {
        values: [rowData],
      },
    });

    res.status(201).json({
      message: "Record successfully added to Google Sheet!",
      data: { uniqueId, ...req.body },
      sheetResponse: response.data,
    });
  } catch (error) {
    console.error("Error adding record to Google Sheet:", error.message);
    res.status(500).json({
      message: "Failed to add record to Google Sheet.",
      error: error.message,
    });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const googleSheets = await getSheets();

    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DATA_SHEET}!A5:ZZ`,
    });

    const records = response.data.values || [];
    // The first row is assumed to be a header and is skipped
    const messages = records.map(mapRowToMessage);

    res.status(200).json({
      message: "Records fetched successfully!",
      data: messages,
    });
  } catch (error) {
    console.error("Error fetching records from Google Sheet:", error.message);
    res.status(500).json({
      message: "Failed to fetch records from Google Sheet.",
      error: error.message,
    });
  }
};

export const updateMessage = async (req, res) => {
  try {
    const googleSheets = await getSheets();
    const { uniqueId } = req.params;
    const updatedData = req.body;

    // Fetch all records to find the row index
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DATA_SHEET}!A5:ZZ`, // Only get unique IDs to find the row
    });
    const records = response.data.values || [];
    const rowIndex = records.findIndex((row) => row[0] === uniqueId);

    // If a record is found, rowIndex is 0-based. The sheet row number is rowIndex + 1.
    if (rowIndex === -1) {
      return res.status(404).json({ message: "Record not found" });
    }

    const sheetRowNumber = rowIndex + 5;

    // Create the updated row
    const newRow = mapMessageToRow({ ...updatedData, uniqueId });

    // Update the specific row
    await googleSheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DATA_SHEET}!A${sheetRowNumber}:H${sheetRowNumber}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [newRow],
      },
    });

    res.status(200).json({
      message: "Record updated successfully!",
      data: { uniqueId, ...updatedData },
    });
  } catch (error) {
    console.error("Error updating record:", error.message);
    res.status(500).json({
      message: "Failed to update record.",
      error: error.message,
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const googleSheets = await getSheets();
    const { uniqueId } = req.params;

    // Get the sheet ID
    const sheetMeta = await googleSheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });
    const sheet = sheetMeta.data.sheets.find(
      (s) => s.properties.title === DATA_SHEET
    );
    if (!sheet) {
      return res.status(404).json({ message: "Sheet not found" });
    }
    const sheetId = sheet.properties.sheetId;

    // Fetch all records to find the row index
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DATA_SHEET}!A5:A`,
    });
    const records = response.data.values || [];
    const rowIndex = records.findIndex((row) => row[0] === uniqueId);

    if (rowIndex === -1) {
      return res.status(404).json({ message: "Record not found" });
    }

    const rowNumber = rowIndex + 5;

    // Delete the row
    await googleSheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: rowNumber - 1,
                endIndex: rowNumber,
              },
            },
          },
        ],
      },
    });

    res.status(200).json({
      message: `Record with uniqueId ${uniqueId} deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting record:", error.message);
    res.status(500).json({
      message: "Failed to delete record.",
      error: error.message,
    });
  }
};
