import { google } from "googleapis";

export class GoogleSheetService {
  constructor() {
    let credentials;
    if (!process.env.GOOGLE_CREDENTIALS_JSON) {
      throw new Error(
        "GOOGLE_CREDENTIALS_JSON environment variable is not set.",
      );
    }

    const rawCredentialsString = process.env.GOOGLE_CREDENTIALS_JSON;
    credentials = JSON.parse(rawCredentialsString);

    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
    } else {
      throw new Error("Private key missing in Google credentials JSON.");
    }

    this.auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
      ],
    });

    this.sheetId = process.env.CRM_SPREADSHEET_ID;
    this.client = null;

    this.getSheetId = async (sheetId, sheetName) => {
      await this.init();

      const res = await this.sheets.spreadsheets.get({
        spreadsheetId: sheetId,
        ranges: [sheetName],
      });

      return res.data.sheets[0].properties.sheetId;
    };
  }

  async init() {
    if (!this.client) {
      this.client = await this.auth.getClient();
      this.sheets = google.sheets({ version: "v4", auth: this.client });
      this.drive = google.drive({ version: "v3", auth: this.client });
    }
    return this;
  }

  async createNewSpreadsheet(title = "Hero") {
    await this.init();

    const res = await this.sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title,
        },
      },
    });

    console.log("SpreadSheet Created Successfully!");

    return res.data.spreadsheetId;
  }

  async createNewTab(spreadsheetId, sheetName) {
    console.log("Creating new TAB inside spreadsheet:", sheetName);

    await this.init();

    try {
      const request = {
        spreadsheetId,
        resource: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      };

      const response = await this.sheets.spreadsheets.batchUpdate(request);

      console.log("Tab Created Successfully!", response);

      return response.data;
    } catch (err) {
      console.log("ERror Creating new Sheet", err);
      return err;
    }
  }

  async deleteTab(spreadsheetId, sheetName) {
    console.log("Deleting Tab:", sheetName);
    // Deleting Tab using SheetName (Title)

    await this.init();

    try {
      const request = {
        spreadsheetId,
        resource: {
          requests: [
            {
              deleteSheet: {
                sheetId: await this.getSheetId(spreadsheetId, sheetName),
              },
            },
          ],
        },
      };

      const response = await this.sheets.spreadsheets.batchUpdate(request);

      console.log("Tab Deleted Successfully!", response);

      return response.data;
    } catch (err) {
      console.log("ERror Deleting Sheet", err);
      return err;
    }
  }

  async insert(sheetId, entity, values) {
    console.log("Insert Called");
    await this.init();
    const range = `${entity}!A2:Z9999`;

    return this.sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    });
  }

  async read(sheetId, entity) {
    await this.init();
    const range = `${entity}!A2:Z9999`;

    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    return res.data.values || [];
  }

  async findById(sheetId, entity, id) {
    await this.init();
    const range = `${entity}!A2:Z9999`;

    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    return res.data.values.find((row) => row[0] === id);
  }

  async update(spreadsheetId, entity, id, values) {
    await this.init();

    const range = `${entity}!A1:Z9999`;

    // get all rows
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const records = res.data.values || [];

    // find row by ID (column A)
    const rowIndex = records.findIndex((row) => row[0] === id);

    if (rowIndex === -1) {
      throw new Error("Record not found");
    }

    // Google sheet rows start from 1
    const rowNumber = rowIndex + 1;

    const updateRange = `${entity}!A${rowNumber}`;

    return this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: updateRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values],
      },
    });
  }

  async deleteRow(spreadsheetId, entity, id) {
    await this.init();

    // Get sheet metadata
    const meta = await this.sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetInfo = meta.data.sheets.find(
      (s) => s.properties.title === entity,
    );

    if (!sheetInfo) {
      throw new Error(`Sheet "${entity}" not found`);
    }

    const sheetTabId = sheetInfo.properties.sheetId;

    // Fetch rows
    const range = `${entity}!A1:Z9999`;

    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const records = res.data.values || [];

    const rowIndex = records.findIndex((row) => row[0] === id);

    if (rowIndex === -1) {
      throw new Error("Record not found");
    }

    // Delete row
    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheetTabId,
                dimension: "ROWS",
                startIndex: rowIndex,
                endIndex: rowIndex + 1,
              },
            },
          },
        ],
      },
    });

    return { success: true };
  }
}
