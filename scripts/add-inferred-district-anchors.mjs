import fs from "node:fs/promises";

const outputPath = "public/data/district-coordinates.json";

const inferredAnchors = [
  {
    name: "Neustädter Feld West",
    lat: 52.1642,
    lon: 11.6086,
    displayName: "Inferred from Neustädter Feld west of Meseberger Weg",
    matchedVariant: "inferred: Neustädter Feld West"
  },
  {
    name: "Neustädter Feld Ost",
    lat: 52.1644,
    lon: 11.6233,
    displayName: "Inferred from Neustädter Feld east of Meseberger Weg",
    matchedVariant: "inferred: Neustädter Feld Ost"
  },
  {
    name: "Junkerssiedlung",
    lat: 52.1477962,
    lon: 11.6037815,
    displayName: "Inferred from nearby Juliusstraße, Nordwest",
    matchedVariant: "inferred: Juliusstraße"
  },
  {
    name: "Spielhagensiedlung",
    lat: 52.1277143,
    lon: 11.5991346,
    displayName: "Inferred from Spielhagenstraße, Stadtfeld West",
    matchedVariant: "inferred: Spielhagenstraße"
  },
  {
    name: "Planeten- und SKL-Siedlung",
    lat: 52.0846069,
    lon: 11.6200014,
    displayName: "Inferred from Planetenweg, Reform",
    matchedVariant: "inferred: Planetenweg"
  },
  {
    name: "Kristallpalast",
    lat: 52.1127153,
    lon: 11.6157327,
    displayName: "Inferred from Am Fuchsberg, Leipziger Straße",
    matchedVariant: "inferred: Am Fuchsberg"
  },
  {
    name: "Osterweddinger Siedlung",
    lat: 52.0806591,
    lon: 11.572058,
    displayName: "Inferred from Osterweddinger Straße, Ottersleben",
    matchedVariant: "inferred: Osterweddinger Straße"
  },
  {
    name: "Alt Lemsdorf",
    lat: 52.0982427,
    lon: 11.5974961,
    displayName: "Inferred from Lemsdorf administrative area",
    matchedVariant: "inferred: Lemsdorf"
  },
  {
    name: "Olvenstedter Röthe",
    lat: 52.1531,
    lon: 11.5744,
    displayName: "Inferred from western Alt Olvenstedt / Weizengrund area",
    matchedVariant: "inferred: Olvenstedt west"
  },
  {
    name: "Westerhüsener Park",
    lat: 52.0636,
    lon: 11.674,
    displayName: "Inferred from Alt Westerhüsen park-side area",
    matchedVariant: "inferred: Alt Westerhüsen"
  },
  {
    name: "Bahnhof Rothensee",
    lat: 52.1814,
    lon: 11.6626,
    displayName: "Inferred from Rothensee rail station area",
    matchedVariant: "inferred: Rothensee station"
  }
];

const cache = JSON.parse(await fs.readFile(outputPath, "utf8"));
const byName = new Map(cache.coordinates.map((item) => [item.name, item]));

for (const anchor of inferredAnchors) {
  byName.set(anchor.name, {
    ...anchor,
    class: "inferred",
    type: "statistical-district-anchor",
    importance: 0,
    inferred: true
  });
}

const missing = cache.missing.filter((name) => !byName.has(name));

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

console.log(`Coordinate cache now has ${byName.size} entries; ${missing.length} missing.`);
