import express from "express";
import {
  addSheetRecord,
  addBulkSheetRecords,
  editSheetRecord,
  deleteSheetRecord,
  getAllRecords,
  getRecord,
} from "../controllers/contactListController.js";

const ContactListRoutes = express.Router();

// General routes for / (records)
ContactListRoutes.get("/", getAllRecords);
ContactListRoutes.get("/:id", getRecord);
ContactListRoutes.post("/bulk", addBulkSheetRecords);
ContactListRoutes.post("/", addSheetRecord);

ContactListRoutes.put("/:id", editSheetRecord);
ContactListRoutes.delete("/:id", deleteSheetRecord);

export default ContactListRoutes;
