import express from "express";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { getPopulationDashboardData } from "./data/population.js";
import { getHealthDashboardData } from "./data/health.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);
const publicDir = path.join(__dirname, "..", "public");
const chartJsPath = path.join(path.dirname(require.resolve("chart.js")), "chart.umd.js");
const leafletDir = path.dirname(require.resolve("leaflet"));
const leafletJsPath = path.join(leafletDir, "leaflet.js");
const leafletCssPath = path.join(leafletDir, "leaflet.css");

const PORT = 8080;

app.disable("x-powered-by");
app.use(express.json());
app.use(express.static(publicDir));
app.use("/vendor/images", express.static(path.join(leafletDir, "images")));

app.get("/api/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "smartcity-dashboard",
    port: PORT
  });
});

app.get("/vendor/chart.js", (_request, response) => {
  response.sendFile(chartJsPath);
});

app.get("/vendor/leaflet.js", (_request, response) => {
  response.sendFile(leafletJsPath);
});

app.get("/vendor/leaflet.css", (_request, response) => {
  response.sendFile(leafletCssPath);
});

app.get("/api/dashboard", async (_request, response, next) => {
  try {
    response.json({
      app: {
        name: "MagdePulse",
        tagline: "Don't just live in Magdeburg. Feel its pulse.",
        categories: ["Population", "Education", "Infrastructure", "Health and Social Services"]
      },
      population: await getPopulationDashboardData(),
      health: await getHealthDashboardData(),
      alerts: [
        {
          level: { en: "Data", de: "Daten" },
          title: { en: "2026 values are partial", de: "Werte für 2026 sind vorläufig" },
          detail: {
            en: "Monthly migration and vital-event data currently include January through April 2026.",
            de: "Monatliche Wanderungs- und Lebensereignisdaten enthalten aktuell Januar bis April 2026."
          }
        },
        {
          level: { en: "Insight", de: "Hinweis" },
          title: { en: "Population stock is annual", de: "Bevölkerungsbestand ist jährlich" },
          detail: {
            en: "City-level total and gender trends use the Magdeburg aggregate row from the district workbook.",
            de: "Gesamtzahl und Geschlechtertrend nutzen die Magdeburg-Aggregatzeile aus der Bezirksdatei."
          }
        },
        {
          level: { en: "Note", de: "Notiz" },
          title: { en: "More sections coming", de: "Weitere Bereiche folgen" },
          detail: {
            en: "Education, infrastructure, health and social services are prepared as placeholders.",
            de: "Bildung, Infrastruktur sowie Gesundheit und Soziales sind als Platzhalter vorbereitet."
          }
        }
      ]
    });
  } catch (error) {
    next(error);
  }
});

app.get("/", (_request, response) => {
  response.sendFile(path.join(publicDir, "index.html"));
});

app.use((_request, response) => {
  response.status(404).json({ error: "Route not found" });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ error: "Dashboard data could not be loaded" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`MagdePulse dashboard is listening on port ${PORT}`);
});
