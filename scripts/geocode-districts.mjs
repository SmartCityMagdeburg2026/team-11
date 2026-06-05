import fs from "node:fs/promises";
import path from "node:path";
import ExcelJS from "exceljs";

const root = process.cwd();
const populationWorkbook = path.join(
  root,
  "src/data/population/Hauptwohnsitzbevölkerung nach Statistischen Bezirken und Geschlecht.xlsx"
);
const boundaryPath = path.join(root, "public/data/magdeburg-nominatim.json");
const outputPath = path.join(root, "public/data/district-coordinates.json");
const userAgent = "MagdePulseDashboard/1.0";

function asNumber(value) {
  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function boundaryFeature(rawBoundary) {
  const result = rawBoundary.find((item) => item.geojson?.type);
  return {
    type: "Feature",
    properties: { name: result.display_name, osmId: result.osm_id },
    geometry: result.geojson
  };
}

function boundaryPolygons(feature) {
  return feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
}

function boundaryBbox(feature) {
  const coords = boundaryPolygons(feature).flat(2);
  const lons = coords.map((coord) => coord[0]);
  const lats = coords.map((coord) => coord[1]);

  return {
    minLon: Math.min(...lons),
    maxLon: Math.max(...lons),
    minLat: Math.min(...lats),
    maxLat: Math.max(...lats)
  };
}

function pointInRing(point, ring) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersects = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function pointInBoundary(point, feature) {
  return boundaryPolygons(feature).some((polygon) => {
    const [outer, ...holes] = polygon;
    return pointInRing(point, outer) && !holes.some((hole) => pointInRing(point, hole));
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getDistricts() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(populationWorkbook);
  const sheet = workbook.worksheets[0];
  const byName = new Map();

  for (let rowNumber = 2; rowNumber <= sheet.rowCount; rowNumber += 1) {
    const row = sheet.getRow(rowNumber).values.slice(1);
    const year = Number(row[0]);
    const name = String(row[1]);

    if (year !== 2025 || name === "Magdeburg") {
      continue;
    }

    const total = asNumber(row[4]);

    if (total > 0) {
      byName.set(name, total);
    }
  }

  return [...byName.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name);
}

async function geocode(name, boundary, bbox) {
  const query = new URLSearchParams({
    format: "jsonv2",
    q: `${name}, Magdeburg, Sachsen-Anhalt, Germany`,
    addressdetails: "1",
    limit: "5",
    countrycodes: "de",
    viewbox: `${bbox.minLon},${bbox.maxLat},${bbox.maxLon},${bbox.minLat}`,
    bounded: "1"
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${query}`, {
    headers: { "User-Agent": userAgent }
  });

  if (!response.ok) {
    throw new Error(`Nominatim returned ${response.status} for ${name}`);
  }

  const results = await response.json();
  const inside = results
    .map((result) => ({
      name,
      lat: Number(result.lat),
      lon: Number(result.lon),
      displayName: result.display_name,
      class: result.class,
      type: result.type,
      importance: result.importance ?? 0
    }))
    .filter((result) => pointInBoundary([result.lon, result.lat], boundary));

  inside.sort((a, b) => b.importance - a.importance);
  return inside[0] ?? null;
}

const rawBoundary = JSON.parse(await fs.readFile(boundaryPath, "utf8"));
const boundary = boundaryFeature(rawBoundary);
const bbox = boundaryBbox(boundary);
const districts = await getDistricts();
const coordinates = [];
const missing = [];

for (const [index, district] of districts.entries()) {
  if (index > 0) {
    await sleep(1050);
  }

  try {
    const result = await geocode(district, boundary, bbox);

    if (result) {
      coordinates.push(result);
      console.log(`${index + 1}/${districts.length} OK ${district}`);
    } else {
      missing.push(district);
      console.log(`${index + 1}/${districts.length} MISS ${district}`);
    }
  } catch (error) {
    missing.push(district);
    console.log(`${index + 1}/${districts.length} ERROR ${district}: ${error.message}`);
  }
}

await fs.writeFile(
  outputPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      provider: "Nominatim/OpenStreetMap",
      boundaryOsmRelation: 62481,
      coordinates,
      missing
    },
    null,
    2
  )
);

console.log(`Saved ${coordinates.length} coordinates; ${missing.length} missing.`);
