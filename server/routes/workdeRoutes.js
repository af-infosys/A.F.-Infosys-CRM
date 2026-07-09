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
  getProjectDetail,
  updateWorkStatus,
  getExtesionWork,
} from "../controllers/workdeController.js";

const workdeRoutes = express.Router();

workdeRoutes.get("/", authenticateToken, authorizeRoles("owner"), getAllWork);

workdeRoutes.get("/extension", getExtesionWork);

workdeRoutes.get("/project/:id", getProjectDetail); // ✅ pehle specific

workdeRoutes.put(
  "/project/status/:id",
  authenticateToken,
  authorizeRoles("owner"),
  updateWorkStatus,
);

workdeRoutes.post("/", authenticateToken, authorizeRoles("owner"), addWork);

workdeRoutes.put("/:id", authenticateToken, authorizeRoles("owner"), editWork);

workdeRoutes.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("owner"),
  deleteWork,
);

export default workdeRoutes;
