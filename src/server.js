import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dashboardData } from "./data/dashboard.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "..", "public");

const PORT = 8080;

app.disable("x-powered-by");
app.use(express.json());
app.use(express.static(publicDir));

app.get("/api/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "smartcity-dashboard",
    port: PORT
  });
});

app.get("/api/dashboard", (_request, response) => {
  response.json({
    ...dashboardData,
    generatedAt: new Date().toISOString()
  });
});

app.get("/", (_request, response) => {
  response.sendFile(path.join(publicDir, "index.html"));
});

app.use((_request, response) => {
  response.status(404).json({ error: "Route not found" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SmartCity dashboard is listening on port ${PORT}`);
});
