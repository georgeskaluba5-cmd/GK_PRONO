const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

const BSD_BASE = "https://sports.bzzoiro.com/api/v2";

function getHeaders() {
    return {
        "Authorization": `Token ${process.env.BSD_API_KEY}`,
        "Accept": "application/json"
    };
}

function today() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "Africa/Lubumbashi",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(new Date());
}

async function bsdFetch(endpoint) {

    const response = await fetch(
        `${BSD_BASE}${endpoint}`,
        {
            headers: getHeaders()
        }
    );

    const text = await response.text();

    let data;

    try {
        data = JSON.parse(text);
    } catch {
        data = {
            raw: text
        };
    }

    if (!response.ok) {

        const error = new Error(
            data.detail ||
            data.message ||
            data.error ||
            `BSD HTTP ${response.status}`
        );

        error.status = response.status;
        error.data = data;

        throw error;
    }

    return data;
}


/* =========================================
   ACCUEIL
========================================= */

app.get("/", (req, res) => {

    res.sendFile(
        __dirname + "/index.html"
    );

});


/* =========================================
   TEST BSD
========================================= */

app.get("/api/test", async (req, res) => {

    try {

        if (!process.env.BSD_API_KEY) {

            return res.status(500).json({
                success: false,
                message: "BSD_API_KEY manquante"
            });

        }

        const data =
            await bsdFetch(
                "/events/?limit=1"
            );

        res.json({

            success: true,

            message: "BSD connecté ✅",

            count:
                data.count ?? null

        });

    } catch (error) {

        res.status(
            error.status || 500
        ).json({

            success: false,

            message:
                error.message,

            details:
                error.data || null

        });

    }

});


/* =========================================
   MATCHS DU JOUR
========================================= */

app.get("/api/matches", async (req, res) => {

    try {

        const date =
            req.query.date ||
            today();

        const data =
            await bsdFetch(
                `/events/?date_from=${date}&date_to=${date}&limit=200`
            );

        res.json({

            success: true,

            date,

            count:
                data.count || 0,

            matches:
                data.results || []

        });

    } catch (error) {

        res.status(
            error.status || 500
        ).json({

            success: false,

            message:
                error.message,

            details:
                error.data || null

        });

    }

});


/* =========================================
   LIVE
========================================= */

app.get("/api/live", async (req, res) => {

    try {

        const data =
            await bsdFetch(
                "/events/live/"
            );

        res.json({

            success: true,

            matches:
                data.results ||
                data ||
                []

        });

    } catch (error) {

        res.status(
            error.status || 500
        ).json({

            success: false,

            message:
                error.message,

            details:
                error.data || null

        });

    }

});


/* =========================================
   ANALYSE D'UN MATCH
========================================= */

app.get("/api/analyse/:id", async (req, res) => {

    const id =
        req.params.id;

    try {

        /*
         * On récupère séparément les ressources BSD.
         * Une erreur sur une ressource ne bloque pas
         * les autres.
         */

        const results =
            await Promise.allSettled([

                bsdFetch(
                    `/events/${id}/`
                ),

                bsdFetch(
                    `/events/${id}/prediction/`
                ),

                bsdFetch(
                    `/events/${id}/stats/`
                ),

                bsdFetch(
                    `/events/${id}/h2h/`
                ),

                bsdFetch(
                    `/events/${id}/odds/`
                )

            ]);


        const [
            eventResult,
            predictionResult,
            statsResult,
            h2hResult,
            oddsResult
        ] = results;


        const event =
            eventResult.status === "fulfilled"
                ? eventResult.value
                : null;

        const prediction =
            predictionResult.status === "fulfilled"
                ? predictionResult.value
                : null;

        const stats =
            statsResult.status === "fulfilled"
                ? statsResult.value
                : null;

        const h2h =
            h2hResult.status === "fulfilled"
                ? h2hResult.value
                : null;

        const odds =
            oddsResult.status === "fulfilled"
                ? oddsResult.value
                : null;


        /*
         * Si BSD ne renvoie pas le détail,
         * on tente de retrouver le match dans
         * la liste du jour.
         */

        let match = event;

        if (!match) {

            try {

                const date =
                    today();

                const list =
                    await bsdFetch(
                        `/events/?date_from=${date}&date_to=${date}&limit=200`
                    );

                match =
                    (list.results || [])
                    .find(
                        item =>
                            Number(item.id) ===
                            Number(id)
                    ) || null;

            } catch {}

        }


        /*
         * Extraction de la prédiction BSD
         */

        const markets =
            prediction?.markets || {};

        const matchResult =
            markets.match_result || {};

        const overUnder =
            markets.over_under || {};

        const btts =
            markets.btts || {};

        const score =
            markets.score || {};

        const expectedGoals =
            markets.expected_goals || {};

        const recommendations =
            prediction?.recommendations || {};

        const model =
            prediction?.model || {};


        res.json({

            success: true,

            event: match,

            prediction: {

                markets: {

                    match_result: matchResult,

                    expected_goals:
                        expectedGoals,

                    over_under:
                        overUnder,

                    btts,

                    score

                },

                recommendations,

                model

            },

            stats,

            h2h,

            odds,

            availability: {

                event:
                    !!match,

                prediction:
                    !!prediction,

                stats:
                    !!stats,

                h2h:
                    !!h2h,

                odds:
                    !!odds

            }

        });


    } catch (error) {

        res.status(
            error.status || 500
        ).json({

            success: false,

            message:
                error.message,

            details:
                error.data || null

        });

    }

});


