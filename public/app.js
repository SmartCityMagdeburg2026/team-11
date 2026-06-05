const state = {
  data: null,
  language: "en",
  topic: "population",
  selectedPopulationYear: null,
  selectedAgeQuoteIndex: 0,
  selectedAgeIndex: 0,
  charts: {},
  maps: {},
  boundary: null,
  districtCoordinates: new Map()
};

const translations = {
  en: {
    tagline: "Don't just live in Magdeburg. Feel its pulse.",
    topics: {
      population: "Population",
      education: "Education",
      infrastructure: "Infrastructure",
      health: "Health and Social Services"
    },
    introKicker: "Population intelligence",
    introTitle: "MagdePulse",
    introCopy:
      "Explore Magdeburg's population rhythm through resident movement, district patterns, life events, and age structure.",
    placeholders: {
      education: "Education visualizations are ready for future datasets.",
      infrastructure: "Infrastructure visualizations are ready for future datasets.",
      health: "Health and social services visualizations are ready for future datasets."
    },
    comingSoon: "Coming soon",
    readyCopy: "The dashboard framework is prepared. Add datasets to activate this section.",
    kpis: {
      population: "Residents",
      populationHint: "City aggregate, latest annual value",
      growth: "Growth since baseline",
      growthHint: "Change from the first population year",
      migration: "Migration balance",
      migrationHint: "Latest complete annual balance",
      age: "Age structure",
      ageHint: "Youth quota / elderly quota"
    },
    charts: {
      migrationKicker: "Resident migration",
      migrationTitle: "Annual arrivals, departures and migration balance",
      populationKicker: "Population map",
      populationTitle: "Total and gender by statistical district",
      vitalKicker: "Life events",
      vitalTitle: "Births, deaths and birth-death gap",
      ageKicker: "Age structure",
      ageTitle: "Youth and elderly quotas",
      ageMigrationKicker: "Age-group migration",
      ageMigrationTitle: "Moving into and out of Magdeburg by age"
    },
    series: {
      arrivals: "Arrivals",
      departures: "Departures",
      net: "Migration balance",
      births: "Births",
      deaths: "Deaths",
      birthDeathGap: "Birth-death gap",
      youth: "Youth quota",
      elderly: "Elderly quota",
      male: "Male",
      female: "Female",
      incoming: "Incoming",
      outgoing: "Outgoing"
    },
    map: {
      residents: "Residents",
      genderSplit: "Gender split",
      hover: "Hover a district",
      hoverCopy: "Move over any tile to inspect population and gender data.",
      rank: "Rank",
      topDistricts: "Top districts"
    },
    age: {
      year: "Year",
      years: "years",
      net: "Net",
      youth: "Youth",
      elderly: "Elderly"
    },
    alerts: "Alerts",
    close: "Close",
    liveAlerts: "Live alerts",
    sources: "Source"
  },
  de: {
    tagline: "Lebe nicht nur in Magdeburg. Fühle seinen Puls.",
    topics: {
      population: "Bevölkerung",
      education: "Bildung",
      infrastructure: "Infrastruktur",
      health: "Gesundheit und Soziales"
    },
    introKicker: "Bevölkerungsdaten",
    introTitle: "MagdePulse",
    introCopy:
      "Entdecke Magdeburgs Bevölkerungsrhythmus anhand von Wanderung, Bezirksmustern, Lebensereignissen und Altersstruktur.",
    placeholders: {
      education: "Visualisierungen zur Bildung sind für zukünftige Datensätze vorbereitet.",
      infrastructure: "Visualisierungen zur Infrastruktur sind für zukünftige Datensätze vorbereitet.",
      health: "Visualisierungen zu Gesundheit und Sozialem sind für zukünftige Datensätze vorbereitet."
    },
    comingSoon: "Demnächst",
    readyCopy: "Das Dashboard-Framework ist vorbereitet. Neue Datensätze aktivieren diesen Bereich.",
    kpis: {
      population: "Einwohner",
      populationHint: "Stadt-Aggregat, neuester Jahreswert",
      growth: "Wachstum seit Basisjahr",
      growthHint: "Veränderung seit dem ersten Bevölkerungsjahr",
      migration: "Wanderungssaldo",
      migrationHint: "Letzter vollständiger Jahreswert",
      age: "Altersstruktur",
      ageHint: "Jugendquote / Altenquote"
    },
    charts: {
      migrationKicker: "Wanderung",
      migrationTitle: "Jährliche Zuzüge, Wegzüge und Wanderungssaldo",
      populationKicker: "Bevölkerungskarte",
      populationTitle: "Gesamtzahl und Geschlecht nach statistischem Bezirk",
      vitalKicker: "Lebensereignisse",
      vitalTitle: "Geburten, Sterbefälle und Geburten-Sterbefälle-Saldo",
      ageKicker: "Altersstruktur",
      ageTitle: "Jugend- und Altenquote",
      ageMigrationKicker: "Altersgruppen-Migration",
      ageMigrationTitle: "Zuzug und Wegzug nach Alter"
    },
    series: {
      arrivals: "Zuzüge",
      departures: "Wegzüge",
      net: "Wanderungssaldo",
      births: "Geburten",
      deaths: "Sterbefälle",
      birthDeathGap: "Geburten-Sterbefälle-Saldo",
      youth: "Jugendquote",
      elderly: "Altenquote",
      male: "Männlich",
      female: "Weiblich",
      incoming: "Zuzug",
      outgoing: "Wegzug"
    },
    map: {
      residents: "Einwohner",
      genderSplit: "Geschlechterverteilung",
      hover: "Bezirk auswählen",
      hoverCopy: "Bewege die Maus über eine Kachel, um Bevölkerungs- und Geschlechtsdaten zu sehen.",
      rank: "Rang",
      topDistricts: "Größte Bezirke"
    },
    age: {
      year: "Jahr",
      years: "Jahre",
      net: "Saldo",
      youth: "Jugend",
      elderly: "Ältere"
    },
    alerts: "Meldungen",
    close: "Schließen",
    liveAlerts: "Live-Meldungen",
    sources: "Quelle"
  }
};

