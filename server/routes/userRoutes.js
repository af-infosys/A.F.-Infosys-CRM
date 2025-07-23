import express from "express";
import {
  assignUserWork,
  deleteUserWork,
  editUser,
  editUserWork,
  getAllUsers,
} from "../controllers/userController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const userRoutes = express.Router();

userRoutes.get("/", authenticateToken, authorizeRoles("owner"), getAllUsers);
userRoutes.put("/", authenticateToken, authorizeRoles("owner"), editUser);

userRoutes.post(
  "/work/:id",
  authenticateToken,
  authorizeRoles("owner"),
  assignUserWork
);
userRoutes.put(
  "/work/:id",
  authenticateToken,
  authorizeRoles("owner"),
  editUserWork
);
userRoutes.delete(
  "/work/:id",
  authenticateToken,
  authorizeRoles("owner"),
  deleteUserWork
);

export default userRoutes;
