const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/", (req, res) => {
  res.send("GK PRONO SPORTMONKS V2 ✅");
});

app.get("/api/test", async (req, res) => {
  const token = process.env.SPORTMONKS_API_KEY;

  if (!token) {
    return res.json({
      success: false,
      message: "SPORTMONKS_API_KEY manquante"
    });
  }

  try {
    const response = await fetch(
      `https://api.sportmonks.com/v3/football/leagues?api_token=${encodeURIComponent(token)}`
    );

    const data = await response.json();

    res.status(response.ok ? 200 : response.status).json({
      success: response.ok,
      message: response.ok
        ? "Sportmonks connecté ✅"
        : "Erreur Sportmonks ❌"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("GK PRONO V2 lancé");
});
