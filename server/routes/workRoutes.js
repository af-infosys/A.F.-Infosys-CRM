import express from "express";

import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware.js";
import {
  addWork,
  deleteWork,
  editWork,
  getAllWork,
  getWorkSpot,
  getProjectDetail,
  getBillWork,
  getAllBillWork,
} from "../controllers/workController.js";

const userRoutes = express.Router();

userRoutes.get("/", authenticateToken, authorizeRoles("owner"), getAllWork);

userRoutes.get(
  "/bill",
  authenticateToken,
  authorizeRoles("owner"),
  getAllBillWork
);

// userRoutes.get(
//   "/bill",
//   authenticateToken,
//   authorizeRoles("owner"),
//   getBillWork
// );

userRoutes.get("/project/:id", getProjectDetail); // ✅ pehle specific

userRoutes.get("/:id", authenticateToken, getWorkSpot); // ✅ baad me generic
userRoutes.get("/bill/:id", authenticateToken, getBillWork); // ✅ baad me generic

userRoutes.post("/", authenticateToken, authorizeRoles("owner"), addWork);

userRoutes.put("/:id", authenticateToken, authorizeRoles("owner"), editWork);

userRoutes.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("owner"),
  deleteWork
);

export default userRoutes;
