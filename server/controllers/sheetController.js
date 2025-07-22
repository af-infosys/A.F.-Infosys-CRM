import dotenv from "dotenv";
dotenv.config();

import { google } from "googleapis";

// buildPropertyDescription ફંક્શનને અહીં જ વ્યાખ્યાયિત કરેલ છે
function buildPropertyDescription(formData) {
  const descriptionParts = [];

  /**
   * અરબી અંકોને ગુજરાતી અંકોમાં રૂપાંતરિત કરે છે.
   * @param {number|string} number - રૂપાંતરિત કરવાની સંખ્યા.
   * @returns {string} ગુજરાતી અંકોમાં રૂપાંતરિત થયેલ સ્ટ્રિંગ.
   */
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
      // ખાતરી કરો કે slabRooms, tinRooms, woodenRooms, tileRooms નંબર તરીકે છે
      const slabRoomsNum = Number(floor.slabRooms);
      const tinRoomsNum = Number(floor.tinRooms);
      const woodenRoomsNum = Number(floor.woodenRooms);
      const tileRoomsNum = Number(floor.tileRooms);

      if (slabRoomsNum > 0) {
        descriptionParts.push(
          `${floor.type} સ્લેબવાળા ${
            floor.roomHallShopGodown
          }-${convertToArabicToGujaratiNumerals(slabRoomsNum)}`
        );
      }
      if (tinRoomsNum > 0) {
        descriptionParts.push(
          `${floor.type} પતરાવાળી ${
            floor.roomHallShopGodown
          }-${convertToArabicToGujaratiNumerals(tinRoomsNum)}`
        );
      }
      if (woodenRoomsNum > 0) {
        descriptionParts.push(
          `${floor.type} પીઢીયાવાળી ${
            floor.roomHallShopGodown
          }-${convertToArabicToGujaratiNumerals(woodenRoomsNum)}`
        );
      }
      if (tileRoomsNum > 0) {
        descriptionParts.push(
          `${floor.type} નળિયાવાળી ${
            floor.roomHallShopGodown
          }-${convertToArabicToGujaratiNumerals(tileRoomsNum)}`
        );
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
  if (formData.tapCount > 0) {
    descriptionParts.push(
      `નળ-${convertToArabicToGujaratiNumerals(formData.tapCount)}`
    );
  }

  // શોચાલયની ગણતરી
  if (formData.toiletCount > 0) {
    descriptionParts.push(
      `શોચાલય-${convertToArabicToGujaratiNumerals(formData.toiletCount)}`
    );
  }

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

/**
 * Controller function to add a new record (form submission) to the Google Sheet.
 * This function expects a JSON body from the client containing the form data.
 *
 * @param {object} req - The Express request object, containing the form data in `req.body`.
 * @param {object} res - The Express response object, used to send back success or error messages.
 */

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

    // 4. Prepare the row data for Google Sheets
    // buildPropertyDescription ફંક્શનને req.body પાસ કરો
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

// Controller function to fetch all unique areas (societies) from the Google Sheet.
export const getAllAreas = async (req, res) => {
  try {
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });

    // "Areas" શીટમાંથી ડેટા વાંચો
    const response = await googleSheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${AREAS_SHEET}!B:B`, // A કૉલમમાંથી તમામ ડેટા વાંચો
    });

    const values = response.data.values || [];
    const uniqueAreas = new Set();

    // પ્રથમ કૉલમમાંથી (ઇન્ડેક્સ 0) અનન્ય વિસ્તારો કાઢો
    // હેડર પંક્તિને છોડવા માટે i ને 1 થી શરૂ કરો
    for (let i = 0; i < values.length; i++) {
      // જો હેડર ન હોય તો 0 થી શરૂ કરો, અન્યથા 1 થી
      if (values[i][0]) {
        // જો સેલ ખાલી ન હોય
        uniqueAreas.add(values[i][0].trim());
      }
    }

    res.status(200).json({
      message: "Areas fetched successfully!",
      data: Array.from(uniqueAreas), // Set ને એરેમાં રૂપાંતરિત કરો
    });
  } catch (error) {
    console.error("Error fetching areas from Google Sheet:", error.message);
    res.status(500).json({
      message: "Failed to fetch areas from Google Sheet.",
      error: error.message,
    });
  }
};
