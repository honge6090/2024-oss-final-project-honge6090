const fetch = require("node-fetch");

exports.handler = async function () {
  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error(
      "Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in environment"
    );
    return {
      statusCode: 500,
      body: "Environment variables missing",
    };
  }

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

    return {
      statusCode: 200,
      body: JSON.stringify({ token }),
    };
  } catch (err) {
    console.error("Error obtaining token:", err);
    return {
      statusCode: 500,
      body: "Failed to obtain token",
    };
  }
};
