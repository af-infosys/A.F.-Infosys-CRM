import express from "express";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware.js";
import {
  addDetails,
  addTaxes,
  getBillDetails,
  getDetails,
  getImageMode,
  getTaxes,
  updateBillDetails,
} from "../controllers/orderValautionController.js";

const valuationRoutes = express.Router();

valuationRoutes.get(
  "/tax/:id",
  authenticateToken,
  authorizeRoles("owner"),
  getTaxes
);
valuationRoutes.post(
  "/tax/:id",
  authenticateToken,
  authorizeRoles("owner"),
  addTaxes
);
valuationRoutes.get(
  "/getImageMode/:id",
  authenticateToken,
  authorizeRoles("owner", "surveyor"),
  getImageMode
);

// Bill Routes
valuationRoutes.get(
  "/bill/:id",
  authenticateToken,
  authorizeRoles("owner"),
  getBillDetails
);
valuationRoutes.put(
  "/bill/:id",
  authenticateToken,
  authorizeRoles("owner"),
  updateBillDetails
);

valuationRoutes.get(
  "/:id",
  authenticateToken,
  authorizeRoles("owner"),
  getDetails
);

valuationRoutes.post(
  "/:id",
  authenticateToken,
  authorizeRoles("owner"),
  addDetails 
);

export default valuationRoutes;
