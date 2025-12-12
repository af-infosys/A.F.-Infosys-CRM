import express from "express";
import {
  getAllProperties,
  getPropertyById,
  updateStatus,
} from "../controllers/billController.js";

const BillRoutes = express.Router();

BillRoutes.get("/:sheetId", getAllProperties);

BillRoutes.get("/:sheetId/:id", getPropertyById);

BillRoutes.put("/:sheetId/:id", updateStatus);
