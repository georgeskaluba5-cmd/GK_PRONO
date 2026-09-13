const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

const SPORTMONKS_API_KEY = process.env.SPORTMONKS_API_KEY;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Test du serveur
app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        server: "GK PRONO",
        sportmonks_key: SPORTMONKS_API_KEY ? "CONFIGURED" : "MISSING"
    });
});

// Récupérer les matchs du jour
app.get("/api/fixtures", async (req, res) => {
    try {
        if (!SPORTMONKS_API_KEY) {
            return res.status(500).json({
                success: false,
                error: "SPORTMONKS_API_KEY n'est pas configurée sur Render."
            });
        }

        const date = req.query.date || new Date().toISOString().split("T")[0];

        const url =
            `https://api.sportmonks.com/v3/football/fixtures/date/${date}` +
            `?api_token=${encodeURIComponent(SPORTMONKS_API_KEY)}` +
            `&include=participants;league;state;scores`;

        const response = await fetch(url);

        const data = await response.json();

        if (!response.ok) {
            console.error("Erreur Sportmonks :", data);

            return res.status(response.status).json({
                success: false,
                error: "Sportmonks a retourné une erreur.",
                details: data
            });
        }

        const fixtures = (data.data || []).map(match => {
            const participants = match.participants || [];

            const home = participants.find(
                team => team.meta?.location === "home"
            );

            const away = participants.find(
                team => team.meta?.location === "away"
            );

            return {
                id: match.id,
                date: match.starting_at,
                status: match.state?.name || "Scheduled",

                league: match.league?.name || "Compétition",

                home: {
                    id: home?.id || null,
                    name: home?.name || "Équipe domicile",
                    logo: home?.image_path || ""
                },

                away: {
                    id: away?.id || null,
                    name: away?.name || "Équipe extérieure",
                    logo: away?.image_path || ""
                },

                scores: match.scores || []
            };
        });

        res.json({
            success: true,
            date,
            count: fixtures.length,
            fixtures
        });

    } catch (error) {
        console.error("Erreur serveur :", error);

        res.status(500).json({
            success: false,
            error: "Impossible de contacter Sportmonks.",
            details: error.message
        });
    }
});

// Route principale
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 GK PRONO serveur lancé sur le port ${PORT}`);

    if (SPORTMONKS_API_KEY) {
        console.log("✅ SPORTMONKS_API_KEY détectée.");
    } else {
        console.log("❌ SPORTMONKS_API_KEY absente.");
    }
});