const ageLabelTranslations = {
  en: {
    "Under 18": "Under 18",
    "18-25": "18-25",
    "25-30": "25-30",
    "30-50": "30-50",
    "50-65": "50-65",
    "65+": "65+"
  },
  de: {
    "Under 18": "Unter 18",
    "18-25": "18-25",
    "25-30": "25-30",
    "30-50": "30-50",
    "50-65": "50-65",
    "65+": "65+"
  }
};

const mapBoundarySource = "Map boundary: OpenStreetMap/Nominatim relation 62481";
const coordinateSource = "District anchors: Nominatim/OpenStreetMap, with documented inferred anchors where exact labels are unavailable";

const formatNumber = (value) => new Intl.NumberFormat(state.language === "de" ? "de-DE" : "en-US").format(value);
const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const t = () => translations[state.language];

function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

function formatSigned(value) {
  return `${value >= 0 ? "+" : ""}${formatNumber(value)}`;
}

function mixColor(from, to, amount) {
  const parse = (hex) => hex.replace("#", "").match(/.{1,2}/g).map((part) => parseInt(part, 16));
  const [fr, fg, fb] = parse(from);
  const [tr, tg, tb] = parse(to);
  const mix = (a, b) => Math.round(a + (b - a) * amount).toString(16).padStart(2, "0");
  return `#${mix(fr, tr)}${mix(fg, tg)}${mix(fb, tb)}`;
}

function chartOptions({ percent = false } = {}) {
  return {
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      duration: 900,
      easing: "easeOutQuart"
    },
    interaction: {
      mode: "index",
      intersect: false
    },
    plugins: {
      legend: {
        labels: {
          boxWidth: 10,
          boxHeight: 10,
          usePointStyle: true,
          color: css("--ink"),
          font: { weight: 750 }
        }
      },
      tooltip: {
        backgroundColor: "rgba(81, 14, 0, 0.94)",
        padding: 12,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${formatNumber(context.parsed.y)}${percent ? "%" : ""}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: css("--muted"), maxRotation: 0, autoSkip: true, maxTicksLimit: 10 }
      },
      y: {
        grid: { color: "rgba(81, 14, 0, 0.12)" },
        ticks: {
          color: css("--muted"),
          callback: (value) => `${formatNumber(value)}${percent ? "%" : ""}`
        }
      }
    }
  };
}

