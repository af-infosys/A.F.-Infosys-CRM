import express from "express";
import {
  assignUserWork,
  deleteUserWork,
  editUser,
  editUserWork,
  getAllUsers,
  getUserInfo,
  getUserName,
} from "../controllers/userController.js";
import {
  authenticateToken,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

const userRoutes = express.Router();

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

userRoutes.get("/:id", getUserName);
userRoutes.get("/user/:id", authenticateToken, getUserInfo);
userRoutes.get(
  "/",
  authenticateToken,
  authorizeRoles("owner", "monitor"),
  getAllUsers
);
userRoutes.put("/:id", authenticateToken, authorizeRoles("owner"), editUser);

export default userRoutes;
