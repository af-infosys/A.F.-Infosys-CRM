import dotenv from "dotenv";
dotenv.config();

import { google } from "googleapis";
import { sheets } from "../utils/googleSheets.js";
import Work from "../models/Work.js";

// buildPropertyDescription ફંક્શનને અહીં જ વ્યાખ્યાયિત કરેલ છે
function buildPropertyDescription(formData) {
  const descriptionParts = [];

  // ગણતરીઓને ગુજરાતી અંકોમાં રૂપાંતરિત કરવા માટેનું ફંક્શન
  const convertToArabicToGujaratiNumerals = (number) => {
    const arabicNumerals = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const gujaratiNumerals = ["૦", "૧", "૨", "૩", "૪", "૫", "૬", "૭", "૮", "૯"];
    let gujaratiNumber = String(number);
    for (let i = 0; i < arabicNumerals.length; i++) {
      gujaratiNumber = gujaratiNumber.replace(
        new RegExp(arabicNumerals[i], "g"),
        gujaratiNumerals[i],
      );
    }

    return gujaratiNumber;
  };

  let isFaliyu = false;

  // માળની વિગતોનું વર્ણન
  if (formData.floors && formData.floors.length > 0) {
    formData.floors.forEach((floor) => {
      if (floor.floorType === "ફળિયું") {
        isFaliyu = true;
        return;
      }

      let floorPrefix = "";

      if (floor.floorType && floor.floorType !== "ગ્રાઉન્ડ ફ્લોર") {
        floorPrefix = `ઉપરના ${floor.floorType.replace(" માળ", " માળે")} - `;
      }

      const floorDescriptionParts = [];

      // 2. રૂમની વિગતોનું વર્ણન
      if (floor.roomDetails && floor.roomDetails.length > 0) {
        floor.roomDetails.forEach((room) => {
          // ખાતરી કરો કે સંખ્યાઓ યોગ્ય રીતે રૂપાંતરિત થાય છે
          const slabRoomsNum = Number(room.slabRooms);
          const tinRoomsNum = Number(room.tinRooms);
          const woodenRoomsNum = Number(room.woodenRooms);
          const tileRoomsNum = Number(room.tileRooms);
          const roomType = room.type; // પાકા / કાચા / પ્લોટ

          // રૂમના ભાગોને સ્ટોર કરવા માટે ટેમ્પરરી એરે
          const roomParts = [];

          if (slabRoomsNum > 0) {
            roomParts.push(
              `${roomType} સ્લેબવાળા ${
                room.roomHallShopGodown
              }-${convertToArabicToGujaratiNumerals(slabRoomsNum)}`,
            );
          }

          if (tinRoomsNum > 0) {
            roomParts.push(
              `${roomType} પતરાવાળી ${
                room.roomHallShopGodown
              }-${convertToArabicToGujaratiNumerals(tinRoomsNum)}`,
            );
          }
          if (woodenRoomsNum > 0) {
            roomParts.push(
              `${roomType} પીઢીયાવાળી ${
                room.roomHallShopGodown
              }-${convertToArabicToGujaratiNumerals(woodenRoomsNum)}`,
            );
          }
          if (tileRoomsNum > 0) {
            roomParts.push(
              `${roomType} નળિયાવાળી ${
                room.roomHallShopGodown
              }-${convertToArabicToGujaratiNumerals(tileRoomsNum)}`,
            );
          }

          if (roomParts.length > 0) {
            floorDescriptionParts.push(roomParts.join(", "));
          }
        });
      }

      // 3. જો માળમાં કોઈ વિગતો હોય, તો તેને મુખ્ય વર્ણનમાં ઉમેરો (ફ્લોર પ્રીફિક્સ સાથે)
      if (floorDescriptionParts.length > 0) {
        descriptionParts.push(floorPrefix + floorDescriptionParts.join(", "));
      }
    });
  }

  // રસોડા, બાથરૂમ અને વરંડાની ગણતરી (વર્ણનના અંતે ઉમેરાશે)
  const amenitiesParts = [];

  //
  if (isFaliyu) {
    amenitiesParts.push(`ફળિયું (ખુલ્લી જગ્યા)`);
  }

  // રસોડાની ગણતરી
  if (formData.kitchenCount > 0) {
    amenitiesParts.push(
      `રસોડું-${convertToArabicToGujaratiNumerals(formData.kitchenCount)}`,
    );
  }

  // બાથરૂમની ગણતરી
  if (formData.bathroomCount > 0) {
    amenitiesParts.push(
      `બાથરૂમ-${convertToArabicToGujaratiNumerals(formData.bathroomCount)}`,
    );
  }

  // ફરજો (વરંડા) ની ગણતરી
  if (formData.verandaCount > 0) {
    amenitiesParts.push(
      `ફરજો-${convertToArabicToGujaratiNumerals(formData.verandaCount)}`,
    );
  }

  // મુખ્ય વર્ણન અને સુવિધાઓના વર્ણનને જોડો
  const finalDescription = descriptionParts.concat(amenitiesParts);

  return finalDescription.join(", ");
}

