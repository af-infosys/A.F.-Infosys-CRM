import express from "express";
import {
  addArea,
  addSheetRecord,
  editSheetRecord,
  deleteSheetRecord,
  EditArea,
  getAllAreas,
  getAllRecords,
  getRecord,
  DeleteArea,
  calculateValuation,
  seperateCommercialProperties,
  syncSheetRecord,
} from "../controllers/survayController.js";

const survayRoutes = express.Router();

// Specific routes for /areas should come BEFORE parameterized routes for the root path
survayRoutes.get("/areas", getAllAreas); // <-- Move this up!
survayRoutes.post("/areas", addArea);
survayRoutes.post("/sync", syncSheetRecord);

survayRoutes.put("/areas/:id", EditArea);
survayRoutes.delete("/areas/:id", DeleteArea);

// General routes for / (records)
survayRoutes.post("/add", addSheetRecord);
survayRoutes.get("/", getAllRecords);
survayRoutes.put("/ordervaluation/:id", calculateValuation);
survayRoutes.post("/seperatecommercial/:id", seperateCommercialProperties);
survayRoutes.get("/:id", getRecord);
survayRoutes.put("/:id", editSheetRecord);
survayRoutes.delete("/:id", deleteSheetRecord);

export default survayRoutes;
