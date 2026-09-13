const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_FOOTBALL_KEY;

if (!API_KEY) {
  console.warn("⚠️ API_FOOTBALL_KEY n'est pas définie.");
}

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/fixtures", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({
        error: "Clé API absente. Configure API_FOOTBALL_KEY sur le serveur."
      });
    }

    const date = req.query.date || new Date().toISOString().slice(0, 10);

    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?date=${encodeURIComponent(date)}`,
      {
        headers: {
          "x-apisports-key": API_KEY
        }
      }
    );

    const data = await response.json();

    if (!response.ok || data.errors && Object.keys(data.errors).length) {
      return res.status(response.status || 502).json({
        error: data.errors || "Erreur API-Football"
      });
    }

    // On ne renvoie que les données utiles à notre V1.
    const matches = (data.response || []).map(item => ({
      id: item.fixture?.id,
      date: item.fixture?.date,
      timestamp: item.fixture?.timestamp,
      status: item.fixture?.status?.short,
      statusLong: item.fixture?.status?.long,
      league: {
        id: item.league?.id,
        name: item.league?.name,
        country: item.league?.country,
        logo: item.league?.logo
      },
      home: {
        id: item.teams?.home?.id,
        name: item.teams?.home?.name,
        logo: item.teams?.home?.logo
      },
      away: {
        id: item.teams?.away?.id,
        name: item.teams?.away?.name,
        logo: item.teams?.away?.logo
      },
      goals: {
        home: item.goals?.home,
        away: item.goals?.away
      }
    }));

    res.json({
      success: true,
      date,
      count: matches.length,
      matches
    });
  } catch (error) {
    res.status(500).json({
      error: "Impossible de contacter API-Football.",
      details: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`GK PRONO V1 lancé sur http://localhost:${PORT}`);
});
