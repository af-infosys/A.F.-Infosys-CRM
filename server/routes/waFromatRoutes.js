import express from "express";
import {
  addMessage,
  getAllMessages,
  updateMessage,
  deleteMessage,
} from "../controllers/waFormatController.js";

const MessagesRoutes = express.Router();

// General routes for / (records)
MessagesRoutes.get("/", getAllMessages);
MessagesRoutes.post("/", addMessage);
MessagesRoutes.put("/:uniqueId", updateMessage);
MessagesRoutes.delete("/:uniqueId", deleteMessage);

export default MessagesRoutes;
