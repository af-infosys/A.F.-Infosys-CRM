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
} from "../controllers/workController.js";

const userRoutes = express.Router();

userRoutes.get("/", authenticateToken, authorizeRoles("owner"), getAllWork);
userRoutes.get("/:id", authenticateToken, getWorkSpot);
userRoutes.get("/project/:id", getProjectDetail);
userRoutes.post("/", authenticateToken, authorizeRoles("owner"), addWork);
userRoutes.put("/:id", authenticateToken, authorizeRoles("owner"), editWork);
userRoutes.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("owner"),
  deleteWork
);

export default userRoutes;
