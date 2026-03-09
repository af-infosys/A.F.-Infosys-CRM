import { GoogleSheetService } from "../config/crud.js";
import User from "../models/User.js";
import Work from "../models/Work.js";
import { sheets } from "../utils/googleSheets.js";
import { getHouseCount } from "./survayController.js";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

const sheet = new GoogleSheetService();

// Get details
export const getDetails = async (req, res) => {
  try {
    // const works = await Work.findOne({ _id: req.params.id });
    const workId = req.params.id;
    console.log("Work ID: ", req.params.id);

    const work = await sheet.findById(
      process.env.GOOGLE_SHEET_ID,
      "Index",
      workId,
    );
    if (!work) return res.status(404).json({ error: "Work not found" });

    // const response = await sheets.spreadsheets.values.get({
    //   spreadsheetId: SPREADSHEET_ID,
    //   range: `${workId}_OV!A2:D`, // assuming columns: A=Name, B=Price, C=Per, D=Tax
    // });

    // const rawValuation = response.data.values || [];
    const rawValuation = work[4] ? JSON.parse(work[4]) : [];

    const valuation = rawValuation?.map((row) => ({
      name: row[0] || "",
      price: Number(row[1] || 0),
      per: Number(row[2] || 0),
      tax: Number(row[3] || 0),
    }));

    // works.details.gaam = works.spot?.gaam;
    // works.details.taluka = works.spot?.taluka;
    // works.details.district = works.spot?.district;

    const spot = JSON.parse(work[1]);
    const details = JSON.parse(work[2]);

    details.gaam = spot?.gaam;
    details.taluka = spot?.taluka;
    details.district = spot?.district;

    res.json({
      details,
      valuation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getBillDetails = async (req, res) => {
  try {
    // const works = await Work.findOne({ _id: req.params.id });
    const workId = req.params.id;

    // if (!works) return res.status(404).json({ error: "Work not found" });

    const houseCount = await getHouseCount(workId);

    const work = await sheet.findById(
      process.env.GOOGLE_SHEET_ID,
      "Index",
      workId,
    );

    const spot = JSON.parse(work[1]);
    const details = JSON.parse(work[2]);

    const bill = {
      gaam: spot?.gaam,
      taluka: spot?.taluka,
      district: spot?.district,
      year: details?.akaraniYear,

      invoiceNo: details?.invoiceNo,
      description: details?.description,
      price: details?.price,
      date: details?.date,
      houseCount,
    };

    res.json({
      bill,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const updateBillDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const { invoiceNo, description, price, date } = req.body;

    const work = await sheet.findById(process.env.GOOGLE_SHEET_ID, "Index", id);

    work[2] = JSON.stringify({
      ...JSON.parse(work[2] || {}),
      invoiceNo,
      description,
      price,
      date,
    });

    const updatedWork = await sheet.update(
      process.env.GOOGLE_SHEET_ID,
      "Index",
      id,
      work,
    );

    const houseCount = await getHouseCount(id);

    const spot = JSON.parse(work[1]);
    const details = JSON.parse(work[2]);

    // Prepare the response bill object similar to the get function
    const bill = {
      gaam: spot?.gaam, // Unchanged
      taluka: spot?.taluka, // Unchanged
      district: spot?.district, // Unchanged
      year: details?.akaraniYear, // Unchanged

      invoiceNo: details?.invoiceNo || 0,
      description: details?.description || 0,
      price: details?.price || 0,
      date: details?.date || 0,
      houseCount,
    };

    console.log("Updated Bill Details: ", bill);
    res.json({
      message: "Bill details updated successfully",
      bill,
    });
  } catch (err) {
    console.error(err);
    // You might want to check for specific validation errors here
    res.status(500).json({ error: "Server error during update" });
  }
};

export const getImageMode = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(userId);

    if (!userId) {
      res.status(400).json({
        message: "User Id not Provided!",
      });
      return;
    }

    const user = await User.findById(userId);
    console.log(user);

    if (user) {
      const workID = user?.work;
      console.log(workID);

      if (workID) {
        const isImage = await sheet.findById(
          process.env.GOOGLE_SHEET_ID,
          "Index",
          workID,
        );

        res.status(200).json({
          message: "Image Akarni!",
          isImage: JSON.parse(isImage[2] || {})?.imageAkarni || false,
        });
      }
    } else {
      res.status(404).json({
        message: "User Not Found!",
        isImage: false,
      });
    }
  } catch (err) {
    console.log("Error While Fetching User Work Spot,", err);
    res.status(500).json({ message: "DB Error", error: err });
  }
};

// Add/update details
export const addDetails = async (req, res) => {
  try {
    // const works = await Work.findOne({ _id: req.params.id });
    const works = await sheet.findById(
      process.env.GOOGLE_SHEET_ID,
      "Index",
      req.params.id,
    );

    if (!works) return res.status(404).json({ error: "Work not found" });

    // Save details in MongoDB

    works[1] = JSON.stringify(
      {
        gaam: req.body.details?.gaam,
        taluka: req.body.details?.taluka,
        district: req.body.details?.district,
      } || {},
    );

    works[2] = JSON.stringify(req.body.details || {});

    // ✅ Update Google Sheets valuation
    if (req.body.valuation && Array.isArray(req.body.valuation)) {
      const valuationArray = req.body.valuation.map((item) => [
        item.name,
        item.price,
        item.per,
        item.tax,
      ]);

      // await sheets.spreadsheets.values.update({
      //   spreadsheetId: SPREADSHEET_ID,
      //   range: `${works.sheetId}_OV!A2`,
      //   valueInputOption: "RAW",
      //   requestBody: {
      //     values: valuationArray,
      //   },
      // });

      works[4] = JSON.stringify(valuationArray || {});
    }

    const updatedWork = await sheet.update(
      process.env.GOOGLE_SHEET_ID,
      "Index",
      req.params.id,
      works,
    );

    res.json({
      details: works[2] ? JSON.parse(works[2]) : {},
      valuation: req.body.valuation || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getTaxes = async (req, res) => {
  try {
    const works = await sheet.findById(
      process.env.GOOGLE_SHEET_ID,
      "Index",
      req.params.id,
    );

    if (!works) return res.status(404).json({ error: "Work not found" });

    // const response = await sheets.spreadsheets.values.get({
    //   spreadsheetId: SPREADSHEET_ID,
    //   range: `${works.sheetId}_Taxes!A2:F`, // assuming columns: A=Name, B=Base, C=Price1,  D=Price2, E=Price3, F=Price4
    // });

    // const rawTaxes = response.data.values || [];
    const rawTaxes = works[5] ? JSON.parse(works[5]) : [];

    const taxes = rawTaxes?.map((row) => ({
      name: row[0] || "",
      format: row[1] || "",
      values: {
        residence: Number(row[2] || 0),
        nonResidence: Number(row[3] || 0),
        plot: Number(row[4] || 0),
        commonPlot: Number(row[5] || 0),
      },
    }));

    res.json({
      taxes,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Add/update Taxes
export const addTaxes = async (req, res) => {
  try {
    const works = await sheet.findById(
      process.env.GOOGLE_SHEET_ID,
      "Index",
      req.params.id,
    );

    if (!works) return res.status(404).json({ error: "Work not found" });

    // ✅ Update Google Sheets valuation
    if (req.body.taxes && Array.isArray(req.body.taxes)) {
      const taxesArray = req.body.taxes.map((item) => [
        item.name,
        item.format,
        item.values?.residence,
        item.values?.nonResidence,
        item.values?.plot,
        item.values?.commonPlot,
      ]);

      // await sheets.spreadsheets.values.update({
      //   spreadsheetId: SPREADSHEET_ID,
      //   range: `${works.sheetId}_Taxes!A2`,
      //   valueInputOption: "RAW",
      //   requestBody: {
      //     values: taxesArray,
      //   },
      // });

      works[5] = JSON.stringify(taxesArray || {});
    }

    const updatedWork = await sheet.update(
      process.env.GOOGLE_SHEET_ID,
      "Index",
      req.params.id,
      works,
    );

    res.json({
      message: "Taxes updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
