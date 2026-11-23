const DATA_URL = "analysis.json";
const API = "/api/genesis-flood/reports";
const FORECAST_NAVD88 = 8.66;
const MIN_WATER = 4;
const MAX_WATER = 20;

const map = L.map("map", {
  zoomControl: true,
  preferCanvas: true,
  scrollWheelZoom: false,
}).setView([37.8048, -122.443], 15);
map.attributionControl.addAttribution('Basemap &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');

let analysis;
let imageBounds;
let terrainLayer;
let floodLayer;
let thresholdPixels;
let thresholdWidth;
let thresholdHeight;
let animationFrame;
let animationStarted;
let heroPreviewFrame;
let reportMode = false;
const reportMarkers = L.layerGroup().addTo(map);
const elevationMarkers = L.layerGroup().addTo(map);
const slider = document.querySelector("#water-slider");
const waterOutput = document.querySelector("#water-output");
const waterLabel = document.querySelector("#water-label");
const note = document.querySelector("#scenario-note");
const heroCanvas = document.querySelector("#hero-water-canvas");
const heroOutput = document.querySelector("#hero-water-output");
const dialog = document.querySelector("#report-dialog");
const form = document.querySelector("#report-form");

function esc(value) {
  const span = document.createElement("span");
  span.textContent = String(value ?? "");
  return span.innerHTML;
}

function markerIcon(color = "#fff") {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:16px;height:16px;border:3px solid #102431;border-radius:50%;background:${color};box-shadow:0 2px 8px #0006"></span>`,
    iconSize: [16, 16], iconAnchor: [8, 8], popupAnchor: [0, -8],
  });
}

function waterDescription(level) {
  if (Math.abs(level - 8.66) < 0.04) return "Wednesday forecast";
  if (Math.abs(level - 8.72) < 0.04) return "1983 observed record";
  if (Math.abs(level - 7.29) < 0.04) return "highest astronomical tide";
  if (Math.abs(level - 5.90) < 0.04) return "typical higher-high water";
  if (Math.abs(level - 11) < 0.04) return "11 ft stress test";
  if (Math.abs(level - 20) < 0.04) return "extreme hypothetical — not a forecast";
  return level < FORECAST_NAVD88 ? "below Wednesday forecast" : "stress-test level";
}

function connectionSummary(level) {
  if (level < 8.66) return "Blue is shoreline-connected low ground. This level is below Wednesday’s forecast.";
  if (level < 10.97) return "Wednesday range: shoreline, marsh and harbor lows turn blue; no DEM route reaches Beach & Pierce.";
  if (level < 11.06) return "Palace of Fine Arts west-side lows begin to connect; Beach & Pierce remains disconnected.";
  if (level < 12.82) return "Marina & Scott-area lows begin to connect; Beach & Pierce remains disconnected.";
  if (level < 14.01) return "Beach & Scott-area lows begin to connect; Beach & Pierce remains disconnected.";
  if (level < 16) return "Near 14.01 ft, the terrain-only model first connects shoreline water to the Beach & Pierce reference.";
  if (level < 19.95) return "Extreme scenario: broad low terrain is connected. This is a visualization, not a tide prediction.";
  return "20 ft extreme hypothetical: dramatic terrain stress test only — not forecast, surge or sea-level-rise guidance.";
}

function drawWater(level) {
  waterOutput.textContent = `${level.toFixed(2)} ft NAVD88`;
  waterLabel.textContent = waterDescription(level);
  note.textContent = connectionSummary(level);
  if (!thresholdPixels || !imageBounds) return;

  const canvas = document.createElement("canvas");
  canvas.width = thresholdWidth;
  canvas.height = thresholdHeight;
  const context = canvas.getContext("2d");
  const water = context.createImageData(thresholdWidth, thresholdHeight);
  for (let i = 0; i < thresholdPixels.length; i += 4) {
    if (thresholdPixels[i + 3] === 0) continue;
    const threshold = MIN_WATER + (thresholdPixels[i] / 255) * (MAX_WATER - MIN_WATER);
    if (threshold <= level) {
      const rim = level - threshold < 0.10;
      water.data[i] = 24;
      water.data[i + 1] = 142;
      water.data[i + 2] = 242;
      water.data[i + 3] = rim ? 225 : 156;
    }
  }
  context.putImageData(water, 0, 0);
  const url = canvas.toDataURL("image/png");
  if (!floodLayer) floodLayer = L.imageOverlay(url, imageBounds, { opacity: 1, interactive: false }).addTo(map);
  else floodLayer.setUrl(url);
}

