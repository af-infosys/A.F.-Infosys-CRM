import express from "express";
import {
  createMeeting,
  getMeetings,
  updateMeetingById,
  deleteMeetingById,
  getMeetingById,
} from "../controllers/meetingController.js";

const router = express.Router();

/**
 * CREATE
 * body: { taluka, district, date, sarpanchEmail, karmchariName, designation, mobileNumber }
 */
router.post("/", createMeeting);

/**
 * READ ALL
 */
router.get("/", getMeetings);

router.get("/:id", getMeetingById);

/**
 * UPDATE (ID in body)
 * body: { id, taluka, district, date, sarpanchEmail, karmchariName, designation, mobileNumber }
 */
router.put("/", updateMeetingById);

/**
 * DELETE (ID in body)
 * body: { id }
 */
router.delete("/", deleteMeetingById);

export default router;