function destroyChart(id) {
  state.charts[id]?.destroy();
}

function createChart(id, config) {
  destroyChart(id);
  state.charts[id] = new Chart(document.getElementById(id), config);
}

function sourceText(needles) {
  const sources = state.data.population.sources.filter((source) =>
    needles.some((needle) => source.dataset.includes(needle))
  );

  return sources
    .map((source) => `${source.dataset} · ${source.source} · ${source.url}`)
    .join(" | ");
}

function setSource(id, needles) {
  const suffix = id.includes("source") && (id.includes("population") || id.includes("district"))
    ? ` | ${mapBoundarySource} | ${coordinateSource}`
    : "";
  setText(`#${id}`, `${t().sources}: ${sourceText(needles)}${suffix}`);
}

function annualComplete(rows) {
  return rows.filter((row) => row.months >= 12);
}

async function loadDistrictCoordinates() {
  const response = await fetch("/data/district-coordinates.json");

  if (!response.ok) {
    throw new Error("District coordinate cache could not be loaded.");
  }

  const cache = await response.json();
  return new Map(cache.coordinates.map((item) => [item.name, item]));
}

function populationYears(population) {
  return population.population.cityPopulation.map((row) => row.year);
}

function districtSnapshot(population, year) {
  return population.population.districtPopulation
    .map((district) => {
      const snapshot = district.trend.find((row) => row.year === Number(year));

      if (!snapshot || snapshot.total <= 0) {
        return null;
      }

      return {
        ...district,
        male: snapshot.male,
        female: snapshot.female,
        total: snapshot.total,
        year: snapshot.year
      };
    })
    .filter(Boolean);
}

function renderKpis(summary) {
  const labels = t().kpis;
  const items = [
    {
      label: labels.population,
      value: formatNumber(summary.population),
      hint: `${labels.populationHint} (${summary.populationYear})`
    },
    {
      label: labels.growth,
      value: formatSigned(summary.populationGrowth),
      hint: labels.growthHint
    },
    {
      label: labels.migration,
      value: formatSigned(summary.migrationNet),
      hint: `${labels.migrationHint} (${summary.migrationYear})`
    },
    {
      label: labels.age,
      value: `${summary.youthQuote}% / ${summary.elderlyQuote}%`,
      hint: `${labels.ageHint} (${summary.ageQuoteYear})`
    }
  ];

  const grid = document.getElementById("kpi-grid");
  grid.innerHTML = "";

  for (const item of items) {
    const card = document.createElement("article");
    card.className = "kpi-card";
    card.innerHTML = `<span></span><strong></strong><p></p>`;
    card.querySelector("span").textContent = item.label;
    card.querySelector("strong").textContent = item.value;
    card.querySelector("p").textContent = item.hint;
    grid.append(card);
  }
}

function renderMigrationChart(population) {
  const labels = t().series;
  const source = annualComplete(population.migration.annual);

  createChart("migration-chart", {
    type: "line",
    data: {
      labels: source.map((row) => String(row.year)),
      datasets: [
        {
          label: labels.arrivals,
          data: source.map((row) => row.arrivals),
          borderColor: css("--brand-orange"),
          backgroundColor: "rgba(232, 68, 0, 0.11)",
          borderWidth: 3,
          tension: 0.34,
          fill: true
        },
        {
          label: labels.departures,
          data: source.map((row) => row.departures),
          borderColor: css("--brand-brown"),
          backgroundColor: "rgba(81, 14, 0, 0.08)",
          borderWidth: 3,
          tension: 0.34
        },
        {
          label: labels.net,
          data: source.map((row) => row.net),
          borderColor: css("--signal-green"),
          backgroundColor: css("--signal-green"),
          borderWidth: 2,
          tension: 0.22,
          borderDash: [6, 5]
        }
      ]
    },
    options: chartOptions()
  });
}