// --- Google Sheets Configuration ---
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
// "1q-Tef_yBkwtE1jfRYaFkjEiWvcctVx3a8YlpDP6W5cI";
// શીટનું નામ તમારી Google Sheet માંના વાસ્તવિક નામ સાથે સુનિશ્ચિત કરો.
// જો તમારી શીટનું નામ "PropertyData" હોય તો તેને આ રીતે રાખો, અન્યથા તેને બદલો.

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
  const workId = req.body.workId;

  try {
    if (!workId) {
      res.status(400).json({
        message: "Work Id not Provided!",
      });
      return;
    }

    const work = await Work.findById(workId);

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

      img1,
      img2,
      img3,
    } = req.body;

    // Basic validation: Check if essential fields are present
    if (!serialNumber || !areaName || !propertyNumber || !ownerName) {
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

      // Column Padding (18-24 / Indices 17-23)
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",

      img1, // Column 25
      img2, // Column 26
      img3, // Column 27
    ];

    // 5. Append the row to the Google Sheet
    // The `append` method adds a new row(s) to the end of the specified sheet.
    const response = await googleSheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${work?.sheetId}_Main!A4`, // રેકોર્ડ્સને ચોથી પંક્તિથી ઉમેરવા માટે
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

export const syncSheetRecord = async (req, res) => {
  const workId = req.body.workId;

  console.log("Syncing Records", req.body.workId);

  try {
    if (!workId) {
      res.status(400).json({
        message: "Work Id not Provided!",
      });
      return;
    }

    const work = await Work.findById(workId);

    // 1. Auth
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const records = req.body.payload || [];

    // 2. Validation
    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({
        message: "Records array is required.",
      });
    }

    // 3. Prepare rows
    const rows = [];

    for (const record of records) {
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
        img1,
        img2,
        img3,
        description,
      } = record;

      // Required field check
      if (!serialNumber || !areaName || !propertyNumber || !ownerName) {
        continue; // skip invalid row
      }

      // const description = buildPropertyDescription(record);

      rows.push([
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
        description,
        JSON.stringify(survayor),

        // Padding columns (18–24)
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",

        img1 || "",
        img2 || "",
        img3 || "",
      ]);
    }

    if (rows.length === 0) {
      return res.status(400).json({
        message: "No valid records to insert.",
      });
    }

    const getResponse = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${work?.sheetId}_Main!A:A`,
    });

    const lastRow = getResponse.data.values
      ? getResponse.data.values.length
      : 0;

    //  const response = await googleSheets.spreadsheets.values.append({
    //   spreadsheetId: SPREADSHEET_ID,
    //   range: `${work?.sheetId}_Main!A4`, // રેકોર્ડ્સને ચોથી પંક્તિથી ઉમેરવા માટે
    //   valueInputOption: "RAW",
    //   resource: {
    //     values: [rowData],
    //   },
    // });

    // 4. Append all rows at once
    const response = await googleSheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${work?.sheetId}_Main!A${lastRow + 1}`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: rows, // 2-3 records ek saath
      },
    });

    console.log(response);

    // 5. Success
    res.status(200).json({
      message: `${rows.length} records successfully added.`,
      success: true,
      updatedRange: response.data.updates.updatedRange,
    });
  } catch (error) {
    console.error("Bulk insert error:", error.message);

    if (error.code === 401 || error.code === 403) {
      res.status(401).json({
        message: "Google Sheets authentication/permission issue.",
      });
    } else {
      res.status(500).json({
        message: "Failed to add records to Google Sheet.",
        error: error.message,
      });
    }
  }
};

export const excelEdit = async (req, res) => {
  const { workId, start } = req.body;

  console.log("Syncing Records", req.body.workId);

  const records = req.body.payload || [];

  try {
    if (!workId) {
      console.log("work id nahi!");
      return res.status(400).json({ message: "Work Id not Provided!" });
    }

    if (start == null || records.length === 0) {
      console.log("start ya record nahi hai", records.length, start);
      return res
        .status(400)
        .json({ message: "Start index or payload missing" });
    }

    const work = await Work.findById(workId);
    const sheetName = `${work?.sheetId}_Main`;
    const range = `${sheetName}!A${start + 4}`;

    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: "RAW",
        data: [
          {
            range,
            values: records,
          },
        ],
      },
    });

    res.status(200).json({
      message: "Records overwritten successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to add records to Google Sheet.",
      error: err.message || "Something went wrong",
    });
  }
};

// Controller function to fetch all records from the Google Sheet.
export const getAllRecords = async (req, res) => {
  const { workId } = req.query;

  try {
    if (!workId) {
      res.status(400).json({
        message: "Work Id not Provided!",
      });
      return;
    }

    const work = await Work.findById(workId);

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // Google Sheet
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${work?.sheetId}_Main!A4:ZZ`,
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

