<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>GK PRONO — Intelligence Football</title>

<style>
*{
    box-sizing:border-box;
    margin:0;
    padding:0
}

body{
    font-family:Arial,Helvetica,sans-serif;
    background:#050b14;
    color:#fff;
}

header{
    padding:20px 15px;
    text-align:center;
    background:linear-gradient(135deg,#061a30,#0b3458);
    border-bottom:1px solid #1d527b;
}

.logo{
    font-size:32px;
    font-weight:900;
    letter-spacing:2px;
    color:#38bdf8;
}

.subtitle{
    margin-top:6px;
    color:#9eb5c9;
    font-size:13px;
}

.container{
    max-width:1100px;
    margin:auto;
    padding:18px;
}

.topbar{
    display:flex;
    justify-content:space-between;
    align-items:center;
    gap:10px;
    background:#0b1726;
    border:1px solid #193953;
    padding:12px;
    border-radius:12px;
    margin-bottom:20px;
}

.status{
    color:#22c55e;
    font-size:13px;
    font-weight:bold;
}

button{
    border:0;
    cursor:pointer;
    font-weight:bold;
}

.refresh{
    background:#1683c5;
    color:white;
    padding:10px 14px;
    border-radius:8px;
}

.title{
    font-size:22px;
    margin:22px 0 12px;
}

.matches{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
    gap:15px;
}

.match-card{
    background:#0b1726;
    border:1px solid #193953;
    border-radius:15px;
    padding:16px;
}

.league{
    color:#7da1bb;
    font-size:12px;
    margin-bottom:10px;
}

.teams{
    text-align:center;
    font-size:17px;
    font-weight:800;
    line-height:1.5;
}

.vs{
    color:#55738b;
    font-size:12px;
}

.match-date{
    text-align:center;
    color:#718ca2;
    font-size:12px;
    margin:12px 0;
}

.analyse-btn{
    width:100%;
    padding:12px;
    background:#1683c5;
    color:white;
    border-radius:8px;
}

.analysis{
    display:none;
    margin-top:20px;
}

.hero{
    background:linear-gradient(145deg,#0b233b,#071522);
    border:1px solid #24577d;
    border-radius:18px;
    padding:20px;
    text-align:center;
}

.hero-teams{
    font-size:23px;
    font-weight:900;
    line-height:1.6;
}

.hero-vs{
    color:#38bdf8;
    font-size:13px;
}

.grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
    gap:14px;
    margin-top:15px;
}

.box{
    background:#0b1726;
    border:1px solid #193953;
    border-radius:14px;
    padding:16px;
}

.box h3{
    color:#38bdf8;
    font-size:15px;
    margin-bottom:14px;
}

.prob{
    margin-bottom:13px;
}

.prob-top{
    display:flex;
    justify-content:space-between;
    font-size:13px;
    margin-bottom:6px;
}

.bar{
    height:8px;
    background:#172b3d;
    border-radius:20px;
    overflow:hidden;
}

.fill{
    height:100%;
    background:#1683c5;
    border-radius:20px;
}

.metric{
    display:flex;
    justify-content:space-between;
    padding:9px 0;
    border-bottom:1px solid #142d42;
    font-size:13px;
}

.metric:last-child{
    border-bottom:0;
}

.metric span:first-child{
    color:#8fa8ba;
}

.metric strong{
    color:#fff;
}

.big-score{
    font-size:38px;
    font-weight:900;
    color:#facc15;
    text-align:center;
    padding:12px 0;
}

.odds{
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:8px;
}

.odd{
    background:#101f30;
    padding:10px;
    border-radius:8px;
    text-align:center;
}

.odd small{
    display:block;
    color:#7892a6;
    margin-bottom:5px;
}

.odd strong{
    color:#38bdf8;
}

.h2h-match{
    padding:8px 0;
    border-bottom:1px solid #142d42;
    font-size:12px;
    color:#a9bac8;
}

.engine{
    margin-top:15px;
    background:linear-gradient(145deg,#101f32,#091522);
    border:1px solid #286287;
    border-radius:16px;
    padding:18px;
}

.engine-title{
    color:#38bdf8;
    font-size:18px;
    font-weight:900;
    margin-bottom:12px;
}

.signal{
    display:flex;
    justify-content:space-between;
    padding:9px 0;
    border-bottom:1px solid #193349;
    font-size:13px;
}

.signal span:first-child{
    color:#91a9bc;
}

.good{
    color:#22c55e !important;
}

.warning{
    color:#f59e0b !important;
}

.bad{
    color:#ef4444 !important;
}

.recommendation{
    margin-top:15px;
    padding:16px;
    border-radius:13px;
    border:1px solid #236c50;
    background:#0b241c;
}

.recommendation h3{
    color:#22c55e;
    margin-bottom:8px;
}

.recommendation .pick{
    font-size:22px;
    font-weight:900;
    margin:8px 0;
    color:#fff;
}

.recommendation p{
    color:#b7cbc4;
    font-size:13px;
    line-height:1.6;
}

.no-bet{
    border-color:#6a4a20;
    background:#261b0d;
}

.no-bet h3{
    color:#f59e0b;
}

.loading{
    padding:25px;
    text-align:center;
    color:#8199ad;
}

.error{
    padding:15px;
    background:#32151a;
    border:1px solid #752936;
    color:#ff9ca8;
    border-radius:10px;
}

footer{
    text-align:center;
    color:#627b90;
    font-size:12px;
    padding:30px 15px;
}
</style>
</head>

<body>

<header>
    <div class="logo">GK PRONO</div>
    <div class="subtitle">
        Intelligence football • Analyse avancée
    </div>
</header>

<div class="container">

    <div class="topbar">
        <span class="status">● BSD CONNECTÉ</span>
        <button class="refresh" onclick="loadMatches()">
            Actualiser
        </button>
    </div>

    <h2 class="title">⚽ Matchs disponibles</h2>

    <div id="matches" class="matches">
        <div class="loading">
            Chargement...
        </div>
    </div>

</div>

<footer>
    GK PRONO © 2026
</footer>

<script>

/* =====================================
   OUTILS
===================================== */

async function api(url){

    const r=await fetch(url);
    const text=await r.text();

    let data;

    try{
        data=JSON.parse(text);
    }catch{
        throw new Error("Réponse serveur invalide");
    }

    if(!r.ok){
        throw new Error(
            data.message || "Erreur serveur"
        );
    }

    return data;
}

function esc(v){

    return String(v ?? "")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");

}

function pct(v){

    const n=Number(v);

    return Number.isFinite(n)
        ? n.toFixed(1)+"%"
        : "—";

}

function num(v){

    const n=Number(v);

    return Number.isFinite(n)
        ? n
        : null;

}

function dateFormat(v){

    if(!v)return "Date inconnue";

    try{

        return new Intl.DateTimeFormat(
            "fr-FR",
            {
                dateStyle:"medium",
                timeStyle:"short"
            }
        ).format(new Date(v));

    }catch{

        return v;

    }

}


/* =====================================
   MATCHS
===================================== */

async function loadMatches(){

    const box=
        document.getElementById("matches");

    box.innerHTML=
        `<div class="loading">
            Chargement des matchs...
        </div>`;

    try{

        const data=
            await api("/api/matches");

        const matches=
            data.matches || [];

        if(!matches.length){

            box.innerHTML=
                `<div class="loading">
                    Aucun match disponible.
                </div>`;

            return;
        }

        box.innerHTML=
            matches.map(m=>`

                <div class="match-card">

                    <div class="league">
                        ⚽ ${esc(
                            m.league_name ||
                            "Football"
                        )}
                    </div>

                    <div class="teams">
                        ${esc(m.home_team)}
                        <div class="vs">VS</div>
                        ${esc(m.away_team)}
                    </div>

                    <div class="match-date">
                        ${esc(
                            dateFormat(
                                m.event_date
                            )
                        )}
                    </div>

                    <button
                        class="analyse-btn"
                        onclick="analyse(
                            ${Number(m.id)},
                            this
                        )"
                    >
                        🧠 ANALYSE GK PRONO
                    </button>

                    <div
                        class="analysis"
                        id="a-${Number(m.id)}"
                    ></div>

                </div>

            `).join("");

    }catch(e){

        box.innerHTML=
            `<div class="error">
                ❌ ${esc(e.message)}
            </div>`;

    }

}


/* =====================================
   MOTEUR GK PRONO
===================================== */

function moteurGK(data){

    const p=
        data.prediction || {};

    const m=
        p.markets || {};

    const r=
        m.match_result || {};

    const g=
        m.expected_goals || {};

    const o=
        m.over_under || {};

    const b=
        m.btts || {};

    const rec=
        p.recommendations || {};

    const model=
        p.model || {};

    const odds=
        data.odds?.odds || {};

    const h2h=
        data.h2h || {};

    let candidates=[];

    /* -------------------------------
       1X2
    -------------------------------- */

    const ph=num(r.prob_home);
    const pd=num(r.prob_draw);
    const pa=num(r.prob_away);

    if(ph!==null){

        candidates.push({
            market:"1X2",
            pick:"1",
            probability:ph,
            odd:num(odds.home_win)
        });

    }

    if(pd!==null){

        candidates.push({
            market:"1X2",
            pick:"X",
            probability:pd,
            odd:num(odds.draw)
        });

    }

    if(pa!==null){

        candidates.push({
            market:"1X2",
            pick:"2",
            probability:pa,
            odd:num(odds.away_win)
        });

    }

    /* -------------------------------
       OVER 1.5
    -------------------------------- */

    const o15=
        num(o.prob_over_15);

    if(o15!==null){

        candidates.push({
            market:"Buts",
            pick:"Plus de 1.5",
            probability:o15,
            odd:num(odds.over_15_goals)
        });

    }

    /* -------------------------------
       OVER 2.5
    -------------------------------- */

    const o25=
        num(o.prob_over_25);

    if(o25!==null){

        candidates.push({
            market:"Buts",
            pick:"Plus de 2.5",
            probability:o25,
            odd:num(odds.over_25_goals)
        });

    }

    /* -------------------------------
       BTTS
    -------------------------------- */

    const btts=
        num(b.prob_yes);

    if(btts!==null){

        candidates.push({
            market:"BTTS",
            pick:"Les deux équipes marquent",
            probability:btts,
            odd:num(odds.btts_yes)
        });

    }

    /* -------------------------------
       CALCUL VALUE
    -------------------------------- */

    candidates.forEach(c=>{

        c.implied=
            c.odd && c.odd>1
            ? 100/c.odd
            : null;

        c.value=
            c.implied!==null
            ? c.probability-c.implied
            : null;

    });

    /*
       On cherche une probabilité forte
       + éventuellement une value positive.
    */

    candidates.sort(
        (a,b)=>
            (b.probability + (b.value||0)*0.35)
            -
            (a.probability + (a.value||0)*0.35)
    );

    const best=
        candidates[0] || null;

    /* -------------------------------
       CONTRADICTIONS
    -------------------------------- */

    const warnings=[];

    if(ph!==null && pa!==null){

        if(Math.abs(ph-pa)<8){

            warnings.push(
                "Les probabilités 1 et 2 sont proches."
            );

        }

    }

    if(ph!==null && ph>=60 && h2h.away_win_rate>=0.6){

        warnings.push(
            "Le modèle favorise le domicile, mais le H2H récent favorise l'extérieur."
        );

    }

    if(o15!==null && o15>=70 &&
       o25!==null && o25<50){

        warnings.push(
            "Les données favorisent les petits scores plutôt qu'un match très ouvert."
        );

    }

    if(btts!==null && btts<45){

        warnings.push(
            "Le BTTS n'est pas suffisamment fort."
        );

    }

    /* -------------------------------
       SCORE DE CONFIANCE
    -------------------------------- */

    let confidence=
        num(model.confidence);

    confidence=
        confidence!==null
        ? confidence*100
        : 0;

    if(best){

        confidence=
            (
                confidence*0.45 +
                best.probability*0.55
            );

    }

    confidence=
        Math.max(
            0,
            Math.min(
                100,
                confidence
            )
        );

    /* -------------------------------
       DECISION
    -------------------------------- */

    let recommended=false;
    let reason="";

    if(best){

        if(best.probability>=72){

            recommended=true;

            reason=
                "La probabilité du marché est élevée et les données disponibles permettent une sélection relativement solide.";

        }else if(
            best.probability>=65 &&
            (best.value===null || best.value>=3)
        ){

            recommended=true;

            reason=
                "La probabilité est suffisamment élevée et la comparaison avec la cote présente un signal intéressant.";

        }else{

            reason=
                "Aucun marché ne présente actuellement un niveau suffisamment fort pour une recommandation principale.";

        }

    }

    /*
       On annule si trop de contradictions.
    */

    if(warnings.length>=3){

        recommended=false;

        reason=
            "Plusieurs signaux se contredisent. GK PRONO préfère éviter de forcer une sélection.";

    }

    return{
        best,
        candidates,
        warnings,
        confidence,
        recommended,
        reason
    };

}


/* =====================================
   AFFICHAGE ANALYSE
===================================== */

function probability(label,value){

    const n=num(value);

    if(n===null)return "";

    return `
        <div class="prob">

            <div class="prob-top">
                <span>${esc(label)}</span>
                <strong>${n.toFixed(1)}%</strong>
            </div>

            <div class="bar">
                <div
                    class="fill"
                    style="width:${Math.min(
                        100,
                        Math.max(0,n)
                    )}%"
                ></div>
            </div>

        </div>
    `;

}

function metric(label,value){

    return `
        <div class="metric">
            <span>${esc(label)}</span>
            <strong>${esc(value)}</strong>
        </div>
    `;

}

async function analyse(id,button){

    const box=
        document.getElementById("a-"+id);

    if(box.style.display==="block"){

        box.style.display="none";
        return;

    }

    box.style.display="block";

    box.innerHTML=
        `<div class="loading">
            🧠 Calcul du moteur GK PRONO...
        </div>`;

    button.disabled=true;

    try{

        const data=
            await api("/api/analyse/"+id);

        const event=
            data.event || {};

        const p=
            data.prediction || {};

        const m=
            p.markets || {};

        const r=
            m.match_result || {};

        const g=
            m.expected_goals || {};

        const o=
            m.over_under || {};

        const b=
            m.btts || {};

        const model=
            p.model || {};

        const rec=
            p.recommendations || {};

        const h2h=
            data.h2h || {};

        const odds=
            data.odds?.odds || {};

        const engine=
            moteurGK(data);

        let h2hHtml="";

        if(
            h2h.recent_matches &&
            h2h.recent_matches.length
        ){

            h2hHtml=
                h2h.recent_matches
                .map(x=>`

                    <div class="h2h-match">
                        ${esc(x.home)}
                        ${esc(x.score)}
                        ${esc(x.away)}
                    </div>

                `)
                .join("");

        }

        let warningsHtml=
            engine.warnings.length
            ?
            engine.warnings.map(x=>`

                <div class="signal">
                    <span>⚠️ ${esc(x)}</span>
                    <strong class="warning">
                        Attention
                    </strong>
                </div>

            `).join("")
            :
            `
                <div class="signal">
                    <span>Aucune contradiction majeure</span>
                    <strong class="good">
                        ✓
                    </strong>
                </div>
            `;

        let recommendationHtml="";

        if(engine.recommended && engine.best){

            recommendationHtml=`

                <div class="recommendation">

                    <h3>
                        ⭐ SÉLECTION GK PRONO
                    </h3>

                    <div class="pick">
                        ${esc(
                            engine.best.market
                        )}
                        :
                        ${esc(
                            engine.best.pick
                        )}
                    </div>

                    <p>
                        Probabilité estimée :
                        <strong>
                            ${pct(
                                engine.best.probability
                            )}
                        </strong>
                    </p>

                    <p>
                        ${esc(engine.reason)}
                    </p>

                </div>

            `;

        }else{

            recommendationHtml=`

                <div class="recommendation no-bet">

                    <h3>
                        ⚠️ PAS DE PARI RECOMMANDÉ
                    </h3>

                    <div class="pick">
                        Aucun choix suffisamment solide
                    </div>

                    <p>
                        ${esc(engine.reason)}
                    </p>

                </div>

            `;

        }

        box.innerHTML=`

            <div class="hero">

                <div class="hero-teams">
                    ${esc(event.home_team)}
                    <div class="hero-vs">
                        VS
                    </div>
                    ${esc(event.away_team)}
                </div>

                <div style="
                    margin-top:10px;
                    color:#7894aa;
                    font-size:12px
                ">
                    ${esc(
                        dateFormat(
                            event.event_date
                        )
                    )}
                </div>

            </div>


            <div class="grid">

                <div class="box">

                    <h3>📊 Probabilités 1X2</h3>

                    ${probability(
                        "Domicile",
                        r.prob_home
                    )}

                    ${probability(
                        "Nul",
                        r.prob_draw
                    )}

                    ${probability(
                        "Extérieur",
                        r.prob_away
                    )}

                    ${metric(
                        "Prévision BSD",
                        r.predicted || "—"
