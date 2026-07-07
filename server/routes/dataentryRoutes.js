import express from "express";
import {
  addArea,
  addSheetRecord,
  editSheetRecord,
  editTaxRecord,
  deleteSheetRecord,
  EditArea,
  getAllAreas,
  getAllRecords,
  getRecord,
  DeleteArea,
  calculateValuation,
  seperateCommercialProperties,
  excelEdit,
  insertRecord,
} from "../controllers/dataentryController.js";

const dataentryRoutes = express.Router();

// Specific routes for /areas should come BEFORE parameterized routes for the root path
dataentryRoutes.get("/areas", getAllAreas); // <-- Move this up!
dataentryRoutes.post("/areas", addArea);
dataentryRoutes.post("/insert", insertRecord);

dataentryRoutes.put("/excel", excelEdit);

dataentryRoutes.put("/areas/:id", EditArea);
dataentryRoutes.delete("/areas/:id", DeleteArea);

dataentryRoutes.put("/tax/:id", editTaxRecord);

// General routes for / (records)
dataentryRoutes.post("/add", addSheetRecord);
dataentryRoutes.get("/", getAllRecords);
dataentryRoutes.put("/ordervaluation/:id", calculateValuation);
dataentryRoutes.post("/seperatecommercial/:id", seperateCommercialProperties);
dataentryRoutes.get("/:id", getRecord);
dataentryRoutes.put("/:id", editSheetRecord);
dataentryRoutes.delete("/:id", deleteSheetRecord);

export default dataentryRoutes;
