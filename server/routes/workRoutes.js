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
} from "../controllers/workController.js";

const userRoutes = express.Router();

userRoutes.get("/", authenticateToken, authorizeRoles("owner"), getAllWork);
userRoutes.get("/:id", authenticateToken, getWorkSpot);
userRoutes.post("/", authenticateToken, authorizeRoles("owner"), addWork);
userRoutes.put("/:id", authenticateToken, authorizeRoles("owner"), editWork);
userRoutes.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("owner"),
  deleteWork
);

export default userRoutes;
