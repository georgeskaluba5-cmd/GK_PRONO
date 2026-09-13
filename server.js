const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

// ===============================
// PAGE GK PRONO
// ===============================
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// ===============================
// TEST SPORTMONKS
// ===============================
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

// ===============================
// MATCHS DU JOUR
// ===============================
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

    const url =
      `https://api.sportmonks.com/v3/football/fixtures/date/${date}` +
      `?api_token=${encodeURIComponent(token)}` +
      `&per_page=50`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: "Erreur Sportmonks",
        details: data
      });
    }

    const matches = data.data || [];

    res.json({
      success: true,
      date,
      nombre_matchs: matches.length,
      total_disponible:
        data.meta?.pagination?.total || matches.length,
      matches
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: error.message
    });
  }
});

// ===============================
// ANALYSE D'UN MATCH
// ===============================
app.get("/api/analyse/:id", async (req, res) => {

  const token = process.env.SPORTMONKS_API_KEY;
  const id = req.params.id;

  if (!token) {
    return res.status(500).json({
      success: false,
      message: "SPORTMONKS_API_KEY manquante"
    });
  }

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "ID du match manquant"
    });
  }

  try {

    // On demande uniquement le fixture.
    // On ne modifie PAS /api/matches.
    const url =
      `https://api.sportmonks.com/v3/football/fixtures/${id}` +
      `?api_token=${encodeURIComponent(token)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {

      return res.status(response.status).json({
        success: false,
        message: "Impossible de récupérer ce match",
        details: data
      });

    }

    const match = data.data;

    if (!match) {

      return res.status(404).json({
        success: false,
        message: "Match introuvable"
      });

    }

    res.json({
      success: true,
      message: "Match récupéré pour analyse ✅",
      match: match
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Erreur pendant l'analyse",
      error: error.message
    });

  }
});

// ===============================
// DEMARRAGE
// ===============================
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 GK PRONO lancé sur le port ${PORT}`);
});
