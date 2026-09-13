const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

// Servir le index.html qui se trouve à la racine du projet
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Test Sportmonks
app.get("/api/test", async (req, res) => {
  const token = process.env.SPORTMONKS_API_KEY;

  if (!token) {
    return res.status(500).json({
      success: false,
      message: "SPORTMONKS_API_KEY manquante"
    });
  }

  try {
    const response = await fetch(
      `https://api.sportmonks.com/v3/football/leagues?api_token=${encodeURIComponent(token)}`
    );

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

// Matchs du jour
app.get("/api/matches", async (req, res) => {
  const token = process.env.SPORTMONKS_API_KEY;

  if (!token) {
    return res.status(500).json({
      success: false,
      message: "SPORTMONKS_API_KEY manquante"
    });
  }

  try {
    const date =
      req.query.date ||
      new Date().toISOString().split("T")[0];

    const response = await fetch(
      `https://api.sportmonks.com/v3/football/fixtures/date/${date}?api_token=${encodeURIComponent(token)}`
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Erreur Sportmonks",
        data
      });
    }

    res.json({
      success: true,
      date,
      nombre_matchs: data.data ? data.data.length : 0,
      matches: data.data || []
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 GK PRONO lancé sur le port ${PORT}`);
});
