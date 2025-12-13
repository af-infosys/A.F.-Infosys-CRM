import express from "express";
import {
  getAllProperties,
  getPropertyById,
  getPublicProperty,
  getSocietyList,
  updateStatus,
} from "../controllers/billController.js";

const BillRoutes = express.Router();

// static first
BillRoutes.post("/public/:sheetId", getPublicProperty);
BillRoutes.get("/society/:sheetId", getSocietyList);

// then dynamic
BillRoutes.get("/:sheetId/:id", getPropertyById);
BillRoutes.put("/:sheetId/:id", updateStatus);
BillRoutes.get("/:sheetId", getAllProperties);

export default BillRoutes;
