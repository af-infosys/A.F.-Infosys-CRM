import User from "../models/User.js";
import Work from "../models/Work.js";
import { sheets } from "../utils/googleSheets.js";
import { getHouseCount } from "./survayController.js";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

// Get details
export const getDetails = async (req, res) => {
  try {
    const works = await Work.findOne({ _id: req.params.id });
    console.log("Work ID: ", req.params.id);

    if (!works) return res.status(404).json({ error: "Work not found" });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${works.sheetId}_OV!A2:D`, // assuming columns: A=Name, B=Price, C=Per, D=Tax
    });

    const rawValuation = response.data.values || [];

    const valuation = rawValuation.map((row) => ({
      name: row[0] || "",
      price: Number(row[1] || 0),
      per: Number(row[2] || 0),
      tax: Number(row[3] || 0),
    }));

    works.details.gaam = works.spot?.gaam;
    works.details.taluka = works.spot?.taluka;
    works.details.district = works.spot?.district;

    res.json({
      details: works.details,
      valuation,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getBillDetails = async (req, res) => {
  try {
    const works = await Work.findOne({ _id: req.params.id });

    if (!works) return res.status(404).json({ error: "Work not found" });

    const houseCount = await getHouseCount(works?.sheetId);

    const bill = {
      gaam: works.spot?.gaam,
      taluka: works.spot?.taluka,
      district: works.spot?.district,
      year: works.details?.akaraniYear,

      invoiceNo: works.details?.invoiceNo,
      description: works.details?.description,
      price: works.details?.price,
      date: works.details?.date,
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

    const updateFields = {
      "details.invoiceNo": invoiceNo,
      "details.description": description,
      "details.price": price,
      "details.date": date,
    };

    const updatedWork = await Work.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    if (!updatedWork) {
      return res.status(404).json({ error: "Work not found for update" });
    }

    const houseCount = await getHouseCount(updatedWork?.sheetId);

    // Prepare the response bill object similar to the get function
    const bill = {
      gaam: updatedWork.spot?.gaam, // Unchanged
      taluka: updatedWork.spot?.taluka, // Unchanged
      district: updatedWork.spot?.district, // Unchanged
      year: updatedWork.details?.akaraniYear, // Unchanged

      invoiceNo: updatedWork.details?.invoiceNo || 0,
      description: updatedWork.details?.description || 0,
      price: updatedWork.details?.price || 0,
      date: updatedWork.details?.date || 0,
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
        const isImage = await Work.findById(workID);

        res.status(200).json({
          message: "Image Akarni!",
          isImage: isImage.details.imageAkarni,
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
    const works = await Work.findOne({ _id: req.params.id });

    if (!works) return res.status(404).json({ error: "Work not found" });

    // Save details in MongoDB

    works.spot = {
      gaam: req.body.details?.gaam,
      taluka: req.body.details?.taluka,
      district: req.body.details?.district,
    };

    works.details = req.body.details;
    await works.save();

    // ✅ Update Google Sheets valuation
    if (req.body.valuation && Array.isArray(req.body.valuation)) {
      const valuationArray = req.body.valuation.map((item) => [
        item.name,
        item.price,
        item.per,
        item.tax,
      ]);

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${works.sheetId}_OV!A2`,
        valueInputOption: "RAW",
        requestBody: {
          values: valuationArray,
        },
      });
    }

    res.json({
      details: works.details,
      valuation: req.body.valuation || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getTaxes = async (req, res) => {
  try {
    const works = await Work.findOne({ _id: req.params.id });

    if (!works) return res.status(404).json({ error: "Work not found" });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${works.sheetId}_Taxes!A2:F`, // assuming columns: A=Name, B=Base, C=Price1,  D=Price2, E=Price3, F=Price4
    });

    const rawTaxes = response.data.values || [];

    const taxes = rawTaxes.map((row) => ({
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
    const works = await Work.findOne({ _id: req.params.id });

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

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${works.sheetId}_Taxes!A2`,
        valueInputOption: "RAW",
        requestBody: {
          values: taxesArray,
        },
      });
    }

    res.json({
      message: "Taxes updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