export const getHouseCount = async (id = 0) => {
  try {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // Google Sheet
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${work?.sheetId}_Main!A4:ZZ`,
    });

    const records = response.data.values || [];

    return records.length || 0;
  } catch (error) {
    console.error("Error fetching records from Google Sheet:", error.message);
    return 0;
  }
};

const _getAllAreasWithRowIndex = async (work) => {
  try {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${work?.sheetId}_Areas!A:B`,
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
  } catch (error) {
    console.error("Error fetching records from Google Sheet:", error.message);
    return [];
  }
};

// Controller function to fetch all records from the Google Sheet.
export const getRecord = async (req, res) => {
  try {
    const { workId } = req.query;

    const work = await Work.findById(workId);

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // Google Sheet
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${work?.sheetId}_Main!A4:ZZ`,
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
  const work = await Work.findById(req.body.workId);

  try {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // Fetch current records to find the row number.
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      // Fetch up to Column AA (27th column) to get all current data
      range: `${work?.sheetId}_Main!A4:AA`,
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
      : existingRow[16];
    updatedRow[16] = newSurveyorString;

    // Handle Image Links (Columns 25-27 / Indices 24-26)
    // img1 (25th Column) -> Index 24
    updatedRow[25] = img1 || "";
    // img2 (26th Column) -> Index 25
    updatedRow[26] = img2 || "";
    // img3 (27th Column) -> Index 26
    updatedRow[27] = img3 || "";

    // --- API ERROR FIX ---
    // CRITICAL: Ensure the array length does not exceed 27 elements (indices 0-26).
    // This prevents the "tried writing to column [AB]" error.
    if (updatedRow.length > 27) {
      updatedRow.length = 27;
    }
    // --- END API ERROR FIX ---

    // Update the sheet row
    await googleSheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${work?.sheetId}_Main!A${rowNumber}:AA${rowNumber}`,
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

export const calculateValuation = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Work.findById(projectId);

    // 1. Get full data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${project?.sheetId}_Main!A4:ZZ`,
    });

    const orderValuation = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${project?.sheetId}_OV!A2:D`, // assuming columns: A=Name, B=Amount, C=Percentage,  D=TaxAmount
    });

    const taxAmount = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${project?.sheetId}_Taxes!A2:ZZ`, // assuming columns: A=Name, B=Amount, C=Percentage,  D=TaxAmount
    });

    let records = response.data.values || [];
    let valuationData = orderValuation.data.values || [];
    let otherTaxdata = taxAmount.data.values || [];

    console.log(valuationData, otherTaxdata);

    if (!records.length)
      return res.status(400).json({ error: "No data found" });

    if (!valuationData.length)
      return res.status(400).json({ error: "Fill Ordervaluation First" });

    // 2. Loop through rows and calculate
    let updates = [];
    records.forEach((row, rowIndex) => {
      const propertyCategory = row[7] || ""; // index 7
      const jsonData = row[14] ? JSON.parse(row[14]) : []; // index 14

      const tabConnections = Number(row[11] || "0");

      // ---- Sample Calculation Logic ----
      let propertyPrice = 0;
      let tax = 0;

      let otherTax = {};

      // calculate property price based on category
      if (
        propertyCategory === "પ્લોટ (ફરતી દિવાલ) ખાનગી" ||
        propertyCategory === "પ્લોટ ખાનગી - ખુલ્લી જગ્યા"
      ) {
        propertyPrice = valuationData[14][1];
        tax = valuationData[14][3];
      }

      if (propertyCategory === "રહેણાંક - મકાન") {
        jsonData.forEach((item) => {
          item.roomDetails.forEach((room) => {
            if (room.type === "કાચા" && room.roomHallShopGodown === "રૂમ") {
              let total = 0;

              total += Number(room.tinRooms);
              total += Number(room.woodenRooms);
              total += Number(room.tileRooms);

              propertyPrice += Number(valuationData[0][1]) * total;
              tax +=
                (Number(valuationData[0][1]) *
                  total *
                  Number(valuationData[0][2])) /
                100;
            }

            if (
              room.type === "પાકા" &&
              room.roomHallShopGodown === "રૂમ" &&
              Number(room.slabRooms || 0) === 0
            ) {
              let total = 0;

              total += Number(room.tinRooms);
              total += Number(room.woodenRooms);
              total += Number(room.tileRooms);

              propertyPrice += Number(valuationData[1][1]) * total;
              tax += Number(valuationData[1][3]) * total;
            }

            if (room.type === "પાકા" && room.roomHallShopGodown === "રૂમ") {
              let total = 0;

              total += Number(room.slabRooms);

              propertyPrice += Number(valuationData[2][1]) * total;
              tax += Number(valuationData[2][3]) * total;
            }

            if (
              room.type === "પાકા" &&
              room.roomHallShopGodown === "હોલ મોટો"
            ) {
              let total = 0;

              total += Number(room.slabRooms);
              total += Number(room.tinRooms);
              total += Number(room.woodenRooms);
              total += Number(room.tileRooms);

              propertyPrice += Number(valuationData[12][1]) * total;
              tax +=
                (Number(valuationData[12][1]) *
                  total *
                  Number(valuationData[12][2])) /
                100;
            }
          });
        });

        // console.log(valuationData[0][1]);
      } else if (propertyCategory.trim() === "દુકાન") {
        jsonData.forEach((item) => {
          item.roomDetails.forEach((room) => {
            if (room.roomHallShopGodown === "દુકાન નાની") {
              let total = 0;

              total += Number(room.slabRooms);
              total += Number(room.tinRooms);
              total += Number(room.woodenRooms);
              total += Number(room.tileRooms);

              propertyPrice += Number(valuationData[7][1]) * total;
              tax +=
                (Number(valuationData[7][1]) *
                  total *
                  Number(valuationData[7][2])) /
                100;
            } else if (room.roomHallShopGodown === "દુકાન મોટી") {
              let total = 0;

              total += Number(room.slabRooms);
              total += Number(room.tinRooms);
              total += Number(room.woodenRooms);
              total += Number(room.tileRooms);

              propertyPrice += Number(valuationData[8][1]) * total;
              tax +=
                (Number(valuationData[8][1]) *
                  total *
                  Number(valuationData[8][2])) /
                100;
            }
          });
        });
      } else if (propertyCategory.trim() === "મંડળી - સેવા સહકારી મંડળી") {
        jsonData.forEach((item) => {
          item.roomDetails.forEach((room) => {
            if (
              room.type === "પાકા" ||
              room.roomHallShopGodown === "ગોડાઉન નાનું"
            ) {
              let total = 0;

              total += Number(room.slabRooms);
              total += Number(room.tinRooms);
              total += Number(room.woodenRooms);
              total += Number(room.tileRooms);

              propertyPrice += Number(valuationData[9][1]) * total;
              tax +=
                (Number(valuationData[9][1]) *
                  total *
                  Number(valuationData[9][2])) /
                100;
            }
          });
        });
      } else if (propertyCategory.trim() === "મોબાઈલ ટાવર") {
        let total = 1;

        propertyPrice += Number(valuationData[9][1]) * total;
        tax +=
          (Number(valuationData[17][1]) *
            total *
            Number(valuationData[17][2])) /
          100;
      }

      // Calculating Other Taxes
      if (propertyCategory === "રહેણાંક - મકાન") {
        otherTax.normal_water = { curr: otherTaxdata[0][2] || "0" };

        if (tabConnections) {
          otherTax.special_water = {
            curr: otherTaxdata[1][2] * tabConnections || "0",
          };
        }

        otherTax.light = { curr: otherTaxdata[2][2] || "0" };
        otherTax.cleaning = { curr: otherTaxdata[3][2] || "0" };
      } else if (
        propertyCategory === "દુકાન" ||
        propertyCategory === "પ્રાઈવેટ - સંસ્થાઓ" ||
        propertyCategory === "કારખાના - ઇન્ડસ્ટ્રીજ઼" ||
        propertyCategory === "ટ્રસ્ટ મિલ્કત / NGO" ||
        propertyCategory === "મંડળી - સેવા સહકારી મંડળી" ||
        propertyCategory === "બેંક - અર્ધ સરકારી બેંક" ||
        propertyCategory === "બેંક - પ્રાઇટ બેંક" ||
        propertyCategory === "સરકારી સહાય આવાસ" ||
        propertyCategory === "કોમ્પપ્લેક્ષ" ||
        propertyCategory === "હિરાના કારખાના નાના" ||
        propertyCategory === "હિરાના કારખાના મોટા" ||
        propertyCategory === "મોબાઈલ ટાવર" ||
        propertyCategory === "પેટ્રોલ પંપ, ગેસ પંપ"
      ) {
        otherTax.normal_water = { curr: otherTaxdata[0][3] || "0" };

        if (tabConnections) {
          otherTax.special_water = {
            curr: otherTaxdata[1][3] * tabConnections || "0",
          };
        }

        otherTax.light = { curr: otherTaxdata[2][3] || "0" };
        otherTax.cleaning = { curr: otherTaxdata[3][3] || "0" };
      } else if (
        propertyCategory === "પ્લોટ ખાનગી - ખુલ્લી જગ્યા" ||
        propertyCategory === "પ્લોટ (ફરતી દિવાલ) ખાનગી"
      ) {
        otherTax.normal_water = { curr: otherTaxdata[0][4] || "0" };

        if (tabConnections) {
          otherTax.special_water = {
            curr: otherTaxdata[1][4] * tabConnections || "0",
          };
        }

        otherTax.light = { curr: otherTaxdata[2][4] || "0" };
        otherTax.cleaning = { curr: otherTaxdata[3][4] || "0" };
      } else if (
        propertyCategory === "ધાર્મિક સ્થળ" ||
        propertyCategory === "સરકારી મિલ્ક્ત" ||
        propertyCategory === "બેંક - સરકારી" ||
        propertyCategory === "પ્લોટ સરકારી - કોમનપ્લોટ" ||
        propertyCategory === "પ્લોટ (ફરતી દિવાલ) સરકારી"
      ) {
        otherTax.normal_water = { curr: otherTaxdata[0][5] || "0" };

        if (tabConnections) {
          otherTax.special_water = {
            curr: otherTaxdata[1][5] * tabConnections || "0",
          };
        }

        otherTax.light = { curr: otherTaxdata[2][5] || "0" };
        otherTax.cleaning = { curr: otherTaxdata[3][5] || "0" };
      }

      // ---- Collect updates ----
      const targetRow = rowIndex + 4; // since data starts at row 4
      updates.push({
        range: `${project?.sheetId}_Main!S${targetRow}:U${targetRow}`, // col 18= S, col 20= U
        values: [[propertyPrice, tax, JSON.stringify(otherTax)]],
      });
    });

    // 3. Batch Update
    if (updates.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
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

export const insertRecord = async (req, res) => {
  try {
    const { workId } = req.body;

    if (!workId) {
      return res.status(400).json({ message: "Work Id not provided" });
    }

    const work = await Work.findById(workId);
    if (!work) {
      return res.status(404).json({ message: "Work not found" });
    }

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // Extract form data
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
      // description,
      survayor,
      img1,
      img2,
      img3,
    } = req.body;

    if (!serialNumber || !areaName || !propertyNumber || !ownerName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const description = buildPropertyDescription(req.body);

    const newRow = [
      null, // serialNumber will be set during resequence
      areaName,
      null, // propertyNumber index duplicate for sequence
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
      description,
      JSON.stringify(survayor),

      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",

      img1,
      img2,
      img3,
    ];

    // Step 1: Fetch existing records
    const existingResponse = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${work.sheetId}_Main!A4:ZZ`,
    });

    const records = existingResponse.data.values || [];

    // Step 2: Insert at correct position
    const insertIndex = Math.max(0, Number(serialNumber) - 1);
    records.splice(insertIndex, 0, newRow);

    // Step 3: Re-sequence IDs (Column A & C)
    const resequencedRecords = records.map((row, index) => {
      const id = index + 1;
      row[0] = id; // Column A
      row[2] = id; // Column C
      return row;
    });

    // Step 4: Overwrite sheet data
    await googleSheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${work.sheetId}_Main!A4`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: resequencedRecords,
      },
    });

    res.status(200).json({
      message: "Record inserted and sequence updated successfully",
    });
  } catch (error) {
    console.error("Error inserting record:", error);
    res.status(500).json({
      message: "Failed to insert record",
      error: error.message,
    });
  }
};

