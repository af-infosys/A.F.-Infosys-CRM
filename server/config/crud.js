import { google } from "googleapis";

export class GoogleSheetService {
  constructor() {
    let credentials;
    if (!process.env.GOOGLE_CREDENTIALS_JSON) {
      throw new Error(
        "GOOGLE_CREDENTIALS_JSON environment variable is not set."
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

    this.sheetId = process.env.GOOGLE_SHEET_ID;
    this.client = null;
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

  async insert(sheetId, entity, values) {
    console.log("Insert Called");
    await this.init();
    const range = `${entity}!A1:Z1`;

    return this.sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    });
  }

  async read(sheetId, entity) {
    await this.init();
    const range = `${entity}!A1:Z9999`;

    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    return res.data.values || [];
  }

  async update(sheetId, entity, rowIndex, values) {
    await this.init();
    const safeRowIndex = Number(rowIndex);
    const range = `${entity}!A${safeRowIndex}`;

    return this.sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [values] },
    });
  }

  async deleteRow(entity, rowIndex) {
    await this.init();

    return this.sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.sheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: await this.getSheetId(entity),
                dimension: "ROWS",
                startIndex: rowIndex - 1,
                endIndex: rowIndex,
              },
            },
          },
        ],
      },
    });
  }
}
