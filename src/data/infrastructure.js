import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dataSources } from "./sources.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const infrastructureDir = path.join(__dirname, "..", "..", "public", "data", "json", "bautaetigkeit-und-wohnen");

let cachedInfrastructureData;

function asNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (value && typeof value === "object") {
    return asNumber(value.result ?? value.text);
  }

  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function round(value, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

async function readJsonRows(fileName) {
  const filePath = path.join(infrastructureDir, fileName);
  const content = await fs.readFile(filePath, "utf8");
  const data = JSON.parse(content);

  return data.rows ?? [];
}

function aggregateByYear(rows, seed, consumeRow) {
  const groups = new Map();

  for (const row of rows) {
    const year = Number(row.var1);

    if (!Number.isFinite(year)) {
      continue;
    }

    const item = groups.get(year) ?? seed(year);
    consumeRow(item, row);
    groups.set(year, item);
  }

  return [...groups.values()].sort((a, b) => a.year - b.year);
}

function parseHousingStock(rows) {
  return rows
    .map((row) => ({
      year: Number(row.var1),
      total: asNumber(row.var2),
      rooms: [
        { label: "1", value: asNumber(row.var3) },
        { label: "2", value: asNumber(row.var4) },
        { label: "3", value: asNumber(row.var5) },
        { label: "4", value: asNumber(row.var6) },
        { label: "5", value: asNumber(row.var7) },
        { label: "6", value: asNumber(row.var8) },
        { label: "7", value: asNumber(row.var9) },
        { label: "8+", value: asNumber(row.var10) }
      ],
      floorArea: asNumber(row.var11)
    }))
    .filter((row) => Number.isFinite(row.year))
    .sort((a, b) => a.year - b.year);
}

function parseCompletedRows(rows) {
  return aggregateByYear(
    rows,
    (year) => ({ year, completed: 0 }),
    (item, row) => {
      item.completed += asNumber(row.var3);
    }
  );
}

function parseBuildingRows(rows) {
  return aggregateByYear(
    rows,
    (year) => ({ year, buildings: 0 }),
    (item, row) => {
      item.buildings += asNumber(row.var3);
    }
  );
}

function parseVacancyRows(rows) {
  return aggregateByYear(
    rows,
    (year) => ({ year, total: 0, vacant: 0, rate: 0 }),
    (item, row) => {
      item.total += asNumber(row.var3);
      item.vacant += asNumber(row.var4);
      item.rate = item.total ? round((item.vacant / item.total) * 100, 2) : 0;
    }
  );
}

function buildSummary({ housingStock, completed, buildings, vacancy }) {
  const latestHousing = housingStock.at(-1);
  const firstHousing = housingStock[0];
  const latestCompleted = completed.at(-1);
  const latestBuildings = buildings.at(-1);
  const latestVacancy = vacancy.at(-1);

  return {
    housingStock: latestHousing?.total ?? 0,
    housingStockYear: latestHousing?.year,
    housingStockGrowth: latestHousing && firstHousing ? latestHousing.total - firstHousing.total : 0,
    floorArea: latestHousing?.floorArea ?? 0,
    floorAreaYear: latestHousing?.year,
    completed: latestCompleted?.completed ?? 0,
    completedYear: latestCompleted?.year,
    buildings: latestBuildings?.buildings ?? 0,
    buildingsYear: latestBuildings?.year,
    vacancyRate: latestVacancy?.rate ?? 0,
    vacancyYear: latestVacancy?.year,
    vacancyUnits: latestVacancy?.vacant ?? 0,
    vacancyTotal: latestVacancy?.total ?? 0,
    roomMix: latestHousing?.rooms ?? []
  };
}

export async function getInfrastructureDashboardData() {
  if (cachedInfrastructureData) {
    return cachedInfrastructureData;
  }

  const [housingStockRows, completedRows, buildingRows, vacancyRows] = await Promise.all([
    readJsonRows("wohnungsbestand-nach-der-zahl-der-raeume-und-jahren.json"),
    readJsonRows("fertiggestellte-wohnungen-im-neubau-in-wohn-u-nichtwohngebaeuden-nach-stadtteilen.json"),
    readJsonRows("gebaeuden-mit-wohnraum-ohne-wohnheime.json"),
    readJsonRows("leerstand-im-geschosswohnungsbau.json")
  ]);

  const housingStock = parseHousingStock(housingStockRows);
  const completed = parseCompletedRows(completedRows);
  const buildings = parseBuildingRows(buildingRows);
  const vacancy = parseVacancyRows(vacancyRows);

  cachedInfrastructureData = {
    generatedAt: new Date().toISOString(),
    summary: buildSummary({ housingStock, completed, buildings, vacancy }),
    housingStock,
    completed,
    buildings,
    vacancy,
    sources: dataSources
  };

  return cachedInfrastructureData;
}