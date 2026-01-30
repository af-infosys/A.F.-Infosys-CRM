import { v4 as uuidv4 } from "uuid";
import { GoogleSheetService } from "../config/crud.js";

const sheetService = new GoogleSheetService();
const ENTITY = "Meetings";

/**
 * CREATE Meeting
 */
export const createMeeting = async (req, res) => {
  try {
    const {
      taluka,
      district,
      date,
      sarpanchEmail,
      karmchariName,
      designation,
      mobileNumber,
    } = req.body;

    const id = uuidv4();

    const values = [
      id,
      taluka,
      district,
      date,
      sarpanchEmail,
      karmchariName,
      designation,
      mobileNumber,
    ];

    await sheetService.insert(sheetService.sheetId, ENTITY, values);

    res.status(201).json({
      success: true,
      message: "Meeting created successfully",
      data: { id },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Create failed" });
  }
};

/**
 * READ All Meetings
 */
export const getMeetings = async (req, res) => {
  try {
    const rows = await sheetService.read(sheetService.sheetId, ENTITY);

    if (!rows || rows.length === 0) {
      return res.json({ success: true, data: [] });
    }

    const meetings = rows.map((row) => ({
      id: row[0],
      taluka: row[1],
      district: row[2],
      date: row[3],
      sarpanchEmail: row[4],
      karmchariName: row[5],
      designation: row[6],
      mobileNumber: row[7],
    }));

    res.json({ success: true, data: meetings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Read failed" });
  }
};

/**
 * GET Meeting By ID
 */
export const getMeetingById = async (req, res) => {
  try {
    const { id } = req.params;

    const rows = await sheetService.read(sheetService.sheetId, ENTITY);

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] === id) {
        const meeting = {
          id: rows[i][0],
          taluka: rows[i][1],
          district: rows[i][2],
          date: rows[i][3],
          sarpanchEmail: rows[i][4],
          karmchariName: rows[i][5],
          designation: rows[i][6],
          mobileNumber: rows[i][7],
        };

        return res.json({ success: true, data: meeting });
      }
    }

    return res.status(404).json({
      success: false,
      message: "Meeting not found",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Fetch failed" });
  }
};

/**
 * Find Row Index by ID (NO HEADER)
 */
const findRowIndexById = async (sheetService, entity, sheetId, id) => {
  const rows = await sheetService.read(sheetId, entity);

  if (!rows || rows.length === 0) return null;

  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === id) {
      return i + 1; // Google Sheets is 1-based
    }
  }

  return null;
};

/**
 * UPDATE Meeting (ID from BODY)
 */
export const updateMeetingById = async (req, res) => {
  try {
    const {
      id,
      taluka,
      district,
      date,
      sarpanchEmail,
      karmchariName,
      designation,
      mobileNumber,
    } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required for update",
      });
    }

    const rowIndex = await findRowIndexById(
      sheetService,
      ENTITY,
      sheetService.sheetId,
      id,
    );

    if (!rowIndex) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    const values = [
      id,
      taluka,
      district,
      date,
      sarpanchEmail,
      karmchariName,
      designation,
      mobileNumber,
    ];

    await sheetService.update(sheetService.sheetId, ENTITY, rowIndex, values);

    res.json({
      success: true,
      message: "Meeting updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};

/**
 * DELETE Meeting (ID from BODY)
 */
export const deleteMeetingById = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required for delete",
      });
    }

    const rowIndex = await findRowIndexById(
      sheetService,
      ENTITY,
      sheetService.sheetId,
      id,
    );

    if (!rowIndex) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    await sheetService.deleteRow(ENTITY, rowIndex);

    res.json({
      success: true,
      message: "Meeting deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};