function renderVitalChart(population) {
  const labels = t().series;
  const source = annualComplete(population.vital.annual);

  createChart("vital-chart", {
    type: "bar",
    data: {
      labels: source.map((row) => String(row.year)),
      datasets: [
        {
          type: "line",
          label: labels.births,
          data: source.map((row) => row.births),
          borderColor: css("--signal-green"),
          backgroundColor: css("--signal-green"),
          borderWidth: 3,
          tension: 0.28
        },
        {
          type: "line",
          label: labels.deaths,
          data: source.map((row) => row.deaths),
          borderColor: css("--brand-brown"),
          backgroundColor: css("--brand-brown"),
          borderWidth: 3,
          tension: 0.28
        },
        {
          label: labels.birthDeathGap,
          data: source.map((row) => row.birthDeathGap),
          backgroundColor: "rgba(232, 68, 0, 0.34)",
          borderColor: css("--brand-orange"),
          borderWidth: 1
        }
      ]
    },
    options: chartOptions()
  });
}

function renderPopulationYearSlider(population) {
  const years = populationYears(population);
  const slider = document.getElementById("population-year-slider");

  if (!state.selectedPopulationYear || !years.includes(Number(state.selectedPopulationYear))) {
    state.selectedPopulationYear = years.at(-1);
  }

  slider.min = "0";
  slider.max = String(years.length - 1);
  slider.value = String(years.indexOf(Number(state.selectedPopulationYear)));
  document.getElementById("population-year-output").textContent = state.selectedPopulationYear;
  setText("#population-slider-label", t().age.year);
}

function updateInspector(inspector, district, rank) {
  const copy = t();
  const maleShare = district.total ? Math.round((district.male / district.total) * 100) : 0;
  const femaleShare = district.total ? 100 - maleShare : 0;
  const trendMax = Math.max(...district.trend.map((row) => row.total));
  const trendBars = district.trend
    .map(
      (row) => `
        <span style="--value: ${(row.total / trendMax) * 100}%">
          <i>${row.year}</i>
          <b>${formatNumber(row.total)}</b>
        </span>
      `
    )
    .join("");

  inspector.innerHTML = `
    <p class="eyebrow">${rank ? `${copy.map.rank} ${rank}` : copy.map.hover}</p>
    <h3>${district.name}</h3>
    <strong>${formatNumber(district.total)}</strong>
    <span>${copy.map.residents} · ${district.year}</span>
    <div class="gender-meter" aria-label="${copy.map.genderSplit}">
      <span style="--value: ${maleShare}%"></span>
      <span style="--value: ${femaleShare}%"></span>
    </div>
    <div class="gender-split">
      <span>${copy.series.male}: ${formatNumber(district.male)} (${maleShare}%)</span>
      <span>${copy.series.female}: ${formatNumber(district.female)} (${femaleShare}%)</span>
    </div>
    <div class="district-trend">
      ${trendBars}
    </div>
  `;
}

function normalizeBoundaryFeature(rawBoundary) {
  const result = rawBoundary.find((item) => item.geojson?.type);

  if (!result) {
    throw new Error("Magdeburg boundary geometry is missing.");
  }

  return {
    type: "Feature",
    properties: {
      name: result.display_name,
      osmId: result.osm_id
    },
    geometry: result.geojson
  };
}

async function loadBoundary() {
  const response = await fetch("/data/magdeburg-nominatim.json");

  if (!response.ok) {
    throw new Error("Magdeburg map boundary could not be loaded.");
  }

  return normalizeBoundaryFeature(await response.json());
}

function boundaryPolygons(feature) {
  if (feature.geometry.type === "Polygon") {
    return [feature.geometry.coordinates];
  }

  return feature.geometry.coordinates;
}

function resetLeafletMap(containerId) {
  state.maps[containerId]?.remove();

  const map = L.map(containerId, {
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
    keyboard: true
  });

  L.control.zoom({ position: "bottomright" }).addTo(map);
  L.control
    .attribution({ position: "bottomleft", prefix: false })
    .addAttribution("&copy; OpenStreetMap contributors")
    .addTo(map);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
  }).addTo(map);

  state.maps[containerId] = map;
  return map;
}

function addBoundaryMask(map, feature) {
  const world = [
    [85, -180],
    [85, 180],
    [-85, 180],
    [-85, -180]
  ];
  const holes = boundaryPolygons(feature).map((polygon) =>
    polygon[0].map(([lon, lat]) => [lat, lon])
  );

  L.polygon([world, ...holes], {
    stroke: false,
    fillColor: "#fff7ef",
    fillOpacity: 0.82,
    interactive: false
  }).addTo(map);

  const boundaryLayer = L.geoJSON(feature, {
    style: {
      color: "#e84400",
      weight: 2,
      opacity: 0.88,
      fillColor: "#e84400",
      fillOpacity: 0.08
    }
  }).addTo(map);

  return boundaryLayer;
}

