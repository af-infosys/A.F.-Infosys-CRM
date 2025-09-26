import dotenv from "dotenv";
dotenv.config();

import { google } from "googleapis";
import { sheets } from "../utils/googleSheets.js";
import Work from "../models/Work.js";

// buildPropertyDescription ફંક્શનને અહીં જ વ્યાખ્યાયિત કરેલ છે
function buildPropertyDescription(formData) {
  const descriptionParts = [];

  const convertToArabicToGujaratiNumerals = (number) => {
    const arabicNumerals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const gujaratiNumerals = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"];
    let gujaratiNumber = String(number);
    for (let i = 0; i < arabicNumerals.length; i++) {
      gujaratiNumber = gujaratiNumber.replace(
        new RegExp(arabicNumerals[i], "g"),
        gujaratiNumerals[i]
      );
    }
    return gujaratiNumber;
  };

  // માળની વિગતોનું વર્ણન
  if (formData.floors && formData.floors.length > 0) {
    formData.floors.forEach((floor, index) => {
      // દરેક માળ માટે રૂમના પ્રકારો અને સંખ્યાઓનું વર્ણન
      // હવે રૂમના પ્રકારો માટે nested લૂપનો ઉપયોગ કરો

      if (floor.roomDetails && floor.roomDetails.length > 0) {
        floor.roomDetails.forEach((room) => {
          // ખાતરી કરો કે સંખ્યાઓ યોગ્ય રીતે રૂપાંતરિત થાય છે
          const slabRoomsNum = Number(room.slabRooms);
          const tinRoomsNum = Number(room.tinRooms);
          const woodenRoomsNum = Number(room.woodenRooms);
          const tileRoomsNum = Number(room.tileRooms);
          const floorType = room.type; // પાકા / કાચા

          if (slabRoomsNum > 0) {
            descriptionParts.push(
              `${floorType} સ્લેબવાળા ${
                room.roomHallShopGodown
              }-${convertToArabicToGujaratiNumerals(slabRoomsNum)}`
            );
          }
          if (tinRoomsNum > 0) {
            descriptionParts.push(
              `${floorType} પતરાવાળી ${
                room.roomHallShopGodown
              }-${convertToArabicToGujaratiNumerals(tinRoomsNum)}`
            );
          }
          if (woodenRoomsNum > 0) {
            descriptionParts.push(
              `${floorType} પીઢીયાવાળી ${
                room.roomHallShopGodown
              }-${convertToArabicToGujaratiNumerals(woodenRoomsNum)}`
            );
          }
          if (tileRoomsNum > 0) {
            descriptionParts.push(
              `${floorType} નળિયાવાળી ${
                room.roomHallShopGodown
              }-${convertToArabicToGujaratiNumerals(tileRoomsNum)}`
            );
          }
        });
      }
    });
  }

  // રસોડાની ગણતરી
  if (formData.kitchenCount > 0) {
    descriptionParts.push(
      `રસોડું-${convertToArabicToGujaratiNumerals(formData.kitchenCount)}`
    );
  }

  // બાથરૂમની ગણતરી
  if (formData.bathroomCount > 0) {
    descriptionParts.push(
      `બાથરૂમ-${convertToArabicToGujaratiNumerals(formData.bathroomCount)}`
    );
  }

  // ફરજો (વરંડા) ની ગણતરી
  if (formData.verandaCount > 0) {
    descriptionParts.push(
      `ફરજો-${convertToArabicToGujaratiNumerals(formData.verandaCount)}`
    );
  }

  // નળની ગણતરી
  // if (formData.tapCount > 0) {
  //   descriptionParts.push(
  //     `નળ-${convertToArabicToGujaratiNumerals(formData.tapCount)}`
  //   );
  // }

  // // શોચાલયની ગણતરી
  // if (formData.toiletCount > 0) {
  //   descriptionParts.push(
  //     `શોચાલય-${convertToArabicToGujaratiNumerals(formData.toiletCount)}`
  //   );
  // }

  // બધા ભાગોને કોમા અને સ્પેસથી જોડો
  return descriptionParts.join(", ");
}

