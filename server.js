const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

const BASE = "https://api.sportmonks.com/v3/football";

function token() {
    return process.env.SPORTMONKS_API_KEY;
}

// ===============================
// PAGE
// ===============================
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// ===============================
// TEST
// ===============================
app.get("/api/test", async (req, res) => {

    const apiToken = token();

    if (!apiToken) {
        return res.status(500).json({
            success: false,
            message: "SPORTMONKS_API_KEY manquante"
        });
    }

    try {

        const response = await fetch(
            `${BASE}/leagues?api_token=${encodeURIComponent(apiToken)}`
        );

        const data = await response.json();

        res.status(response.ok ? 200 : response.status).json({
            success: response.ok,
            message: response.ok
                ? "Sportmonks connecté ✅"
                : "Erreur Sportmonks",
            details: response.ok ? undefined : data
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
});

// ===============================
// MATCHS
// ===============================
app.get("/api/matches", async (req, res) => {

    const apiToken = token();

    if (!apiToken) {
        return res.status(500).json({
            success: false,
            message: "SPORTMONKS_API_KEY manquante"
        });
    }

    try {

        const date =
            req.query.date ||
            new Date().toISOString().slice(0, 10);

        const url =
            `${BASE}/fixtures/date/${date}` +
            `?api_token=${encodeURIComponent(apiToken)}` +
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
// PREDICTIONS D'UN MATCH
// ===============================
app.get("/api/analyse/:id", async (req, res) => {

    const apiToken = token();
    const id = req.params.id;

    if (!apiToken) {
        return res.status(500).json({
            success: false,
            message: "SPORTMONKS_API_KEY manquante"
        });
    }

    try {

        // Fixture + prédictions
        const fixtureUrl =
            `${BASE}/fixtures/${id}` +
            `?api_token=${encodeURIComponent(apiToken)}` +
            `&include=predictions.type`;

        const fixtureResponse =
            await fetch(fixtureUrl);

        const fixtureData =
            await fixtureResponse.json();

        if (!fixtureResponse.ok) {

            return res.status(fixtureResponse.status).json({
                success: false,
                message: "Impossible de récupérer l'analyse",
                details: fixtureData
            });

        }

        const match = fixtureData.data;

        res.json({
            success: true,
            match: match,
            predictions: match?.predictions || []
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
// COUPON DU JOUR
// ===============================
app.get("/api/coupon", async (req, res) => {

    const apiToken = token();

    if (!apiToken) {
        return res.status(500).json({
            success: false,
            message: "SPORTMONKS_API_KEY manquante"
        });
    }

    try {

        const date =
            req.query.date ||
            new Date().toISOString().slice(0, 10);

        // 1. Récupération des matchs
        const matchesUrl =
            `${BASE}/fixtures/date/${date}` +
            `?api_token=${encodeURIComponent(apiToken)}` +
            `&per_page=50`;

        const matchesResponse =
            await fetch(matchesUrl);

        const matchesData =
            await matchesResponse.json();

        if (!matchesResponse.ok) {

            return res.status(matchesResponse.status).json({
                success: false,
                message: "Impossible de récupérer les matchs",
                details: matchesData
            });

        }

        const matches =
            matchesData.data || [];

        // On garde les matchs futurs
        const now = Date.now();

        const upcoming =
            matches.filter(match => {

                if (!match.starting_at) return false;

                return (
                    new Date(
                        match.starting_at.replace(" ", "T")
                    ).getTime() >= now
                );

            });

        // Maximum 12 analyses pour éviter
        // de surcharger l'API.
        const candidates =
            upcoming.slice(0, 12);

        const analysed = [];

        for (const match of candidates) {

            try {

                const predictionUrl =
                    `${BASE}/predictions/probabilities/fixtures/${match.id}` +
                    `?api_token=${encodeURIComponent(apiToken)}` +
                    `&include=type`;

                const predictionResponse =
                    await fetch(predictionUrl);

                if (!predictionResponse.ok) {
                    continue;
                }

                const predictionData =
                    await predictionResponse.json();

                const predictions =
                    predictionData.data || [];

                let fulltime = null;
                let btts = null;
                let over15 = null;
                let over25 = null;
                let doubleChance = null;

                for (const p of predictions) {

                    const name =
                        (
                            p.type?.developer_name ||
                            p.type?.name ||
                            ""
                        ).toUpperCase();

                    const values =
                        p.predictions || {};

                    if (
                        name.includes("FULLTIME_RESULT")
                    ) {
                        fulltime = values;
                    }

                    if (
                        name.includes("BOTH_TEAMS") ||
                        name.includes("BTTS")
                    ) {
                        btts = values;
                    }

                    if (
                        name.includes("OVER_UNDER")
                    ) {

                        const text =
                            JSON.stringify(values)
                                .toLowerCase();

                        if (
                            text.includes("1.5")
                        ) {
                            over15 = values;
                        }

                        if (
                            text.includes("2.5")
                        ) {
                            over25 = values;
                        }
                    }

                    if (
                        name.includes("DOUBLE_CHANCE")
                    ) {
                        doubleChance = values;
                    }
                }

                if (
                    fulltime ||
                    btts ||
                    over15 ||
                    over25 ||
                    doubleChance
                ) {

                    analysed.push({
                        match,
                        fulltime,
                        btts,
                        over15,
                        over25,
                        doubleChance
                    });

                }

            } catch (e) {

                console.log(
                    "Prediction ignorée:",
                    match.id
                );

            }
        }

        // ===============================
        // CREATION DU COUPON
        // ===============================

        const coupon = [];

        for (const item of analysed) {

            const p = item.fulltime;

            if (!p) continue;

            const home =
                Number(p.home || 0);

            const draw =
                Number(p.draw || 0);

            const away =
                Number(p.away || 0);

            let choix = "";
            let probabilite = 0;

            if (home > away && home > draw) {

                choix = "1";
                probabilite = home;

            } else if (
                away > home &&
                away > draw
            ) {

                choix = "2";
                probabilite = away;

            } else {

                choix = "X";
                probabilite = draw;

            }

            if (probabilite >= 55) {

                coupon.push({
                    id: item.match.id,
                    match: item.match.name,
                    choix,
                    probabilite,
                    fulltime: item.fulltime
                });

            }

        }

        coupon.sort(
            (a, b) =>
                b.probabilite -
                a.probabilite
        );

        res.json({

            success: true,

            date,

            matchs_disponibles:
                matches.length,

            matchs_analyses:
                analysed.length,

            coupon:
                coupon.slice(0, 5)

        });

    } catch (error) {

        res.status(500).json({

            success: false,

            message: "Erreur coupon",

            error: error.message

        });

    }
});

// ===============================
// SERVEUR
// ===============================
app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `🚀 GK PRONO lancé sur le port ${PORT}`
    );

});
