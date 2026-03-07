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
        // const work = await Work.findById(workID);

        const result = await sheet.findById(
          process.env.GOOGLE_SHEET_ID,
          "Index",
          workID,
        );

        const work = {
          _id: result[0],
          sheetId: result[0],
          spot: JSON.parse(result[1]),
          details: JSON.parse(result[2]),
          other: JSON.parse(result[3]),
        };

        if (work) {
          res.status(200).json({
            message: "Work Spot Fetched Successfully!",
            work,
          });
        } else {
          res.status(404).json({
            message: "Work Spot not Found!",
            nalla: true,
          });
        }
      } else {
        res.status(404).json({
          message: "Work not Assigned!",
          nalla: true,
        });
      }
    } else {
      res.status(404).json({
        message: "User Not Found!",
        nalla: true,
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
    // const workEntries = await Work.find({});
    const result = await sheet.read(process.env.GOOGLE_SHEET_ID, "Index");
    const workEntries = (await result)?.map((item) => {
      return {
        _id: item[0],
        sheetId: item[0],
        spot: JSON.parse(item[1] || {}),
        details: JSON.parse(item[2] || {}),
        other: JSON.parse(item[3] || {}),
        createdAt: item[6],
        updatedAt: item[7],
      };
    });

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
    // const existingWork = await Work.findOne({ sheetId: sheetId });
    // if (existingWork) {
    //   return res
    //     .status(409)
    //     .json({ message: "Work entry with this Sheet ID already exists." });
    // }

    // const newWork = new Work({ sheetId, spot });
    // await newWork.save();

    const newWork = await sheet.insert(process.env.GOOGLE_SHEET_ID, "Index", [
      sheetId,
      JSON.stringify(spot),
      JSON.stringify([]),
      JSON.stringify([]),
      JSON.stringify([]),
      JSON.stringify([]),
      new Date().toISOString(),
      new Date().toISOString(),
    ]);

    await sheet.createNewTab(process.env.GOOGLE_SHEET_ID, `${sheetId}_Main`);
    await sheet.createNewTab(process.env.GOOGLE_SHEET_ID, `${sheetId}_Areas`);

    //     Meghraj Grampanchayat Database
    // 0	1	2	3	4	5	6	7	8	9	10	11	12	13	14	15	16	17	18	19	20	21	22	23	24	25	26	27	28
    // ક્રમાંક	વિસ્તારનું નામ	મિલ્કત ક્રમાંક	માલિકનું નામ	Column 29	જુનો મિલકત નંબર	મોબાઈલ નંબર	મિલ્ક્ત પર લખેલ નામ મકાન/દુકાન/ કારખાના/ કંપનીનું નામ	મકાન category	રસોડું	બાથરૂમ	ફરજો	નળ	શોચાલ્ય	રીમાર્કસ	માળની વિગતો	મિલકતનું વર્ણન	Created At	Updated At	Price	Tax	Other Tax	Special Water Tax	Light Tax	Cleaning Tax	Total Tax	img1	Img2	img3

    res.status(200).json({
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
    // const project = await Work.findById(projectId);

    const result = await sheet.findById(
      process.env.GOOGLE_SHEET_ID,
      "Index",
      projectId,
    );

    const project = {
      _id: result[0],
      sheetId: result[0],
      spot: JSON.parse(result[1]),
      details: JSON.parse(result[2]),
      other: JSON.parse(result[3]),
      createdAt: result[6],
      updatedAt: result[7],
    };

    res.status(200).json({
      message: "Work Details fetched successfully!",
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
    const { spot: newSpot } = req.body; // Updated data from body

    // Basic validation
    if (!newSpot || !newSpot.gaam || !newSpot.taluka || !newSpot.district) {
      return res
        .status(400)
        .json({ message: "Missing required fields for work update." });
    }

    const updatedWork = await sheet.findById(
      process.env.GOOGLE_SHEET_ID,
      "Index",
      id,
    );

    if (!updatedWork) {
      return res.status(404).json({ message: "Work entry not found." });
    }

    updatedWork[1] = JSON.stringify(newSpot || {});

    await sheet.update(process.env.GOOGLE_SHEET_ID, "Index", id, updatedWork);

    // Find and update the work entry by sheetId
    // const updatedWork = await Work.findOneAndUpdate(
    //   { sheetId: id },
    //   { spot: newSpot },
    //   { new: true },
    // );

    // if (!updatedWork) {
    //   return res.status(404).json({ message: "Work entry not found." });
    // }

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

    // const deletedWork = await Work.findOneAndDelete({ sheetId: id });
    const deletedWork = await sheet.deleteRow(
      process.env.GOOGLE_SHEET_ID,
      "Index",
      id,
    );

    if (!deletedWork) {
      return res.status(404).json({ message: "Work entry not found." });
    }

    await sheet.deleteTab(process.env.GOOGLE_SHEET_ID, `${id}_Main`);
    await sheet.deleteTab(process.env.GOOGLE_SHEET_ID, `${id}_Areas`);

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

// --- Edit (Update) Work Entry ---
export const updateWorkStatus = async (req, res) => {
  console.log("Updating Akarni Work Status...", req.body);

  try {
    const { id } = req.params; // The sheetId from the URL parameter
    const newStatus = req.body; // Updated data from body

    // Find and update the work entry by sheetId
    const updatedWork = await Work.findOneAndUpdate(
      { _id: id }, // Find by the sheetId from URL params
      { other: newStatus.other || {} }, // Update only the spot object
      { new: true }, // Return the updated document
    );

    console.log(updatedWork);

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
