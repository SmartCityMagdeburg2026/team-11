import ExcelJS from "exceljs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dataSources } from "./sources.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const populationDir = path.join(__dirname, "population");

const monthOrder = new Map([
  ["Januar", 1],
  ["Februar", 2],
  ["März", 3],
  ["April", 4],
  ["Mai", 5],
  ["Juni", 6],
  ["Juli", 7],
  ["August", 8],
  ["September", 9],
  ["Oktober", 10],
  ["November", 11],
  ["Dezember", 12]
]);

const ageLabels = ["Under 18", "18-25", "25-30", "30-50", "50-65", "65+"];

let cachedPopulationData;

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

function monthMeta(year, monthName) {
  const month = monthOrder.get(monthName) ?? 1;

  return {
    month,
    label: `${year}-${String(month).padStart(2, "0")}`,
    dateKey: year * 100 + month
  };
}

function groupByYear(rows, makeSeed, consumeRow) {
  const groups = new Map();

  for (const row of rows) {
    const year = Number(row[0]);

    if (!Number.isFinite(year)) {
      continue;
    }

    const item = groups.get(year) ?? makeSeed(year);
    consumeRow(item, row);
    groups.set(year, item);
  }

  return [...groups.values()].sort((a, b) => a.year - b.year);
}

function latestComplete(items) {
  return [...items].reverse().find((item) => item.months >= 12) ?? items.at(-1);
}

