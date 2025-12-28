import User from "../models/User.js";
import Work from "../models/Work.js";
import dotenv from "dotenv";
dotenv.config();

import { GoogleSheetService } from "./../config/crud.js";
const sheet = new GoogleSheetService();

export const getWorkSpot = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      res.status(400).json({
        message: "User Id not Provided!",
      });
      return;
    }

    const user = await User.findById(userId);

    if (user) {
      const workID = user?.work;

      if (workID) {
        const work = await Work.findById(workID);
        if (work) {
          res.status(200).json({
            message: "Work Spot Fetched Successfully!",
            work,
          });
        } else {
          res.status(404).json({
            message: "Work Spot not Found!",
          });
        }
      }
    } else {
      res.status(404).json({
        message: "User Not Found!",
      });
    }
  } catch (err) {
    console.log("Error While Fetching User Work Spot,", err);
    res.status(500).json({ message: "DB Error", error: err });
  }
};

export const getBillWork = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      res.status(400).json({
        message: "User Id not Provided!",
      });
      return;
    }

    const user = await User.findById(userId);

    if (user) {
      const workID = user?.work;

      const dataId = process.env.WORK_SHEET_ID;

      if (workID) {
        const data = await sheet.read(dataId, "GramSuvidha");
        const details = data
          .filter((item) => item.length > 0)
          .map((arr) => {
            return {
              id: arr[0],
              password: arr[1],
              gaam: arr[2],
              taluko: arr[3],
              district: arr[4],
            };
          });

        const work = details.find((item) => item.id === workID);

        if (work) {
          res.status(200).json({
            message: "Work Spot Fetched Successfully!",
            work,
          });
        } else {
          res.status(404).json({
            message: "Work Spot not Found!",
            work: {
              notassigned: true,
            },
          });
        }
      }
    } else {
      res.status(404).json({
        message: "User Not Found!",
      });
    }
  } catch (err) {
    console.log("Error While Fetching User Work Spot,", err);
    res.status(500).json({ message: "DB Error", error: err });
  }
};

// --- Get All Work Entries ---
export const getAllWork = async (req, res) => {
  try {
    const workEntries = await Work.find({});
    res.status(200).json({
      message: "Work entries fetched successfully!",
      data: workEntries,
    });
  } catch (error) {
    console.error("Error fetching work entries:", error);
    res.status(500).json({
      message: "Failed to fetch work entries.",
      error: error.message,
    });
  }
};

export const getAllBillWork = async (req, res) => {
  try {
    const dataId = process.env.WORK_SHEET_ID;

    const workEntries = await sheet.read(dataId, "GramSuvidha");

    const works = workEntries
      .filter((item) => item.length > 0)
      .map((arr) => {
        return {
          id: arr[0],
          password: arr[1],
          gaam: arr[2],
          taluko: arr[3],
          district: arr[4],
        };
      });

    res.status(200).json({
      message: "Work entries fetched successfully!",
      data: works,
    });
  } catch (error) {
    console.error("Error fetching work entries:", error);
    res.status(500).json({
      message: "Failed to fetch work entries.",
      error: error.message,
    });
  }
};

export const getBillWorkDetail = async (req, res) => {
  try {
    const workID = req.params.id;
    const dataId = process.env.WORK_SHEET_ID;

    if (workID) {
      const data = await sheet.read(dataId, "GramSuvidha");
      const details = data
        .filter((item) => item.length > 0)
        .map((arr) => {
          return {
            id: arr[0],
            gaam: arr[2],
            taluko: arr[3],
            district: arr[4],
          };
        });

      const work = details.find((item) => item.id === workID);

      if (work) {
        res.status(200).json({
          message: "Work Spot Fetched Successfully!",
          work,
        });
      } else {
        res.status(404).json({
          message: "Work Spot not Found!",
          work: {},
        });
      }
    }
  } catch (error) {
    console.error("Error fetching work entries:", error);
    res.status(500).json({
      message: "Failed to fetch work entries.",
      error: error.message,
    });
  }
};
// bill-details

// --- Add New Work Entry ---
export const addWork = async (req, res) => {
  try {
    const { sheetId, spot } = req.body;

    // Basic validation
    if (!sheetId || !spot || !spot.gaam || !spot.taluka || !spot.district) {
      return res
        .status(400)
        .json({ message: "Missing required fields for work entry." });
    }

    // Check if a work entry with the given sheetId already exists
    const existingWork = await Work.findOne({ sheetId: sheetId });
    if (existingWork) {
      return res
        .status(409)
        .json({ message: "Work entry with this Sheet ID already exists." });
    }

    const newWork = new Work({ sheetId, spot });
    await newWork.save();

    res.status(201).json({
      message: "Work entry added successfully!",
      data: newWork,
    });
  } catch (error) {
    console.error("Error adding work entry:", error);
    res.status(500).json({
      message: "Failed to add work entry.",
      error: error.message,
    });
  }
};

export const getProjectDetail = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Work.findById(projectId);

    res.status(200).json({
      message: "Work entries fetched successfully!",
      data: project,
    });
  } catch (error) {
    console.error("Error fetching work entries:", error);

    res.status(500).json({
      message: "Failed to fetch work entries.",
      error: error.message,
    });
  }
};

// --- Edit (Update) Work Entry ---
export const editWork = async (req, res) => {
  try {
    const { id } = req.params; // The sheetId from the URL parameter
    const { sheetId: newSheetId, spot: newSpot } = req.body; // Updated data from body

    // Ensure sheetId is not changed if it's the identifier, or handle carefully
    if (newSheetId && newSheetId !== id) {
      return res.status(400).json({
        message:
          "Sheet ID cannot be changed directly via edit. Create a new entry instead.",
      });
    }

    // Basic validation
    if (!newSpot || !newSpot.gaam || !newSpot.taluka || !newSpot.district) {
      return res
        .status(400)
        .json({ message: "Missing required fields for work update." });
    }

    // Find and update the work entry by sheetId
    const updatedWork = await Work.findOneAndUpdate(
      { sheetId: id }, // Find by the sheetId from URL params
      { spot: newSpot }, // Update only the spot object
      { new: true } // Return the updated document
    );

    if (!updatedWork) {
      return res.status(404).json({ message: "Work entry not found." });
    }

    res.status(200).json({
      message: "Work entry updated successfully!",
      data: updatedWork,
    });
  } catch (error) {
    console.error("Error editing work entry:", error);
    res.status(500).json({
      message: "Failed to update work entry.",
      error: error.message,
    });
  }
};

// --- Delete Work Entry ---
export const deleteWork = async (req, res) => {
  try {
    const { id } = req.params; // The sheetId from the URL parameter

    const deletedWork = await Work.findOneAndDelete({ sheetId: id });

    if (!deletedWork) {
      return res.status(404).json({ message: "Work entry not found." });
    }

    res.status(200).json({
      message: "Work entry deleted successfully!",
      data: deletedWork,
    });
  } catch (error) {
    console.error("Error deleting work entry:", error);
    res.status(500).json({
      message: "Failed to delete work entry.",
      error: error.message,
    });
  }
};