function renderMap(containerId, inspectorId, districts, { ranked = false } = {}) {
  const inspector = document.getElementById(inspectorId);
  const max = Math.max(...districts.map((district) => district.total));
  const rankedDistricts = [...districts].sort((a, b) => b.total - a.total);
  const rankByName = new Map(rankedDistricts.map((district, index) => [district.name, index + 1]));
  const topNames = new Set(rankedDistricts.slice(0, 12).map((district) => district.name));
  const map = resetLeafletMap(containerId);
  const boundaryLayer = addBoundaryMask(map, state.boundary);
  const bounds = boundaryLayer.getBounds();

  inspector.innerHTML = `
    <p class="eyebrow">${t().map.hover}</p>
    <h3>${t().map.topDistricts}</h3>
    <span>${t().map.hoverCopy}</span>
  `;

  districts.forEach((district, index) => {
    const coordinate = state.districtCoordinates.get(district.name);

    if (!coordinate) {
      return;
    }

    const point = [coordinate.lat, coordinate.lon];
    const intensity = Math.max(0.12, Math.sqrt(district.total / max));
    const marker = L.circleMarker(point, {
      radius: 4 + intensity * 11,
      fillColor: mixColor("#ffd6bf", ranked && topNames.has(district.name) ? "#510e00" : "#e84400", intensity),
      fillOpacity: ranked && topNames.has(district.name) ? 0.88 : 0.72,
      color: ranked && topNames.has(district.name) ? "#510e00" : "#ffffff",
      opacity: 0.94,
      weight: ranked && topNames.has(district.name) ? 2 : 1,
      dashArray: coordinate.inferred ? "4 3" : null
    }).addTo(map);
    const rank = rankByName.get(district.name);
    const onInspect = () => updateInspector(inspector, district, ranked ? rank : null);
    marker.bindTooltip(
      `${district.name}: ${formatNumber(district.total)}${coordinate.inferred ? " · inferred anchor" : ""}`,
      {
      direction: "top",
      sticky: true
      }
    );
    marker.on("mouseover", onInspect);
    marker.on("click", onInspect);
  });

  map.fitBounds(bounds, { padding: [16, 16] });
  map.setMaxBounds(bounds.pad(0.08));
  setTimeout(() => map.invalidateSize(), 0);
  updateInspector(inspector, rankedDistricts[0], ranked ? 1 : null);
}

function renderAgeStructure(population) {
  const copy = t();
  const selected = population.ageQuote[state.selectedAgeQuoteIndex] ?? population.ageQuote.at(-1);
  const trend = population.ageQuote;
  const orbitRoot = document.getElementById("age-orbits");
  const trendRoot = document.getElementById("age-trend");

  document.getElementById("age-year-label").textContent = selected.year;
  orbitRoot.innerHTML = "";
  trendRoot.innerHTML = "";

  [
    { label: copy.age.youth, value: selected.youth, className: "youth" },
    { label: copy.age.elderly, value: selected.elderly, className: "elderly" }
  ].forEach((item) => {
    const orbit = document.createElement("div");
    orbit.className = `age-orbit ${item.className}`;
    orbit.style.setProperty("--angle", `${Math.min(item.value / 50, 1) * 360}deg`);
    orbit.innerHTML = `
      <div class="age-ring">
        <strong>${item.value}%</strong>
      </div>
      <span>${item.label}</span>
    `;
    orbitRoot.append(orbit);
  });

  for (const row of trend) {
    const item = document.createElement("div");
    item.className = `age-trend-year${row.year === selected.year ? " is-selected" : ""}`;
    item.innerHTML = `
      <span class="age-column youth" style="--value: ${row.youth}%"></span>
      <span class="age-column elderly" style="--value: ${row.elderly}%"></span>
      <small>${row.year}</small>
    `;
    trendRoot.append(item);
  }
}