export const deleteSheetRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const work = await Work.findById(req.body.workId);

    if (!work) {
      return res.status(404).json({ message: "Work not found" });
    }

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // Step 1: Get sheetId
    const sheetMeta = await googleSheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheet = sheetMeta.data.sheets.find(
      (s) => s.properties.title === `${work.sheetId}_Main`,
    );

    if (!sheet) {
      return res.status(404).json({ message: "Sheet not found" });
    }

    const sheetId = sheet.properties.sheetId;

    // Step 2: Get records from A4 onwards
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${work.sheetId}_Main!A4:ZZ`,
    });

    const records = response.data.values || [];

    const rowIndex = records.findIndex(
      (record) => Number(record[0]) === Number(id),
    );

    if (rowIndex === -1) {
      return res.status(404).json({ message: "Record not found" });
    }

    // Actual row number in sheet (A4 = row 4)
    const rowNumber = rowIndex + 4;

    // Step 3: Delete the row
    await googleSheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: "ROWS",
                startIndex: rowNumber - 1, // 0-based
                endIndex: rowNumber,
              },
            },
          },
        ],
      },
    });

    // Step 4: Re-fetch records after deletion
    const updatedResponse = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${work.sheetId}_Main!A4:ZZ`,
    });

    const updatedRecords = updatedResponse.data.values || [];

    // Step 5: Re-sequence IDs in column A (0) and C (2)
    const resequencedRecords = updatedRecords.map((row, index) => {
      const newId = index + 1;
      row[0] = newId;
      row[2] = newId;
      return row;
    });

    // Step 6: Write updated rows back
    await googleSheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${work.sheetId}_Main!A4`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: resequencedRecords,
      },
    });

    res.status(200).json({
      message: "Record deleted and sequence updated successfully",
    });
  } catch (error) {
    console.error("Error deleting record:", error);
    res.status(500).json({
      message: "Failed to delete record",
      error: error.message,
    });
  }
};

export const getAllAreas = async (req, res) => {
  try {
    const { workId } = req.query;

    const work = await Work.findById(workId);

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${work?.sheetId}_Areas!A:B`, // Read both ID (A) and Area Name (B) columns
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
    const work = await Work.findById(req.body.workId);

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const { areaName } = req.body;
    console.log(areaName, req.body);

    if (!areaName || typeof areaName !== "string" || areaName.trim() === "") {
      return res.status(400).json({
        message: "Area name is required and must be a non-empty string.",
      });
    }

    // Get all existing areas to determine the next ID
    const existingAreas = await _getAllAreasWithRowIndex(work);
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
      range: `${work?.sheetId}_Areas!A:B`, // Append to columns A and B
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
    const work = await Work.findById(req.body.workId);

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
    const allAreas = await _getAllAreasWithRowIndex(work);
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
      range: `${work?.sheetId}_Areas!B${rowNumber}`, // Update column B at the specified row
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
    const work = await Work.findById(req.body.workId);

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    const { id } = req.params; // This `id` is the value from Column A (e.g., "1", "2", "3")

    // Fetch all areas with their row indices to find the row number corresponding to the given ID
    const allAreas = await _getAllAreasWithRowIndex(work);
    // Find the area by matching the ID from req.params.id with the ID in column A
    const areaToDelete = allAreas.find(
      (area) => String(area.id) === String(id),
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
      range: `${work?.sheetId}_Areas!B${rowNumber}`, // Delete column B at the specified row
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

export const seperateCommercialProperties = async (req, res) => {
  // "દુકાન", "પ્રાઈવેટ - સંસ્થાઓ", "કારખાના - ઇન્ડસ્ટ્રીજ" , "ટ્રસ્ટ મિલ્કત / NGO", "મંડળી - સેવા સહકારી મંડળી", "બેંક - સરકારી", "બેંક - અર્ધ સરકારી બેંક", "બેંક - પ્રાઇટ બેંક", "કોમ્પપ્લેક્ષ","હિરાના કારખાના નાના", "હિરાના કારખાના મોટા", "મોબાઈલ ટાવર", "પેટ્રોલ પંપ, ગેસ પંપ",

  try {
    const projectId = req.params.id;

    const prev = await Work.findById(projectId);

    const project = await Work.findByIdAndUpdate(
      projectId,
      {
        details: {
          ...prev.details,
          seperatecommercial: true,
        },
      },
      { new: true },
    );

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // Google Sheet
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${project.sheetId}_Main!A4:ZZ`,
    });

    const records = response.data.values || [];
    const modifiedData = sortAndSequenceProperties(records);

    const startRow = 4;

    const endRow = startRow + modifiedData.length - 1;

    const range = `${project.sheetId}_Main!A${startRow}:AA${endRow}`;

    // 2. Prepare the request body
    const requestBody = {
      values: modifiedData, // This is your entire array of sorted rows
    };

    // 3. Execute the batch update using spreadsheets.values.update
    // We use update here, not batchUpdate, because we are overwriting a single, large range.
    const response2 = await googleSheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: range,
      valueInputOption: "RAW", // Use 'RAW' to treat all input as raw text/values
      requestBody: requestBody,
    });

    console.log(
      `Successfully updated ${response2.data.updatedCells} cells in range: ${response2.data.updatedRange}`,
    );

    res
      .status(200)
      .json({ message: "Commercial Properties Seperated Successfully!" });
  } catch (error) {
    console.error("Error Seperating Commercial Properties:", error.message);
    res.status(500).json({
      message: "Failed to Seperate Commercial Properties.",
      error: error.message,
    });
  }
};

function sortAndSequenceProperties(data) {
  if (!data || data.length === 0) {
    return [];
  }

  // 1. Define the commercial categories in Gujarati
  const commercialCategories = new Set([
    "દુકાન",
    "પ્રાઈવેટ - સંસ્થાઓ",
    "કારખાના - ઇન્ડસ્ટ્રીજ",
    "ટ્રસ્ટ મિલ્કત / NGO",
    "મંડળી - સેવા સહકારી મંડળી",
    "બેંક - સરકારી",
    "બેંક - અર્ધ સરકારી બેંક",
    "બેંક - પ્રાઇટ બેંક",
    "કોમ્પપ્લેક્ષ",
    "હિરાના કારખાના નાના",
    "હિરાના કારખાના મોટા",
    "મોબાઈલ ટાવર",
    "પેટ્રોલ પંપ, ગેસ પંપ",
  ]);

  // The index where the property category is located (index 7)
  const categoryIndex = 7;

  // 2. Separate commercial properties from normal properties
  const normalProperties = [];
  const commercialProperties = [];

  data.forEach((row) => {
    const category = row[categoryIndex] ? row[categoryIndex].trim() : "";

    // Check if the category is commercial
    if (commercialCategories.has(category)) {
      commercialProperties.push(row);
    } else {
      normalProperties.push(row);
    }
  });

  // 3. Combine the arrays: Normal properties first, then commercial properties
  const sortedData = [...normalProperties, ...commercialProperties];

  // 4. Re-sequence the index 0 and index 2 columns
  // The original data started from sequence number 61 (as seen in the first row '61')
  const startSequenceNumber = parseInt(data[0][0], 10); // Get the starting number

  for (let i = 0; i < sortedData.length; i++) {
    const sequenceNumber = startSequenceNumber + i;
    const row = sortedData[i];

    // Update index 0 (main index/serial number)
    row[0] = String(sequenceNumber);

    // Update index 2 (property number)
    row[2] = String(sequenceNumber);
  }

  // Return the final sorted and re-sequenced data
  return sortedData;
}
