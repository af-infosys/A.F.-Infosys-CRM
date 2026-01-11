import express from "express";
import multer from "multer";
import fs from "fs";
import { drive } from "../config/googleDrive.js";

import { google } from "googleapis";

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
  // REFREEEH TOAAAKKKEEN
  // const oauth2Client = new google.auth.OAuth2(
  //   process.env.GOOGLE_CLIENT_ID,
  //   process.env.GOOGLE_CLIENT_SECRET,
  //   process.env.GOOGLE_REDIRECT_URI
  // );

  // 1. Is URL ko browser mein kholein
  // const url = oauth2Client.generateAuthUrl({
  //   access_type: "offline", // Yeh zaroori hai refresh token ke liye
  //   prompt: "consent", // Yeh zaroori hai taaki har baar token mile
  //   scope: ["https://www.googleapis.com/auth/drive"],
  // });

  // console.log("Authorize this app by visiting this url:", url);

  // const { tokens } = await oauth2Client.getToken(
  //   "4/0ASc3gC1PXhq9oIwDkDBe081ZRsQEtVgblB5vkXCCaTZQu29u-4eWswvSsG8H7g0XQGuPUA&scope=https://www.googleapis.com/auth/drive"
  // );

  // console.log("Aapka Real Refresh Token ye hai:");
  // console.log(tokens.refresh_token);

  // REFREEEH TOAAAKKKEEN

  try {
    const fileMetadata = {
      name: req.file.originalname,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // Folder ID where files go
    };

    console.log(fileMetadata);

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