// --- Google Sheets Configuration ---
const SPREADSHEET_ID = "1q-Tef_yBkwtE1jfRYaFkjEiWvcctVx3a8YlpDP6W5cI";
// શીટનું નામ તમારી Google Sheet માંના વાસ્તવિક નામ સાથે સુનિશ્ચિત કરો.
// જો તમારી શીટનું નામ "PropertyData" હોય તો તેને આ રીતે રાખો, અન્યથા તેને બદલો.
const DATA_SHEET = "PropertyData";
const AREAS_SHEET = "Areas"; // વિસ્તારો માટે નવી શીટનું નામ ઉમેર્યું

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
      areaName,
      propertyNumber,
      ownerName,
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
      survayor,
    } = req.body;

    // Basic validation: Check if essential fields are present
    if (
      !serialNumber ||
      !areaName ||
      !propertyNumber ||
      !ownerName ||
      !mobileNumber
    ) {
      return res.status(400).json({ message: "Missing required form fields." });
    }

    const description = buildPropertyDescription(req.body);

    const rowData = [
      serialNumber,
      areaName,
      propertyNumber,
      ownerName,
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
      JSON.stringify(floors),
      description, // વર્ણનને rowData માં ઉમેરો
      JSON.stringify(survayor),
    ];

    // 5. Append the row to the Google Sheet
    // The `append` method adds a new row(s) to the end of the specified sheet.
    const response = await googleSheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DATA_SHEET}!A4`, // રેકોર્ડ્સને ચોથી પંક્તિથી ઉમેરવા માટે
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
      range: `${DATA_SHEET}!A4:ZZ`,
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

const _getAllAreasWithRowIndex = async () => {
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const response = await googleSheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${AREAS_SHEET}!A:B`, // Read both ID (Column A) and Area Name (Column B)
  });

  const values = response.data.values || [];
  const areasWithIndex = [];
  // Assuming header is in row 1, data starts from row 2 (index 1 in 0-based array)
  for (let i = 0; i < values.length; i++) {
    // Iterate through all rows including header for accurate row index
    const row = values[i];
    // Ensure both ID (column A) and Area Name (column B) exist for a valid entry
    if (row[0] && row[1]) {
      areasWithIndex.push({
        id: row[0].trim(), // ID from column A
        name: row[1].trim(), // Area Name from column B
        rowIndex: i + 1, // Actual row number in Google Sheet (1-based)
      });
    }
  }
  return areasWithIndex;
};

// Controller function to fetch all records from the Google Sheet.
export const getRecord = async (req, res) => {
  try {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // Google Sheet
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DATA_SHEET}!A4:ZZ`,
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
      range: `${DATA_SHEET}!A4:ZZ`,
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

    const rowNumber = rowIndex + 4; // Adjust for A4 start

    // Convert req.body to a flat array
    const {
      serialNumber,
      areaName,
      propertyNumber,
      ownerName,
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
    } = req.body;

    const description = buildPropertyDescription(req.body);

    const updatedRow = [
      serialNumber,
      areaName,
      propertyNumber,
      ownerName,
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
      JSON.stringify(floors), // Floors stored as JSON string
      description,
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

export const calculateValuation = async (req, res) => {
  try {
    const projectId = req.params.id;
    console.log("Project Id", projectId);
    const project = await Work.findById(projectId);
    const sheetId = project?.sheetId || "";

    if (!sheetId) {
      return res.status(400).json({ error: "No sheetId found" });
    }

    // 1. Get full data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "PropertyData!A4:ZZ",
    });

    let records = response.data.values || [];

    // 2. Loop through rows and calculate
    let updates = [];
    records.forEach((row, rowIndex) => {
      const propertyCategory = row[7] || ""; // index 7
      const jsonData = row[14] ? JSON.parse(row[14]) : []; // index 14

      // ---- Sample Calculation Logic ----
      let propertyPrice = 0;
      let tax = 0;

      // Example: calculate property price based on category
      if (propertyCategory.trim() === "રહેણાંક") {
        propertyPrice = 500000 + jsonData.length * 10000;
      } else if (propertyCategory.trim() === "વાણિજ્ય") {
        propertyPrice = 1000000 + jsonData.length * 20000;
      }

      // Tax = 10% of property price
      tax = propertyPrice * 0.1;

      // ---- Collect updates ----
      const targetRow = rowIndex + 4; // since data starts at row 4
      updates.push({
        range: `PropertyData!S${targetRow}:T${targetRow}`, // col 18= S, col 19= T
        values: [[propertyPrice, tax]],
      });
    });

    // 3. Batch Update
    if (updates.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          valueInputOption: "USER_ENTERED",
          data: updates,
        },
      });
    }

    res.json({
      message: "Valuation calculated & updated",
      data: updates.length,
    });
  } catch (err) {
    console.error("Error in calculateValuation:", err);
    res.status(500).json({ error: err.message });
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

    // Step 2: Get the current records from A4 onwards
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${DATA_SHEET}!A4:ZZ`,
    });

    const records = response.data.values || [];
    const { id } = req.params;

    const rowIndex = records.findIndex(
      (record) => Number(record[0]) === Number(id)
    );

    if (rowIndex === -1) {
      return res.status(404).json({ message: "Record not found" });
    }

    const rowNumber = rowIndex + 3; // Row index is 0-based, A4 is row 4, so shift by +3

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

