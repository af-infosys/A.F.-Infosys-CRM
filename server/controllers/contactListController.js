import dotenv from "dotenv";
dotenv.config();

import { google } from "googleapis";

// --- Google Sheets Configuration ---
const SPREADSHEET_ID = process.env.CRM_SPREADSHEET_ID;
// શીટનું નામ તમારી Google Sheet માંના વાસ્તવિક નામ સાથે સુનિશ્ચિત કરો.
// જો તમારી શીટનું નામ "PropertyData" હોય તો તેને આ રીતે રાખો, અન્યથા તેને બદલો.
const DATA_SHEET = "ContactList";

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

export const addSheetRecord = async (req, res) => {
  try {
    // 1. Get the authenticated client
    const client = await auth.getClient();

    // 2. Get the Google Sheets API instance
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // 3. Extract data from the request body
    const {
      serialNumber,
      customerFullName,

      mobileNo,
      whatsaapNo,
      category,
      village,
      villageOfCharge,
      taluko,
      jilla,

      whatBusiness,
      workVillage,
      clientAnswer,
      numberOfHouses,
      price,
      estimatedBill,
      budget,
      dateOfCall,
      meetingDate,

      telecaller,
    } = req.body;

    // Basic validation: Check if essential fields are present
    if (!serialNumber || !customerFullName || !village) {
      return res.status(400).json({ message: "Missing required form fields." });
    }

    const rowData = [
      serialNumber || "",
      customerFullName || "",

      mobileNo || "",
      whatsaapNo || "",
      category || "",
      village || "",
      villageOfCharge || "",
      taluko || "",
      jilla || "",

      whatBusiness || "",
      workVillage || "",
      clientAnswer || "",
      numberOfHouses || "",
      price || "",
      estimatedBill || "",
      budget || "",
      dateOfCall || "",
      meetingDate || "",

      JSON.stringify(telecaller || {}),
    ];

    // 5. Append the row to the Google Sheet
    const response = await googleSheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DATA_SHEET}!A5`, // રેકોર્ડ્સને ચોથી પંક્તિથી ઉમેરવા માટે
      valueInputOption: "RAW",
      resource: {
        values: [rowData],
      },
    });

    // 6. Send a success response
    res.status(200).json({
      message: "Record successfully added to Google Sheet!",
      data: response.data, // Contains information about the appended data (e.g., updated range)
    });
  } catch (error) {
    // 7. Handle errors
    console.error("Error adding record to Google Sheet:", error.message);
    if (error.code === 401 || error.code === 403) {
      res.status(401).json({
        message:
          "Authentication or permission error with Google Sheets API. Check KEY_FILE_PATH and sheet sharing settings.",
      });
    } else {
      res.status(500).json({
        message: "Failed to add record to Google Sheet.",
        error: error.message,
      });
    }
  }
};

// Controller function to fetch all records from the Google Sheet.
export const getAllRecords = async (req, res) => {
  try {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // Google Sheet
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DATA_SHEET}!A5:ZZ`,
    });

    const records = response.data.values || [];

    res.status(200).json({
      message: "Records fetched successfully!",
      data: records,
    });
  } catch (error) {
    console.error("Error fetching records from Google Sheet:", error.message);
    res.status(500).json({
      message: "Failed to fetch records from Google Sheet.",
      error: error.message,
    });
  }
};

// Controller function to fetch all records from the Google Sheet.
export const getRecord = async (req, res) => {
  try {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // Google Sheet
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DATA_SHEET}!A5:ZZ`,
    });

    const records = response.data.values || [];

    const { id } = req.params;

    const record =
      records.find((record) => Number(record[0]) === Number(id)) || [];

    res.status(200).json({
      message: "Records fetched successfully!",
      data: record,
    });
  } catch (error) {
    console.error("Error fetching records from Google Sheet:", error.message);
    res.status(500).json({
      message: "Failed to fetch records from Google Sheet.",
      error: error.message,
    });
  }
};

export const editSheetRecord = async (req, res) => {
  try {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // Fetch current records
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DATA_SHEET}!A5:ZZ`,
    });

    const records = response.data.values || [];
    const { id } = req.params;

    // Find the matching row index
    const rowIndex = records.findIndex(
      (record) => Number(record[0]) === Number(id)
    );
    if (rowIndex === -1) {
      return res.status(404).json({ message: "Record not found" });
    }

    const rowNumber = rowIndex + 5; // Adjust for A5 start

    // Convert req.body to a flat array
    const {
      serialNumber,
      customerFullName,

      mobileNo,
      whatsaapNo,
      category,
      village,
      villageOfCharge,
      taluko,
      jilla,

      whatBusiness,
      workVillage,
      clientAnswer,
      numberOfHouses,
      price,
      estimatedBill,
      budget,
      dateOfCall,
      meetingDate,

      telecaller,
    } = req.body;

    const updatedRow = [
      serialNumber,
      customerFullName,

      mobileNo,
      whatsaapNo,
      category,
      village,
      villageOfCharge,
      taluko,
      jilla,

      whatBusiness,
      workVillage,
      clientAnswer,
      numberOfHouses,
      price,
      estimatedBill,
      budget,
      dateOfCall,
      meetingDate,

      JSON.stringify(telecaller),
    ];

    // Update the sheet row
    await googleSheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DATA_SHEET}!A${rowNumber}:ZZ${rowNumber}`,
      valueInputOption: "USER_ENTERED",
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

export const deleteSheetRecord = async (req, res) => {
  try {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // Step 1: Get the sheetId (numeric ID of the sheet)
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

    // Step 2: Get the current records from A5 onwards
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DATA_SHEET}!A5:ZZ`,
    });

    const records = response.data.values || [];
    const { id } = req.params;

    const rowIndex = records.findIndex(
      (record) => Number(record[0]) === Number(id)
    );

    if (rowIndex === -1) {
      return res.status(404).json({ message: "Record not found" });
    }

    const rowNumber = rowIndex + 4; // Row index is 0-based, A5 is row 5, so shift by +4

    // Step 3: Delete the actual row using batchUpdate
    await googleSheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: rowNumber,
                endIndex: rowNumber + 1,
              },
            },
          },
        ],
      },
    });

    res.status(200).json({
      message: "Record deleted successfully",
      deletedRow: rowNumber + 1,
    });
  } catch (error) {
    console.error("Error deleting record:", error.message);
    res.status(500).json({
      message: "Failed to delete record",
      error: error.message,
    });
  }
};
