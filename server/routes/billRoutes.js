import express from "express";
import {
  getAllProperties,
  getPropertyById,
  getPublicProperty,
  getSocietyList,
  updateLocation,
  updateStatus,
} from "../controllers/billController.js";

const BillRoutes = express.Router();

BillRoutes.post("/public/:sheetId", getPublicProperty);
BillRoutes.get("/society/:sheetId", getSocietyList);

BillRoutes.put("/update/:sheetId", updateLocation);

BillRoutes.get("/:sheetId/:id", getPropertyById);
BillRoutes.put("/:sheetId/:id", updateStatus);
BillRoutes.get("/:sheetId", getAllProperties);

export default BillRoutes;
