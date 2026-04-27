import dotenv from "dotenv";
dotenv.config();

import { google } from "googleapis";
import { sheets } from "../utils/googleSheets.js";
import Work from "../models/Work.js";
import { GoogleSheetService } from "../config/crud.js";

const sheet = new GoogleSheetService();

// --- Google Sheets Configuration ---
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

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

console.log("✅ Google Sheets credentials successfully parsed and formatted.");

// --- Google Sheets Authentication ---
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const editSheetRecord = async (req, res) => {
  const workId = req.body.workId;

  try {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // Fetch current records to find the row number.
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      // Fetch up to Column AA (27th column) to get all current data
      range: `${workId}_Main!A4:AA`,
    });

    const records = response.data.values || [];
    const { id } = req.params;

    // Find the matching row index based on the serial number (ID) in column A (index 0)
    const rowIndex = records.findIndex(
      (record) => Number(record[0]) === Number(id),
    );
    if (rowIndex === -1) {
      return res.status(404).json({ message: "Record not found" });
    }

    const rowNumber = rowIndex + 4; // Adjust for A4 start

    // --- 1. Get Existing Row Data and New Request Data ---
    const existingRow = records[rowIndex];

    // Convert req.body to a flat array, including the new fields.
    const {
      serialNumber,
      areaName,
      propertyNumber,
      ownerName,
      occName,
      oldPropertyNumber,
      mobileNumber,
      propertyNameOnRecord,
      houseCategory,
      kitchenCount,
      bathroomCount,
      verandaCount,
      tapCount,
      toiletCount,
      remarks,
      floors,
      survayor, // Surveyor data is now included for potential use/preservation
      img1, // Image 1 link (25th Column / Index 24)
      img2, // Image 2 link (26th Column / Index 25)
      img3, // Image 3 link (27th Column / Index 26)
    } = req.body;

    const description = buildPropertyDescription(req.body);

    // --- 2. Create the Updated Row by Cloning and Injecting ---
    // Create a copy of the existing row to maintain its original structure and content,
    // ensuring data in padding columns (18-24) is preserved.
    const updatedRow = [...existingRow];

    // Define the new values to be injected at specific indices
    const newValues = [
      serialNumber, // Index 0 (Col 1)
      areaName, // Index 1
      propertyNumber, // Index 2
      ownerName, // Index 3
      occName, // New(4)
      oldPropertyNumber, // Index 4
      mobileNumber, // Index 5
      propertyNameOnRecord, // Index 6
      houseCategory, // Index 7
      kitchenCount, // Index 8
      bathroomCount, // Index 9
      verandaCount, // Index 10
      tapCount, // Index 11
      toiletCount, // Index 12
      remarks, // Index 13
      JSON.stringify(floors), // Index 14
      description, // Index 15
    ];

    // Inject standard survey fields (Indices 0 through 15)
    newValues.forEach((val, index) => {
      updatedRow[index] = val;
    });

    // Handle Surveyor Data (Column 17 / Index 16):
    // Since you don't want to edit it, we explicitly use the existing value
    // UNLESS the new request explicitly sends a 'survayor' object.
    const newSurveyorString = survayor
      ? JSON.stringify(survayor)
      : existingRow[17];
    updatedRow[17] = newSurveyorString;

    // Handle Image Links (Columns 25-27 / Indices 24-26)
    // img1 (25th Column) -> Index 24
    updatedRow[26] = JSON.stringify([img1, img2, img3]) || [];

    // --- API ERROR FIX ---
    // CRITICAL: Ensure the array length does not exceed 27 elements (indices 0-26).
    // This prevents the "tried writing to column [AB]" error.
    if (updatedRow.length > 28) {
      updatedRow.length = 28;
    }
    // --- END API ERROR FIX ---

    // Update the sheet row
    await googleSheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${workId}_Main!A${rowNumber}:AA${rowNumber}`,
      valueInputOption: "RAW",
      requestBody: {
        values: [updatedRow],
      },
    });

    res.status(200).json({
      message: "Record updated successfully!",
      updatedRow,
    });
  } catch (error) {
    console.error("Error updating record:", error.message);
    res.status(500).json({
      message: "Failed to update record",
      error: error.message,
    });
  }
};
