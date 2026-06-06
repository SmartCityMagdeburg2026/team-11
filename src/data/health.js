import ExcelJS from "exceljs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dataSources } from "./sources.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const healthDir = path.join(__dirname, "health");

let cachedHealthData;

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

async function getHealthFile() {
  const files = await fs.readdir(healthDir);
  const file = files.find((name) =>
    name.includes("Daten_Gesundheit und Soziales") && name.endsWith(".xlsx")
  );

  if (!file) {
    throw new Error("The health dataset workbook is missing.");
  }

  return path.join(healthDir, file);
}

async function readSheetRows(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.worksheets[0];
  const rows = [];

  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
    rows.push(sheet.getRow(rowNumber).values.slice(1));
  }

  return rows;
}

function parseHealthRows(rows) {
  const yearMap = new Map();

  for (const row of rows) {
    const year = Number(row[0]);
    if (!Number.isFinite(year)) {
      continue;
    }

    const name = String(row[1] ?? "").trim();
    if (!name) {
      continue;
    }

    const doctors = asNumber(row[2]);
    const dentists = asNumber(row[3]);
    const pharmacies = asNumber(row[4]);
    const total = doctors + dentists + pharmacies;

    const districts = yearMap.get(year) ?? [];
    districts.push({ name, year, doctors, dentists, pharmacies, total });
    yearMap.set(year, districts);
  }

  const years = [...yearMap.keys()].sort((a, b) => a - b);
  const latestYear = years.at(-1) ?? null;
  const districtsByYear = Object.fromEntries(
    years.map((year) => [year, yearMap.get(year).map((district) => ({ ...district }))])
  );
  const districts = latestYear ? districtsByYear[latestYear] : [];
//   console.log({ years, latestYear, districtsByYear, districts });
  return { years, latestYear, districtsByYear, districts };
}

function buildHealthSummary({ districts }) {
  const totals = districts.reduce(
    (summary, district) => {
      summary.doctors += district.doctors;
      summary.dentists += district.dentists;
      summary.pharmacies += district.pharmacies;
      return summary;
    },
    { doctors: 0, dentists: 0, pharmacies: 0 }
  );

  return {
    totalDoctors: totals.doctors,
    totalDentists: totals.dentists,
    totalPharmacies: totals.pharmacies
  };
}

export async function getHealthDashboardData() {
  if (cachedHealthData) {
    return cachedHealthData;
  }

  const filePath = await getHealthFile();
  const rows = await readSheetRows(filePath);
  const health = parseHealthRows(rows);

  console.log("Health data loaded:", {
    latestYear: health.latestYear,
    districtsCount: health.districts.length,
    totalDoctors: health.districts.reduce((sum, d) => sum + d.doctors, 0),
    totalDentists: health.districts.reduce((sum, d) => sum + d.dentists, 0),
    totalPharmacies: health.districts.reduce((sum, d) => sum + d.pharmacies, 0)
  });

  cachedHealthData = {
    generatedAt: new Date().toISOString(),
    summary: buildHealthSummary(health),
    ...health,
    sources: dataSources
  };

  return cachedHealthData;
}
