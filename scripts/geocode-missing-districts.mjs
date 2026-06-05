import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const boundaryPath = path.join(root, "public/data/magdeburg-nominatim.json");
const outputPath = path.join(root, "public/data/district-coordinates.json");
const userAgent = "MagdePulseDashboard/1.0";

const manualVariants = new Map([
  ["Neu Reform", ["Neu-Reform", "Reform"]],
  ["Alt Reform", ["Alt-Reform", "Reform"]],
  ["St.Pauli/Alexander-Puschkin-Straße", ["St. Pauli", "Sankt Pauli", "Alexander-Puschkin-Straße"]],
  ["Planeten- und SKL-Siedlung", ["Planetensiedlung", "SKL-Siedlung"]],
  ["Alt Olvenstedt Dorf", ["Alt Olvenstedt", "Olvenstedt"]],
  ["Bördecenter", ["Bördecenter", "Börde Center", "Bördepark"]],
  ["Barro-See", ["Barrosee", "Barro-See"]],
  ["Bahnhof Rothensee", ["Rothensee Bahnhof", "Bahnhof Rothensee"]]
]);

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

    if (intersects) inside = !inside;
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

function variants(name) {
  const parts = name.split("/").map((part) => part.trim()).filter(Boolean);
  const cleaned = name
    .replace(/^Wohngebiet\s+/i, "")
    .replace(/^Gewerbegebiet\s+/i, "")
    .replace(/^Siedlung\s+/i, "")
    .replace(/\s+Dorf$/i, "")
    .trim();
  const values = [
    name,
    cleaned,
    name.replace("/", " "),
    name.replace(/\s+/g, "-"),
    ...parts,
    ...(manualVariants.get(name) ?? [])
  ];

  return [...new Set(values.filter(Boolean))];
}

async function geocodeVariant(originalName, variant, boundary, bbox) {
  const query = new URLSearchParams({
    format: "jsonv2",
    q: `${variant}, Magdeburg, Sachsen-Anhalt, Germany`,
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
    throw new Error(`Nominatim returned ${response.status}`);
  }

  const results = await response.json();
  const inside = results
    .map((result) => ({
      name: originalName,
      lat: Number(result.lat),
      lon: Number(result.lon),
      displayName: result.display_name,
      class: result.class,
      type: result.type,
      importance: result.importance ?? 0,
      matchedVariant: variant
    }))
    .filter((result) => pointInBoundary([result.lon, result.lat], boundary));

  inside.sort((a, b) => b.importance - a.importance);
  return inside[0] ?? null;
}

const rawBoundary = JSON.parse(await fs.readFile(boundaryPath, "utf8"));
const boundary = boundaryFeature(rawBoundary);
const bbox = boundaryBbox(boundary);
const cache = JSON.parse(await fs.readFile(outputPath, "utf8"));
const remaining = [...cache.missing];
const found = [];
const missing = [];

for (const [index, name] of remaining.entries()) {
  let result = null;

  for (const variant of variants(name)) {
    await sleep(1050);
    result = await geocodeVariant(name, variant, boundary, bbox);

    if (result) {
      break;
    }
  }

  if (result) {
    found.push(result);
    console.log(`${index + 1}/${remaining.length} OK ${name} -> ${result.matchedVariant}`);
  } else {
    missing.push(name);
    console.log(`${index + 1}/${remaining.length} MISS ${name}`);
  }
}

const byName = new Map(cache.coordinates.map((item) => [item.name, item]));
for (const item of found) {
  byName.set(item.name, item);
}

await fs.writeFile(
  outputPath,
  JSON.stringify(
    {
      ...cache,
      updatedAt: new Date().toISOString(),
      coordinates: [...byName.values()].sort((a, b) => a.name.localeCompare(b.name, "de")),
      missing
    },
    null,
    2
  )
);

console.log(`Added ${found.length} coordinates; ${missing.length} still missing.`);