function renderAgeQuoteSlider(population) {
  const slider = document.getElementById("age-quote-year-slider");
  const rows = population.ageQuote;

  if (state.selectedAgeQuoteIndex >= rows.length) {
    state.selectedAgeQuoteIndex = rows.length - 1;
  }

  slider.min = "0";
  slider.max = String(rows.length - 1);
  slider.value = String(state.selectedAgeQuoteIndex);
  setText("#age-quote-slider-label", t().age.year);
}

function renderPeople(count, direction) {
  return Array.from({ length: count }, (_, index) =>
    `<span class="person ${direction}" style="--i: ${index}"></span>`
  ).join("");
}

function renderAgeFlow(population) {
  const rows = population.ageMigration;
  const selected = rows[state.selectedAgeIndex] ?? rows.at(-1);
  const root = document.getElementById("age-flow-grid");
  const max = Math.max(...selected.values.flatMap((row) => [row.incoming, row.outgoing]));

  document.getElementById("age-flow-year").textContent = selected.year;
  root.innerHTML = "";

  for (const row of selected.values) {
    const incomingCount = Math.max(2, Math.round((row.incoming / max) * 9));
    const outgoingCount = Math.max(2, Math.round((row.outgoing / max) * 9));
    const card = document.createElement("article");
    card.className = "flow-card";
    card.innerHTML = `
      <header>
        <strong>${ageLabelTranslations[state.language][row.label] ?? row.label}</strong>
        <span>${t().age.net}: ${formatSigned(row.net)}</span>
      </header>
      <div class="flow-lanes">
        <div class="flow-lane incoming">
          <span>${t().series.incoming}</span>
          <div>${renderPeople(incomingCount, "incoming")}</div>
          <strong>${formatNumber(row.incoming)}</strong>
        </div>
        <div class="flow-lane outgoing">
          <span>${t().series.outgoing}</span>
          <div>${renderPeople(outgoingCount, "outgoing")}</div>
          <strong>${formatNumber(row.outgoing)}</strong>
        </div>
      </div>
    `;
    root.append(card);
  }
}

function renderAgeSlider(population) {
  const slider = document.getElementById("age-year-slider");
  const rows = population.ageMigration;

  if (state.selectedAgeIndex >= rows.length) {
    state.selectedAgeIndex = rows.length - 1;
  }

  slider.min = "0";
  slider.max = String(rows.length - 1);
  slider.value = String(state.selectedAgeIndex);
  setText("#age-slider-label", t().age.year);
}

function renderSources() {
  setSource("migration-source", ["Zuzüge, Wegzüge"]);
  setSource("population-source", ["Hauptwohnsitzbevölkerung"]);
  setSource("vital-source", ["Geburten"]);
  setSource("age-source", ["Jugend- und Altenquote"]);
  setSource("age-migration-source", ["Zuzüge nach", "Wegzüge aus"]);
}

function renderPopulationView() {
  const population = state.data.population;
  const districts = districtSnapshot(population, state.selectedPopulationYear);

  renderKpis(population.summary);
  renderMigrationChart(population);
  renderPopulationYearSlider(population);
  renderMap("population-map", "population-inspector", districts);
  renderVitalChart(population);
  renderAgeQuoteSlider(population);
  renderAgeStructure(population);
  renderAgeSlider(population);
  renderAgeFlow(population);
  renderSources();
}

function renderAlerts(alerts) {
  document.getElementById("alerts-count").textContent = alerts.length;
  const list = document.getElementById("alerts-list");
  list.innerHTML = "";

  for (const alert of alerts) {
    const item = document.createElement("li");
    item.innerHTML = `<span></span><strong></strong><p></p>`;
    item.querySelector("span").textContent = alert.level[state.language] ?? alert.level.en;
    item.querySelector("strong").textContent = alert.title[state.language] ?? alert.title.en;
    item.querySelector("p").textContent = alert.detail[state.language] ?? alert.detail.en;
    list.append(item);
  }
}

