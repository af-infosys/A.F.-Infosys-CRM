import express from "express";
import multer from "multer";
import fs from "fs";
import { drive } from "../config/googleDrive.js";

const driveRoutes = express.Router();
const upload = multer({ dest: "uploads/" });

driveRoutes.get("/", async (req, res) => {
  try {
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
    const folder = await drive.files.get({
      fileId: folderId,
      fields: "id, name",
    });
    res.json({ success: true, folder });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Upload image to Google Drive
driveRoutes.post("/", upload.single("image"), async (req, res) => {
  try {
    const fileMetadata = {
      name: req.file.originalname,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Folder ID where files go
    };

    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(req.file.path),
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id, webViewLink, webContentLink",
    });

    // Make file public (optional)
    await drive.permissions.create({
      fileId: file.data.id,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    fs.unlinkSync(req.file.path);

    res.json({
      id: file.data.id,
      viewLink: file.data.webViewLink,
      downloadLink: file.data.webContentLink,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

// Delete image by ID
driveRoutes.delete("/:id", async (req, res) => {
  try {
    await drive.files.delete({ fileId: req.params.id });
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Deletion failed" });
  }
});

export default driveRoutes;