function setWater(level) {
  const bounded = Math.max(MIN_WATER, Math.min(MAX_WATER, Number(level)));
  slider.value = bounded.toFixed(2);
  drawWater(bounded);
}

function drawHeroWater(level) {
  if (!heroCanvas || !heroOutput || !thresholdPixels) return;
  heroOutput.textContent = `${level.toFixed(2)} ft NAVD88`;
  const context = heroCanvas.getContext("2d");
  const frame = context.createImageData(heroCanvas.width, heroCanvas.height);
  for (let y = 0; y < heroCanvas.height; y += 1) {
    const sourceY = Math.min(thresholdHeight - 1, Math.floor((y / heroCanvas.height) * thresholdHeight));
    for (let x = 0; x < heroCanvas.width; x += 1) {
      const sourceX = Math.min(thresholdWidth - 1, Math.floor((x / heroCanvas.width) * thresholdWidth));
      const source = (sourceY * thresholdWidth + sourceX) * 4;
      if (thresholdPixels[source + 3] === 0) continue;
      const threshold = MIN_WATER + (thresholdPixels[source] / 255) * (MAX_WATER - MIN_WATER);
      if (threshold > level) continue;
      const target = (y * heroCanvas.width + x) * 4;
      const rim = level - threshold < 0.11;
      frame.data[target] = 24;
      frame.data[target + 1] = 142;
      frame.data[target + 2] = 242;
      frame.data[target + 3] = rim ? 235 : 164;
    }
  }
  context.putImageData(frame, 0, 0);
}

function startHeroWaterPreview() {
  if (!heroCanvas || !thresholdPixels) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    drawHeroWater(FORECAST_NAVD88);
    return;
  }
  cancelAnimationFrame(heroPreviewFrame);
  let started;
  let lastPaint = 0;
  const animate = (time) => {
    if (started === undefined) started = time;
    if (time - lastPaint > 70) {
      const cycle = (time - started) % 7000;
      const progress = Math.min(1, cycle / 5000);
      drawHeroWater(MIN_WATER + (FORECAST_NAVD88 - MIN_WATER) * progress);
      lastPaint = time;
    }
    heroPreviewFrame = requestAnimationFrame(animate);
  };
  heroPreviewFrame = requestAnimationFrame(animate);
}

function loadThresholdSurface() {
  const image = new Image();
  image.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0);
    thresholdPixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    thresholdWidth = canvas.width;
    thresholdHeight = canvas.height;
    drawWater(Number(slider.value));
    startHeroWaterPreview();
  };
  image.onerror = () => { note.textContent = "The continuous water layer could not be loaded."; };
  image.src = "connected-threshold.png";
}

function feet(value) { return `${Number(value).toFixed(2)} ft`; }

function populateAnalysis(data) {
  analysis = data;
  imageBounds = L.latLngBounds(data.bounds);
  L.imageOverlay("basemap.png", imageBounds, { opacity: 1, interactive: false }).addTo(map);
  terrainLayer = L.imageOverlay("terrain-overlay.png", imageBounds, { opacity: 0, interactive: false }).addTo(map);
  map.setMaxBounds(imageBounds.pad(0.08));
  map.fitBounds(imageBounds, { padding: [18, 18] });
  loadThresholdSurface();

  const seen = new Set();
  for (const loc of data.locations) {
    const duplicateKey = `${loc.latitude.toFixed(6)},${loc.longitude.toFixed(6)}`;
    if (!seen.has(duplicateKey)) {
      seen.add(duplicateKey);
      const special = loc.kind === "wetland" ? "#53c6ba" : loc.kind === "property" ? "#f0b429" : "#fff";
      L.marker([loc.latitude, loc.longitude], { icon: markerIcon(special) }).addTo(elevationMarkers)
        .bindPopup(`<h3>${esc(loc.location)}</h3><b>${feet(loc.elevation_ft)} NAVD88</b><br>Nearby sampled low: ${feet(loc.lowest_adjacent_ft)}<br>Terrain-only connection threshold: ${feet(loc.dem_minimum_connected_level_ft_navd88)}`);
    }
  }

  const tableNames = new Set(["Beach & Pierce", "Beach & Scott", "Marina & Scott", "Beach & Divisadero", "Beach & Fillmore", "Marina & Fillmore", "St. Francis Yacht Club parking area", "Palace of Fine Arts west side", "Crissy Field east parking area", "Crissy Marsh"]);
  document.querySelector("#elevation-rows").innerHTML = data.locations.filter((x) => tableNames.has(x.location)).map((x) => {
    const margin = x.elevation_ft - FORECAST_NAVD88;
    return `<tr><td>${esc(x.location)}</td><td>${feet(x.elevation_ft)}</td><td>${feet(x.lowest_adjacent_ft)}</td><td>${margin >= 0 ? "+" : ""}${margin.toFixed(2)} ft</td></tr>`;
  }).join("");
}