function updateStaticText() {
  const copy = t();

  document.title = "MagdePulse";
  document.querySelector(".brand strong").textContent = "MagdePulse";
  document.querySelector(".brand em").textContent = copy.tagline;
  setText("#topic-kicker", state.topic === "population" ? copy.introKicker : copy.comingSoon);
  setText("#page-title", copy.introTitle);
  setText("#page-copy", state.topic === "population" ? copy.introCopy : copy.placeholders[state.topic]);
  setText("#placeholder-kicker", copy.comingSoon);
  setText("#placeholder-title", copy.placeholders[state.topic] ?? copy.placeholders.education);
  setText("#placeholder-copy", copy.readyCopy);
  setText("#alerts-button span", copy.alerts);
  setText(".panel-title span", copy.liveAlerts);
  setText("#close-alerts", copy.close);

  document.querySelectorAll(".topic-button").forEach((button) => {
    button.textContent = copy.topics[button.dataset.topic];
  });

  const sectionCopy = [
    ["migration-chart", "migrationKicker", "migrationTitle"],
    ["population-map", "populationKicker", "populationTitle"],
    ["vital-chart", "vitalKicker", "vitalTitle"],
    ["age-orbits", "ageKicker", "ageTitle"],
    ["age-flow-grid", "ageMigrationKicker", "ageMigrationTitle"]
  ];

  for (const [id, kicker, title] of sectionCopy) {
    const card = document.getElementById(id)?.closest(".chart-card");
    if (!card) continue;
    card.querySelector(".eyebrow").textContent = copy.charts[kicker];
    card.querySelector("h2").textContent = copy.charts[title];
  }
}

function renderTopic() {
  const isPopulation = state.topic === "population";
  document.getElementById("population-view").hidden = !isPopulation;
  document.getElementById("placeholder-view").hidden = isPopulation;
  updateStaticText();

  if (isPopulation && state.data) {
    renderPopulationView();
  }
}

function bindEvents() {
  document.querySelectorAll(".topic-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.topic = button.dataset.topic;
      document.querySelectorAll(".topic-button").forEach((item) => item.classList.toggle("is-active", item === button));
      renderTopic();
    });
  });

  document.querySelectorAll(".language-toggle button").forEach((button) => {
    button.addEventListener("click", () => {
      state.language = button.dataset.lang;
      document.documentElement.lang = state.language;
      document
        .querySelectorAll(".language-toggle button")
        .forEach((item) => item.classList.toggle("is-active", item === button));
      renderTopic();
      if (state.data) renderAlerts(state.data.alerts);
    });
  });

  document.getElementById("population-year-slider").addEventListener("input", (event) => {
    const years = populationYears(state.data.population);
    state.selectedPopulationYear = years[Number(event.target.value)];
    renderPopulationView();
  });

  document.getElementById("age-quote-year-slider").addEventListener("input", (event) => {
    state.selectedAgeQuoteIndex = Number(event.target.value);
    renderAgeQuoteSlider(state.data.population);
    renderAgeStructure(state.data.population);
  });

  document.getElementById("age-year-slider").addEventListener("input", (event) => {
    state.selectedAgeIndex = Number(event.target.value);
    renderAgeFlow(state.data.population);
  });

  const alertsPanel = document.getElementById("alerts-panel");
  const alertsButton = document.getElementById("alerts-button");
  alertsButton.addEventListener("click", () => {
    const isOpen = !alertsPanel.hidden;
    alertsPanel.hidden = isOpen;
    alertsButton.setAttribute("aria-expanded", String(!isOpen));
  });
  document.getElementById("close-alerts").addEventListener("click", () => {
    alertsPanel.hidden = true;
    alertsButton.setAttribute("aria-expanded", "false");
  });
}

async function loadDashboard() {
  const response = await fetch("/api/dashboard");

  if (!response.ok) {
    throw new Error("Dashboard data could not be loaded.");
  }

  state.data = await response.json();
  [state.boundary, state.districtCoordinates] = await Promise.all([loadBoundary(), loadDistrictCoordinates()]);
  state.selectedPopulationYear = populationYears(state.data.population).at(-1);
  state.selectedAgeQuoteIndex = state.data.population.ageQuote.length - 1;
  state.selectedAgeIndex = state.data.population.ageMigration.length - 1;
  renderAlerts(state.data.alerts);
  renderTopic();
}

bindEvents();
loadDashboard().catch((error) => {
  setText("#topic-kicker", "Error");
  setText("#page-title", "Dashboard unavailable");
  setText("#page-copy", error.message);
});
