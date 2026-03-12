/**
 * SlotBook OAuth Setup Script
 *
 * Run this script once to get a Google Calendar + Gmail refresh token.
 *
 * Prerequisites:
 *   1. Create a Google Cloud project with Calendar API and Gmail API enabled
 *   2. Create OAuth 2.0 credentials (Web Application type)
 *   3. Add http://localhost:3000/oauth-callback as an authorized redirect URI
 *
 * Usage:
 *   1. Set your Client ID and Client Secret below
 *   2. Run: node oauth-setup.js
 *   3. Open the URL printed in your browser
 *   4. Authorize the app
 *   5. Copy the refresh_token from the output into your .env.local
 */

const http = require("http");
const { google } = require("googleapis");

// ====== FILL THESE IN ======
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "YOUR_CLIENT_ID_HERE";
const CLIENT_SECRET =
  process.env.GOOGLE_CLIENT_SECRET || "YOUR_CLIENT_SECRET_HERE";
// ===========================

const REDIRECT_URI = "http://localhost:3000/oauth-callback";
const SCOPES = [
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/gmail.send",
];

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: SCOPES,
  prompt: "consent",
});

console.log("\n=== SlotBook OAuth Setup ===\n");
console.log("1. Open this URL in your browser:\n");
console.log(authUrl);
console.log("\n2. Authorize with your Google account.");
console.log("3. You will be redirected. The token will appear here.\n");

const server = http.createServer(async (req, res) => {
  if (req.url && req.url.startsWith("/oauth-callback")) {
    const url = new URL(req.url, "http://localhost:3000");
    const code = url.searchParams.get("code");

    if (!code) {
      res.writeHead(400);
      res.end("No authorization code received.");
      return;
    }

    try {
      const { tokens } = await oauth2Client.getToken(code);

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <html>
          <body style="font-family: sans-serif; padding: 40px; text-align: center;">
            <h2>Success!</h2>
            <p>Check your terminal for the refresh token.</p>
            <p>You can close this tab.</p>
          </body>
        </html>
      `);

      console.log("=== SUCCESS ===\n");
      console.log("Add this to your .env.local file:\n");
      console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`);
      console.log("===============\n");

      server.close();
      process.exit(0);
    } catch (err) {
      res.writeHead(500);
      res.end("Failed to exchange code for token.");
      console.error("Error exchanging code:", err.message);
    }
  }
});

server.listen(3000, () => {
  console.log("Waiting for authorization...\n");
});