function reportPopup(report) {
  const when = report.observed_at ? new Date(report.observed_at).toLocaleString() : new Date(report.created_at * 1000).toLocaleString();
  const depth = report.depth_inches == null ? "" : `<br>Reported depth: ${Number(report.depth_inches).toFixed(1)} in`;
  return `<div class="map-report"><h3>${esc(report.category)} report</h3><b>${esc(report.nickname)}</b> - ${esc(when)}${depth}<p>${esc(report.comment)}</p><button type="button" data-flag="${Number(report.id)}">Flag</button></div>`;
}

async function loadReports() {
  try {
    const response = await fetch(API, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Reports unavailable");
    const data = await response.json();
    reportMarkers.clearLayers();
    for (const report of data.reports || []) {
      L.marker([report.latitude, report.longitude], { icon: markerIcon("#f0b429") }).addTo(reportMarkers).bindPopup(reportPopup(report));
    }
  } catch (error) {
    console.warn(error);
  }
}

function openReportAt(latlng) {
  document.querySelector("#report-lat").value = latlng.lat.toFixed(6);
  document.querySelector("#report-lon").value = latlng.lng.toFixed(6);
  document.querySelector("#form-status").textContent = "";
  reportMode = false;
  document.querySelector("#add-report").textContent = "Add a flood report";
  dialog.showModal();
}

slider.addEventListener("input", () => {
  cancelAnimationFrame(animationFrame);
  animationStarted = undefined;
  document.querySelector("#play-rise").textContent = "Watch water rise";
  document.querySelector(".map-shell").classList.remove("rising");
  drawWater(Number(slider.value));
});
document.querySelector("#jump-forecast").addEventListener("click", () => setWater(FORECAST_NAVD88));
document.querySelector("#jump-extreme").addEventListener("click", () => setWater(20));
document.querySelector("#terrain-toggle").addEventListener("change", (event) => terrainLayer?.setOpacity(event.currentTarget.checked ? 0.46 : 0));
document.querySelector("#play-rise").addEventListener("click", (event) => {
  if (animationStarted !== undefined) {
    cancelAnimationFrame(animationFrame);
    animationStarted = undefined;
    event.currentTarget.textContent = "Watch water rise";
    document.querySelector(".map-shell").classList.remove("rising");
    return;
  }
  event.currentTarget.textContent = "Pause rising water";
  document.querySelector(".map-shell").classList.add("rising");
  const duration = 9000;
  const animate = (time) => {
    if (animationStarted === undefined) animationStarted = time;
    const progress = Math.min(1, (time - animationStarted) / duration);
    setWater(MIN_WATER + progress * (MAX_WATER - MIN_WATER));
    if (progress < 1) animationFrame = requestAnimationFrame(animate);
    else {
      animationStarted = undefined;
      event.currentTarget.textContent = "Watch it rise again";
      document.querySelector(".map-shell").classList.remove("rising");
    }
  };
  animationFrame = requestAnimationFrame(animate);
});
document.querySelector("#add-report").addEventListener("click", (event) => {
  reportMode = !reportMode;
  event.currentTarget.textContent = reportMode ? "Click a spot on the map" : "Add a flood report";
  note.textContent = reportMode ? "Click the observed flooding location on the map." : "Report placement cancelled.";
});
map.on("click", (event) => { if (reportMode) openReportAt(event.latlng); });

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const status = document.querySelector("#form-status");
  status.textContent = "Publishing...";
  const body = Object.fromEntries(new FormData(form).entries());
  try {
    const response = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || "Could not publish report.");
    status.textContent = "Published. Thank you.";
    setTimeout(() => dialog.close(), 650);
    form.reset();
    await loadReports();
  } catch (error) {
    status.textContent = error.message;
  }
});

map.on("popupopen", (event) => {
  const button = event.popup.getElement()?.querySelector("[data-flag]");
  if (!button) return;
  button.addEventListener("click", async () => {
    button.disabled = true;
    button.textContent = "Flagged";
    await fetch(`${API}/${button.dataset.flag}/flag`, { method: "POST" }).catch(() => {});
  }, { once: true });
});

fetch(DATA_URL).then((response) => response.json()).then(populateAnalysis).catch((error) => {
  note.textContent = "Elevation layer could not be loaded.";
  console.error(error);
});
loadReports();
