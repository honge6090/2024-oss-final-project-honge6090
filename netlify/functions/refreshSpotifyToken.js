// netlify/functions/refreshSpotifyToken.js

require("dotenv").config();
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env");
  process.exit(1);
}

async function getSpotifyToken() {
  const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get token: ${errorText}`);
    }

    const data = await response.json();
    const token = data.access_token;

    console.log("Spotify Access Token:", token);
    console.log("Expires in (seconds):", data.expires_in);

    // Update .env.local or handle token storage
    const envLocalPath = path.resolve(__dirname, "..", ".env.local");
    let envLocalContent = "";

    if (fs.existsSync(envLocalPath)) {
      envLocalContent = fs.readFileSync(envLocalPath, "utf8");
    }

    const newEnvLocalContent = setEnvValue(
      envLocalContent,
      "REACT_APP_SPOTIFY_TOKEN",
      token
    );
    fs.writeFileSync(envLocalPath, newEnvLocalContent, "utf8");

    console.log("Token written to .env.local file");
  } catch (err) {
    console.error("Error obtaining token:", err);
    throw err;
  }
}

// Helper function to update or set environment variables
function setEnvValue(envContent, key, value) {
  const regex = new RegExp(`^${key}=.*$`, "m");
  if (regex.test(envContent)) {
    return envContent.replace(regex, `${key}=${value}`);
  } else {
    return envContent.endsWith("\n")
      ? `${envContent}${key}=${value}\n`
      : `${envContent}\n${key}=${value}\n`;
  }
}

exports.handler = async () => {
  try {
    await getSpotifyToken();
    return {
      statusCode: 200,
      body: "Token refreshed successfully!",
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: "Failed to refresh token",
    };
  }
};