export const getAllAreas = async (req, res) => {
  try {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${AREAS_SHEET}!A:B`, // Read both ID (A) and Area Name (B) columns
    });

    const values = response.data.values || [];
    const areas = [];

    // Assuming header is in row 1, data starts from row 2.
    // Start from index 1 to skip the header row.
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (row[0] && row[1]) {
        // Ensure both ID and Area Name exist
        areas.push({
          id: row[0].trim(), // ID from column A
          name: row[1].trim(), // Area Name from column B
        });
      }
    }

    res.status(200).json({
      message: "Areas fetched successfully!",
      data: areas,
    });
  } catch (error) {
    console.error("Error fetching areas from Google Sheet:", error.message);
    res.status(500).json({
      message: "Failed to fetch areas from Google Sheet.",
      error: error.message,
    });
  }
};

export const addArea = async (req, res) => {
  try {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const { areaName } = req.body;

    if (!areaName || typeof areaName !== "string" || areaName.trim() === "") {
      return res.status(400).json({
        message: "Area name is required and must be a non-empty string.",
      });
    }

    // Get all existing areas to determine the next ID
    const existingAreas = await _getAllAreasWithRowIndex();
    let nextId = 1;

    // Filter out potential header row and non-numeric IDs, then find the max
    const numericIds = existingAreas
      .filter((area) => area.rowIndex > 1) // Exclude header row from ID calculation
      .map((area) => parseInt(area.id, 10))
      .filter((id) => !isNaN(id));

    if (numericIds.length > 0) {
      nextId = Math.max(...numericIds) + 1;
    }

    // Append the new area with auto-incremented ID to the AREAS_SHEET
    const response = await googleSheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${AREAS_SHEET}!A:B`, // Append to columns A and B
      valueInputOption: "RAW",
      resource: {
        values: [[nextId, areaName.trim()]], // New ID in A, Area Name in B
      },
    });

    res.status(201).json({
      message: "Area added successfully to Google Sheet!",
      area: { id: nextId, name: areaName.trim() },
      data: response.data,
    });
  } catch (error) {
    console.error("Error adding area to Google Sheet:", error.message);
    res.status(500).json({
      message: "Failed to add area to Google Sheet.",
      error: error.message,
    });
  }
};

export const EditArea = async (req, res) => {
  try {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const { id } = req.params; // This `id` is the value from Column A (e.g., "1", "2", "3")
    const { newAreaName } = req.body;

    if (
      !newAreaName ||
      typeof newAreaName !== "string" ||
      newAreaName.trim() === ""
    ) {
      return res.status(400).json({
        message: "New area name is required and must be a non-empty string.",
      });
    }

    // Fetch all areas with their row indices to find the row number corresponding to the given ID
    const allAreas = await _getAllAreasWithRowIndex();
    // Find the area by matching the ID from req.params.id with the ID in column A
    const areaToEdit = allAreas.find((area) => String(area.id) === String(id));

    if (!areaToEdit) {
      return res
        .status(404)
        .json({ message: `Area with ID '${id}' not found.` });
    }

    const rowNumber = areaToEdit.rowIndex; // Get the actual row number in the Google Sheet

    // Update the specific cell (Column B) in the AREAS_SHEET at the found row number
    const response = await googleSheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${AREAS_SHEET}!B${rowNumber}`, // Update column B at the specified row
      valueInputOption: "RAW",
      resource: {
        values: [[newAreaName.trim()]], // Wrap in a nested array for a single cell update
      },
    });

    res.status(200).json({
      message: `Area with ID '${id}' updated successfully!`,
      updatedArea: { id: id, name: newAreaName.trim(), row: rowNumber },
      data: response.data,
    });
  } catch (error) {
    console.error("Error editing area in Google Sheet:", error.message);
    res.status(500).json({
      message: "Failed to edit area in Google Sheet.",
      error: error.message,
    });
  }
};

export const DeleteArea = async (req, res) => {
  try {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const { id } = req.params; // This `id` is the value from Column A (e.g., "1", "2", "3")

    // Fetch all areas with their row indices to find the row number corresponding to the given ID
    const allAreas = await _getAllAreasWithRowIndex();
    // Find the area by matching the ID from req.params.id with the ID in column A
    const areaToDelete = allAreas.find(
      (area) => String(area.id) === String(id)
    );

    if (!areaToDelete) {
      return res
        .status(404)
        .json({ message: `Area with ID '${id}' not found.` });
    }

    const rowNumber = areaToDelete.rowIndex; // Get the actual row number in the Google Sheet

    // Delete the specific cell (Column B) in the AREAS_SHEET at the found row number
    const response = await googleSheets.spreadsheets.values.delete({
      spreadsheetId: SPREADSHEET_ID,
      range: `${AREAS_SHEET}!B${rowNumber}`, // Delete column B at the specified row
    });

    res.status(200).json({
      message: `Area with ID '${id}' deleted successfully!`,
      deletedArea: { id: id, row: rowNumber },
      data: response.data,
    });
  } catch (error) {
    console.error("Error deleting area in Google Sheet:", error.message);
    res.status(500).json({
      message: "Failed to delete area in Google Sheet.",
      error: error.message,
    });
  }
};
