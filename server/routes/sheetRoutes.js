import express from "express";
import {
  addArea,
  addSheetRecord,
  EditArea,
  getAllAreas,
  getAllRecords,
} from "../controllers/sheetController.js";

const sheetRoutes = express.Router();

sheetRoutes.post("/add", addSheetRecord);
sheetRoutes.get("/", getAllRecords);

sheetRoutes.get("/areas", getAllAreas);
sheetRoutes.post("/areas", addArea);
sheetRoutes.put("/areas/:id", EditArea);

// sheetRoutes.get("/lead/:id", getInquiry);
// sheetRoutes.put("/edit/:id", editInquiry);
// sheetRoutes.delete("/delete/:id", deleteInquiry);

export default sheetRoutes;
