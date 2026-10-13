# TESL 1315

Interactive English-language teaching material for Unit 3 (volleyball rally),
Unit 4 (natural radioactivity in food — investigative dossier), and Unit 5
(Mausoleum of Qin Shi Huang — cinematic Earth-to-destination experience).

The whole app is a Vite + React 19 SPA. Each unit is code-split via
`React.lazy` and rendered behind a common access-code gate (see
`src/components/GateScreen.jsx`).

## Local development

```bash
npm install
cp .env.example .env   # then fill in values (see below)
npm run dev            # http://localhost:5173
npm run build          # production build into dist/
npm run lint           # oxlint
```

## Environment variables

| Name | Required? | What it does |
| --- | --- | --- |
| `VITE_APP_KEY` | Yes | Access code shown on the pre-app gate screen. |
| `VITE_CESIUM_ION_TOKEN` | Optional | Cesium Ion token. If provided, the UNIT 5 cinematic intro uses Bing aerial satellite imagery. If left empty, the intro falls back to the open Natural Earth II tiles (no token required). Get a free token at <https://ion.cesium.com>. |

Tokens are exposed to the client (Cesium loads assets from the browser),
so rotate them on the Cesium dashboard if they leak.

## Unit 5 — Cinematic Earth-to-Mausoleum

`src/pages/unit-5/components/EarthZoomIntro.jsx` mounts a CesiumJS globe,
orchestrates a GSAP camera journey from outer space down to the
Mausoleum of the First Qin Emperor (lat 34.3853, lon 109.2655), and
reveals a destination info panel. The intro then fades out and reveals
the existing Three.js UNIT 5 body unchanged.

Interactions: **EXPLORE** (Enter/Space), **SKIP INTRO** (Esc),
**REPLAY JOURNEY** (R), **DISCOVER MORE** to enter the mausoleum.
