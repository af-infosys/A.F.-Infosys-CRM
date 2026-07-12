// modules/income-category/incomeCategory.routes.js
import { Router } from "express";
import {
  getIncomeCategories,
  getIncomeCategoryById,
  createIncomeCategory,
  updateIncomeCategory,
  patchIncomeCategoryStatus,
} from "./incomeCategory.controller.js";

const IncomeCategoryRoutes = Router();

IncomeCategoryRoutes.get("/", getIncomeCategories);
IncomeCategoryRoutes.get("/:id", getIncomeCategoryById);
IncomeCategoryRoutes.post("/", createIncomeCategory);
IncomeCategoryRoutes.put("/:id", updateIncomeCategory);
IncomeCategoryRoutes.patch("/:id/status", patchIncomeCategoryStatus);

export default IncomeCategoryRoutes;
