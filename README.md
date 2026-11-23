# The Great Genesis Flood of San Francisco

An open, public flood-awareness tool for San Francisco's Marina District. It combines 2023 LiDAR terrain, a datum-correct tide simulation, public flood reports, and a practical garage flood-preparation guide.

## Open the tool

- Shareable route after launch: <https://kevingraehl.com/flood>
- Current preview: <https://genesis-tidal-flood-2026-kevingraehl.kevingraehl.workers.dev/genesis-tidal-flood-2026/>

The map is a terrain screening tool, not a parcel-level forecast. Its blue layer shows low terrain connected to the modeled shoreline. Rain, waves, groundwater, drainage restrictions, sewer backup, barriers, and building openings can change what happens at a specific address.

## What is included

- Animated landing-page water rise and full interactive flood slider
- A clearly labeled 20 ft NAVD88 extreme hypothetical, backed by a freshly encoded 4–20 ft terrain-connectivity surface—not a forecast
- 2023 LiDAR-derived elevation samples and shoreline-connected thresholds
- Plain-language explanation of the coastal flood warning
- No-login community flood-report interface
- Garage pumps, sandbags, tape, battery-backup, and electrical safety guidance
- Reddit-ready square video and a Google Veo prompt in `social/`

The live report API and its D1 database are hosted by the shared `kevingraehl.com` Cloudflare Worker. That shared Worker is intentionally not copied into this public repository because it also owns unrelated site routes.

## Data and official references

- [NOAA Digital Coast Data Access Viewer](https://coast.noaa.gov/dataviewer/)
- [NOAA VDatum](https://vdatum.noaa.gov/)
- [National Weather Service coastal flood warning](https://forecast.weather.gov/product.php?format=CI&glossary=1&issuedby=MTR&product=CFW&site=FGF&version=1)
- [San Francisco 311 flooding and sewer issues](https://www.sf.gov/report-flooding-or-sewer-issue)

## Run locally

Serve this directory with any static HTTP server, then open `index.html`. The hosted community-report feature requires the production Worker API; the terrain simulator and preparation guide are static.

## Project status

Public-interest prototype by Kevin Graehl. Verify official forecasts and emergency instructions before acting.
