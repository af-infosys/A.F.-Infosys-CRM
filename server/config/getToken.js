import { google } from "googleapis";
import dotenv from "dotenv";
import readline from "readline";

dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Define scopes – in your case for Google Drive
const SCOPES = ["https://www.googleapis.com/auth/drive"];

// Generate the consent URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline", // required to get refresh_token
  prompt: "consent", // ensures Google always returns it
  scope: SCOPES,
});

console.log("Authorize this app by visiting this URL:\n", authUrl);

// CLI input for the code after visiting the URL
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("\nEnter the code from that page here: ", async (code) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("\n✅ Tokens received:\n", tokens);
    console.log("\nCopy your refresh_token into .env as GOOGLE_REFRESH_TOKEN");
  } catch (err) {
    console.error("❌ Error retrieving tokens:", err);
  } finally {
    rl.close();
  }
});