async function getPopulationFiles() {
  const files = await fs.readdir(populationDir);
  const pick = (predicate) => {
    const file = files.find(predicate);

    if (!file) {
      throw new Error("A required population dataset is missing.");
    }

    return path.join(populationDir, file);
  };

  return {
    districtGender: pick((name) => name.startsWith("Haupt")),
    vitalEvents: pick((name) => name.startsWith("Geburten")),
    migration: pick((name) => name.startsWith("Zuz") && name.includes(",")),
    ageQuote: pick((name) => name.startsWith("Jugend")),
    ageIncoming: pick((name) => name.startsWith("Zuz") && !name.includes(",")),
    ageOutgoing: pick((name) => name.startsWith("Weg"))
  };
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

function parsePopulationRows(rows) {
  const districtTrends = new Map();

  for (const row of rows) {
    const name = String(row[1]);

    if (name === "Magdeburg") {
      continue;
    }

    const trend = districtTrends.get(name) ?? [];
    trend.push({
      year: Number(row[0]),
      male: asNumber(row[2]),
      female: asNumber(row[3]),
      total: asNumber(row[4])
    });
    districtTrends.set(name, trend);
  }

  const cityPopulation = rows
    .filter((row) => row[1] === "Magdeburg")
    .map((row) => {
      const male = asNumber(row[2]);
      const female = asNumber(row[3]);
      const total = asNumber(row[4]);

      return {
        year: Number(row[0]),
        male,
        female,
        total,
        femaleShare: total ? round((female / total) * 100, 2) : 0,
        maleShare: total ? round((male / total) * 100, 2) : 0
      };
    })
    .sort((a, b) => a.year - b.year);

  const latestYear = cityPopulation.at(-1)?.year;
  const districtPopulation = rows
    .filter((row) => Number(row[0]) === latestYear && row[1] !== "Magdeburg")
    .map((row) => ({
      name: String(row[1]),
      male: asNumber(row[2]),
      female: asNumber(row[3]),
      total: asNumber(row[4]),
      year: latestYear,
      trend: (districtTrends.get(String(row[1])) ?? []).sort((a, b) => a.year - b.year)
    }))
    .filter((row) => row.total > 0);

  const topDistricts = [...districtPopulation].sort((a, b) => b.total - a.total).slice(0, 12);

  return { cityPopulation, districtPopulation, topDistricts };
}

function parseMigrationRows(rows) {
  const annual = groupByYear(
    rows,
    (year) => ({ year, arrivals: 0, departures: 0, net: 0, internalMoves: 0, months: 0 }),
    (item, row) => {
      item.arrivals += asNumber(row[4]);
      item.departures += asNumber(row[8]);
      item.net += asNumber(row[12]);
      item.internalMoves += asNumber(row[13]);
      item.months += 1;
    }
  );

  return { annual };
}

function parseVitalRows(rows) {
  const annual = groupByYear(
    rows,
    (year) => ({ year, marriages: 0, births: 0, deaths: 0, birthDeathGap: 0, months: 0 }),
    (item, row) => {
      const births = asNumber(row[4]);
      const deaths = asNumber(row[10]);
      item.marriages += asNumber(row[2]);
      item.births += births;
      item.deaths += deaths;
      item.birthDeathGap += births - deaths;
      item.months += 1;
    }
  );

  return { annual };
}

function parseAgeQuoteRows(rows) {
  return rows
    .map((row) => ({
      year: Number(row[0]),
      youth: round(asNumber(row[1]), 2),
      elderly: round(asNumber(row[2]), 2)
    }))
    .filter((row) => Number.isFinite(row.year))
    .sort((a, b) => a.year - b.year);
}

function parseAgeMigrationRows(incomingRows, outgoingRows) {
  const outgoingByYear = new Map(outgoingRows.map((row) => [Number(row[0]), row]));

  return incomingRows
    .map((incomingRow) => {
      const year = Number(incomingRow[0]);
      const outgoingRow = outgoingByYear.get(year);

      if (!outgoingRow) {
        return null;
      }

      return {
        year,
        values: ageLabels.map((label, index) => {
          const incoming = asNumber(incomingRow[index + 1]);
          const outgoing = asNumber(outgoingRow[index + 1]);

          return {
            label,
            incoming,
            outgoing,
            net: incoming - outgoing
          };
        })
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.year - b.year);
}

function buildSummary({ cityPopulation, migration, vital, ageQuote }) {
  const firstPopulation = cityPopulation[0];
  const latestPopulation = cityPopulation.at(-1);
  const latestMigration = latestComplete(migration.annual);
  const latestVital = latestComplete(vital.annual);
  const latestAge = ageQuote.at(-1);

  return {
    population: latestPopulation?.total ?? 0,
    populationYear: latestPopulation?.year,
    populationGrowth: latestPopulation && firstPopulation ? latestPopulation.total - firstPopulation.total : 0,
    migrationNet: latestMigration?.net ?? 0,
    migrationYear: latestMigration?.year,
    birthDeathGap: latestVital?.birthDeathGap ?? 0,
    birthDeathGapYear: latestVital?.year,
    elderlyQuote: latestAge?.elderly ?? 0,
    youthQuote: latestAge?.youth ?? 0,
    ageQuoteYear: latestAge?.year
  };
}

export async function getPopulationDashboardData() {
  if (cachedPopulationData) {
    return cachedPopulationData;
  }

  const files = await getPopulationFiles();
  const [districtRows, migrationRows, vitalRows, ageQuoteRows, ageIncomingRows, ageOutgoingRows] =
    await Promise.all([
      readSheetRows(files.districtGender),
      readSheetRows(files.migration),
      readSheetRows(files.vitalEvents),
      readSheetRows(files.ageQuote),
      readSheetRows(files.ageIncoming),
      readSheetRows(files.ageOutgoing)
    ]);

  const population = parsePopulationRows(districtRows);
  const migration = parseMigrationRows(migrationRows);
  const vital = parseVitalRows(vitalRows);
  const ageQuote = parseAgeQuoteRows(ageQuoteRows);
  const ageMigration = parseAgeMigrationRows(ageIncomingRows, ageOutgoingRows);

  cachedPopulationData = {
    generatedAt: new Date().toISOString(),
    summary: buildSummary({
      cityPopulation: population.cityPopulation,
      migration,
      vital,
      ageQuote
    }),
    population,
    migration,
    vital,
    ageQuote,
    ageMigration,
    sources: dataSources
  };

  return cachedPopulationData;
}
