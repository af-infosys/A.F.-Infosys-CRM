import express from "express";
import {
  addSheetRecord,
  getAllAreas,
  getAllRecords,
} from "../controllers/sheetController.js";

const sheetRoutes = express.Router();

sheetRoutes.post("/add", addSheetRecord);
sheetRoutes.get("/", getAllRecords);

sheetRoutes.get("/areas", getAllAreas);

// sheetRoutes.get("/lead/:id", getInquiry);
// sheetRoutes.put("/edit/:id", editInquiry);
// sheetRoutes.delete("/delete/:id", deleteInquiry);

export default sheetRoutes;
