const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;

const BSD = "https://sports.bzzoiro.com/api/v2";

function headers() {
  return {
    "Authorization": `Token ${process.env.BSD_API_KEY}`,
    "Accept": "application/json"
  };
}

function dateLocal() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Lubumbashi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date());
}

async function bsd(path) {
  const response = await fetch(BSD + path, {
    headers: headers()
  });

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const error = new Error(
      data.detail ||
      data.error ||
      `BSD HTTP ${response.status}`
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

/* =========================
   ACCUEIL
========================= */

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

/* =========================
   TEST BSD
========================= */

app.get("/api/test", async (req, res) => {

  if (!process.env.BSD_API_KEY) {
    return res.status(500).json({
      success: false,
      message: "BSD_API_KEY manquante dans Render"
    });
  }

  try {

    const data = await bsd(
      "/events/?limit=1"
    );

    res.json({
      success: true,
      message: "BSD connecté ✅",
      count: data.count ?? null
    });

  } catch (error) {

    res.status(error.status || 500).json({
      success: false,
      message: error.message,
      details: error.data || null
    });

  }
});

/* =========================
   MATCHS DU JOUR
========================= */

app.get("/api/matches", async (req, res) => {

  try {

    const date =
      req.query.date ||
      dateLocal();

    const data = await bsd(
      `/events/?date_from=${date}&date_to=${date}&limit=200`
    );

    res.json({
      success: true,
      date,
      count: data.count || 0,
      matches: data.results || []
    });

  } catch (error) {

    res.status(error.status || 500).json({
      success: false,
      message: error.message,
      details: error.data || null
    });

  }
});

/* =========================
   MATCH LIVE
========================= */

app.get("/api/live", async (req, res) => {

  try {

    const data =
      await bsd("/events/live/");

    res.json({
      success: true,
      count: Array.isArray(data)
        ? data.length
        : data.count || 0,
      matches:
        Array.isArray(data)
          ? data
          : data.results || []
    });

  } catch (error) {

    res.status(error.status || 500).json({
      success: false,
      message: error.message,
      details: error.data || null
    });

  }
});

/* =========================
   ANALYSE COMPLETE
========================= */

app.get("/api/analyse/:id", async (req, res) => {

  const id = req.params.id;

  try {

    const [
      event,
      prediction,
      stats,
      h2h,
      odds
    ] = await Promise.allSettled([

      bsd(`/events/${id}/`),

      bsd(`/events/${id}/prediction/`),

      bsd(`/events/${id}/stats/`),

      bsd(`/events/${id}/h2h/`),

      bsd(`/events/${id}/odds/`)

    ]);

    res.json({
      success: true,

      event:
        event.status === "fulfilled"
          ? event.value
          : null,

      prediction:
        prediction.status === "fulfilled"
          ? prediction.value
          : null,

      stats:
        stats.status === "fulfilled"
          ? stats.value
          : null,

      h2h:
        h2h.status === "fulfilled"
          ? h2h.value
          : null,

      odds:
        odds.status === "fulfilled"
          ? odds.value
          : null,

      availability: {
        prediction:
          prediction.status === "fulfilled",

        stats:
          stats.status === "fulfilled",

        h2h:
          h2h.status === "fulfilled",

        odds:
          odds.status === "fulfilled"
      }

    });

  } catch (error) {

    res.status(error.status || 500).json({
      success: false,
      message: error.message,
      details: error.data || null
    });

  }
});

/* =========================
   COUPON DU JOUR
========================= */

app.get("/api/coupon", async (req, res) => {

  try {

    const date =
      req.query.date ||
      dateLocal();

    const matches =
      await bsd(
        `/events/?date_from=${date}&date_to=${date}&status=upcoming&limit=200`
      );

    const list =
      matches.results || [];

    const analyses =
      await Promise.allSettled(

        list.slice(0, 30).map(async match => {

          const prediction =
            await bsd(
              `/events/${match.id}/prediction/`
            );

          return {
            match,
            prediction
          };

        })

      );

    const coupon = [];

    for (const result of analyses) {

      if (result.status !== "fulfilled")
        continue;

      const {
        match,
        prediction
      } = result.value;

      const markets =
        prediction.markets || {};

      const resultMarket =
        markets.match_result || {};

      const over =
        markets.over_under || {};

      const btts =
        markets.btts || {};

      const candidates = [];

      /* 1X2 */

      if (
        Number.isFinite(
          Number(resultMarket.prob_home)
        )
      ) {
        candidates.push({
          market: "1X2",
          pick: "1",
          probability:
            Number(resultMarket.prob_home)
        });
      }

      if (
        Number.isFinite(
          Number(resultMarket.prob_draw)
        )
      ) {
        candidates.push({
          market: "1X2",
          pick: "X",
          probability:
            Number(resultMarket.prob_draw)
        });
      }

      if (
        Number.isFinite(
          Number(resultMarket.prob_away)
        )
      ) {
        candidates.push({
          market: "1X2",
          pick: "2",
          probability:
            Number(resultMarket.prob_away)
        });
      }

      /* OVER 1.5 */

      if (
        Number.isFinite(
          Number(over.prob_over_15)
        )
      ) {
        candidates.push({
          market: "Over 1.5",
          pick: "Over 1.5",
          probability:
            Number(over.prob_over_15)
        });
      }

      /* BTTS */

      if (
        Number.isFinite(
          Number(btts.prob_yes)
        )
      ) {
        candidates.push({
          market: "BTTS",
          pick: "Oui",
          probability:
            Number(btts.prob_yes)
        });
      }

      candidates.sort(
        (a, b) =>
          b.probability -
          a.probability
      );

      const best = candidates[0];

      if (
        best &&
        best.probability >= 70
      ) {

        coupon.push({
          event_id: match.id,

          match:
            match.home_team?.name +
            " - " +
            match.away_team?.name,

          market:
            best.market,

          pick:
            best.pick,

          probability:
            best.probability,

          score:
            markets.score?.most_likely ||
            null,

          confidence:
            prediction.model?.confidence ??
            null

        });

      }

    }

    coupon.sort(
      (a, b) =>
        b.probability -
        a.probability
    );

    res.json({

      success: true,

      date,

      matches:
        list.length,

      coupon:
        coupon.slice(0, 5)

    });

  } catch (error) {

    res.status(error.status || 500).json({
      success: false,
      message: error.message,
      details: error.data || null
    });

  }
});

/* =========================
   SERVEUR
========================= */

app.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `🚀 GK PRONO BSD lancé sur ${PORT}`
    );
  }
);