/* =========================================
   COUPON DU JOUR
========================================= */

app.get("/api/coupon", async (req, res) => {

    try {

        const date =
            req.query.date ||
            today();

        const data =
            await bsdFetch(
                `/events/?date_from=${date}&date_to=${date}&status=upcoming&limit=200`
            );

        const matches =
            data.results || [];

        const analyses = [];


        /*
         * Maximum 20 matchs analysés
         * pour ne pas gaspiller le quota.
         */

        for (
            const match of matches.slice(0, 20)
        ) {

            try {

                const prediction =
                    await bsdFetch(
                        `/events/${match.id}/prediction/`
                    );

                if (!prediction) {
                    continue;
                }

                const markets =
                    prediction.markets || {};

                const result =
                    markets.match_result || {};

                const over =
                    markets.over_under || {};

                const btts =
                    markets.btts || {};

                const recommendations =
                    prediction.recommendations || {};

                const model =
                    prediction.model || {};


                /*
                 * Meilleur marché
                 */

                const choices = [];


                /* 1 */

                if (
                    typeof result.prob_home ===
                    "number"
                ) {

                    choices.push({

                        market: "1X2",

                        pick: "1",

                        probability:
                            result.prob_home

                    });

                }


                /* X */

                if (
                    typeof result.prob_draw ===
                    "number"
                ) {

                    choices.push({

                        market: "1X2",

                        pick: "X",

                        probability:
                            result.prob_draw

                    });

                }


                /* 2 */

                if (
                    typeof result.prob_away ===
                    "number"
                ) {

                    choices.push({

                        market: "1X2",

                        pick: "2",

                        probability:
                            result.prob_away

                    });

                }


                /* OVER 1.5 */

                if (
                    typeof over.prob_over_15 ===
                    "number"
                ) {

                    choices.push({

                        market: "Over 1.5",

                        pick: "Over 1.5",

                        probability:
                            over.prob_over_15

                    });

                }


                /* OVER 2.5 */

                if (
                    typeof over.prob_over_25 ===
                    "number"
                ) {

                    choices.push({

                        market: "Over 2.5",

                        pick: "Over 2.5",

                        probability:
                            over.prob_over_25

                    });

                }


                /* BTTS */

                if (
                    typeof btts.prob_yes ===
                    "number"
                ) {

                    choices.push({

                        market: "BTTS",

                        pick: "Oui",

                        probability:
                            btts.prob_yes

                    });

                }


                if (!choices.length) {
                    continue;
                }


                choices.sort(
                    (a, b) =>
                        b.probability -
                        a.probability
                );


                const best =
                    choices[0];


                /*
                 * On ne prend pas les probabilités
                 * faibles comme "coupon sûr".
                 */

                if (
                    best.probability < 65
                ) {
                    continue;
                }


                analyses.push({

                    event_id:
                        match.id,

                    home_team:
                        match.home_team,

                    away_team:
                        match.away_team,

                    market:
                        best.market,

                    pick:
                        best.pick,

                    probability:
                        best.probability,

                    predicted_result:
                        result.predicted ||
                        null,

                    exact_score:
                        markets.score?.most_likely ||
                        null,

                    confidence:
                        typeof model.confidence ===
                        "number"
                            ? model.confidence
                            : null,

                    recommendation:
                        recommendations

                });

            } catch {}

        }


        analyses.sort(
            (a, b) =>
                b.probability -
                a.probability
        );


        res.json({

            success: true,

            date,

            matches_available:
                matches.length,

            coupon:
                analyses.slice(0, 5)

        });


    } catch (error) {

        res.status(
            error.status || 500
        ).json({

            success: false,

            message:
                error.message,

            details:
                error.data || null

        });

    }

});


/* =========================================
   SERVEUR
========================================= */

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `🚀 GK PRONO BSD démarré sur le port ${PORT}`
        );

    }
);
