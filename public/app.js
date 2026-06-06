const state = {
  data: null,
  language: "en",
  topic: "population",
  selectedPopulationYear: null,
  selectedStatusIndex: 0,
  selectedAgeQuoteIndex: 0,
  selectedAgeIndex: 0,
  selectedHealthYear: null,
  selectedHealthRank: 0,
  healthRankedDistricts: [],
  charts: {},
  maps: {},
  boundary: null,
  districtCoordinates: new Map(),
  districtCells: new Map()
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
    introKicker: "Population indicators",
    introTitle: "MagdePulse",
    introCopy:
      "Review official indicators for population, migration, district distribution, vital statistics, and age structure in Magdeburg.",
    educationKicker: "Educational landscape",
    educationCopy:
      "Review Magdeburg's schools and universities, including enrolment, school types, capacity, and district distribution.",
    infrastructureKicker: "Infrastructure indicators",
    infrastructureIntro:
      "Review housing stock, residential buildings, completions, and vacancy indicators for Magdeburg's built environment.",
    healthIntro: "Explore district-level medical service availability for doctors, dentists and pharmacies.",
    placeholders: {
      infrastructure: "Infrastructure indicators will appear when validated datasets are added.",
      health: "Health and social service indicators will appear when validated datasets are added."
    },
    health: {
      service: "Service",
      services: { doctors: "Doctors", dentists: "Dentists", pharmacies: "Pharmacies" }
    },
    comingSoon: "In preparation",
    readyCopy: "This dashboard section is prepared for validated datasets.",
    kpis: {
      population: "Resident population",
      populationHint: "Latest annual city total",
      growth: "Change since baseline",
      growthHint: "Difference from the first available year",
      migration: "Net migration",
      migrationHint: "Arrivals minus departures, annual age-group totals",
      age: "Age indicators",
      ageHint: "Youth quota / elderly quota",
      infrastructureStock: "Housing stock",
      infrastructureStockHint: "Latest annual dwelling total",
      infrastructureBuildings: "Residential buildings",
      infrastructureBuildingsHint: "Latest annual building total",
      infrastructureFloorArea: "Residential floor area",
      infrastructureFloorAreaHint: "Latest recorded floor area",
      infrastructureVacancy: "Vacancy rate",
      infrastructureVacancyHint: "Latest annual citywide vacancy share"
    },
    charts: {
      statusKicker: "Population status",
      statusTitle: "Resident population and international residents",
      migrationKicker: "Migration",
      migrationTitle: "Arrivals, departures and net migration",
      populationKicker: "District population",
      populationTitle: "Resident population by statistical district",
      vitalKicker: "Vital statistics",
      vitalTitle: "Births, deaths and births-minus-deaths",
      ageKicker: "Age structure",
      ageTitle: "Youth and elderly quotas",
      ageMigrationKicker: "Migration by age group",
      ageMigrationTitle: "Arrivals and departures by age group",
      infrastructureStockKicker: "Housing stock",
      infrastructureStockTitle: "Housing stock and residential buildings over time",
      infrastructureCompletionsKicker: "New completions",
      infrastructureCompletionsTitle: "Completed apartments in new buildings by year",
      infrastructureVacancyKicker: "Vacancy rate",
      infrastructureVacancyTitle: "Citywide vacancy rate over time",
      healthKicker: "Health services",
      healthTitle: "Doctors, dentists and pharmacies by district",
      eduTypeKicker: "Educational landscape",
      eduTypeTitle: "Students by school type",
      eduCapacityKicker: "School capacity",
      eduCapacityTitle: "Classrooms vs. student population",
      eduMapKicker: "District distribution",
      eduMapTitle: "Schools and students by district",
      eduTrendKicker: "Student trend",
      eduTrendTitle: "City-wide school students over time",
      eduUniTrendKicker: "University freshmen",
      eduUniTrendTitle: "1st-semester enrolments over time",
      eduUniInstitutionKicker: "Institutions",
      eduUniInstitutionTitle: "Freshmen by institution and gender",
      eduProgramKicker: "Degree programmes",
      eduProgramTitle: "Students by study form and institution",
      eduProgramStudents: "Enrolled students",
      eduProgramStudentsHint: "Latest winter semester"
    },
    series: {
      arrivals: "Arrivals",
      departures: "Departures",
      net: "Net migration",
      births: "Births",
      deaths: "Deaths",
      birthDeathGap: "Births minus deaths",
      youth: "Youth quota",
      elderly: "Elderly quota",
      male: "Male",
      female: "Female",
      incoming: "Arrivals",
      outgoing: "Departures",
      housingStock: "Housing stock",
      residentialBuildings: "Residential buildings",
      completions: "Completed apartments",
      vacancyRate: "Vacancy rate"
    },
    map: {
      residents: "Resident population",
      genderSplit: "Gender distribution",
      hover: "Select a district",
      hoverCopy: "Hover over a district area to view the selected year's resident population.",
      rank: "Rank",
      topDistricts: "District overview"
    },
    age: {
      year: "Year",
      years: "years",
      net: "Net migration",
      youth: "Youth quota",
      elderly: "Elderly quota"
    },
    status: {
      residents: "Resident population",
      internationals: "International residents",
      ofResidents: "share of resident population",
      sinceBaseline: "since 2001"
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
    introKicker: "Bevölkerungsindikatoren",
    introTitle: "MagdePulse",
    introCopy:
      "Analyse amtlicher Kennzahlen zu Bevölkerung, Wanderung, Bezirksverteilung, Bevölkerungsbewegung und Altersstruktur in Magdeburg.",
    educationKicker: "Bildungslandschaft",
    educationCopy:
      "Schulen und Hochschulen in Magdeburg: Schülerzahlen, Schularten, Kapazitäten und Bezirksverteilung.",
    infrastructureKicker: "Infrastrukturindikatoren",
    infrastructureIntro:
      "Analyse von Wohnungsbestand, Wohngebäuden, Fertigstellungen und Leerstand in Magdeburg.",
    healthIntro: "Zeige die Verteilung von Ärzten, Zahnärzten und Apotheken nach Stadtteil.",
    placeholders: {
      infrastructure: "Infrastrukturindikatoren erscheinen, sobald geprüfte Datensätze ergänzt wurden.",
      health: "Indikatoren zu Gesundheit und Sozialem erscheinen, sobald geprüfte Datensätze ergänzt wurden."
    },
    health: {
      service: "Dienstleistung",
      services: { doctors: "Ärzte", dentists: "Zahnärzte", pharmacies: "Apotheken" }
    },
    comingSoon: "In Vorbereitung",
    readyCopy: "Dieser Dashboard-Bereich ist für geprüfte Datensätze vorbereitet.",
    kpis: {
      population: "Bevölkerung mit Hauptwohnsitz",
      populationHint: "Neuester jährlicher Stadtwert",
      growth: "Veränderung seit Basisjahr",
      growthHint: "Differenz zum ersten verfügbaren Jahr",
      migration: "Wanderungssaldo",
      migrationHint: "Zuzüge minus Wegzüge, jährliche Altersgruppensummen",
      age: "Altersindikatoren",
      ageHint: "Jugendquote / Altenquote",
      infrastructureStock: "Wohnungsbestand",
      infrastructureStockHint: "Neuester jährlicher Wohnungsbestand",
      infrastructureBuildings: "Wohngebäude",
      infrastructureBuildingsHint: "Neuester jährlicher Gebäudebestand",
      infrastructureFloorArea: "Wohnfläche",
      infrastructureFloorAreaHint: "Neueste erfasste Wohnfläche",
      infrastructureVacancy: "Leerstandsquote",
      infrastructureVacancyHint: "Neuester stadtweiter jährlicher Anteil"
    },
    charts: {
      statusKicker: "Bevölkerungsstand",
      statusTitle: "Bevölkerung mit Hauptwohnsitz und ausländische Bevölkerung",
      migrationKicker: "Wanderung",
      migrationTitle: "Jährliche Zuzüge, Wegzüge und Wanderungssaldo",
      populationKicker: "Bezirksbevölkerung",
      populationTitle: "Bevölkerung mit Hauptwohnsitz nach statistischem Bezirk",
      vitalKicker: "Bevölkerungsbewegung",
      vitalTitle: "Geburten, Sterbefälle und Differenz",
      ageKicker: "Altersstruktur",
      ageTitle: "Jugend- und Altenquote",
      ageMigrationKicker: "Wanderung nach Altersgruppen",
      ageMigrationTitle: "Zuzüge und Wegzüge nach Altersgruppe",
      infrastructureStockKicker: "Wohnungsbestand",
      infrastructureStockTitle: "Wohnungsbestand und Wohngebäude im Zeitverlauf",
      infrastructureCompletionsKicker: "Fertigstellungen",
      infrastructureCompletionsTitle: "Fertiggestellte Wohnungen im Neubau je Jahr",
      infrastructureVacancyKicker: "Leerstandsquote",
      infrastructureVacancyTitle: "Stadtweite Leerstandsquote im Zeitverlauf",
      healthKicker: "Gesundheitsdienste",
      healthTitle: "Ärzte, Zahnärzte und Apotheken nach Bezirk",
      eduTypeKicker: "Bildungslandschaft",
      eduTypeTitle: "Schüler nach Schulart",
      eduCapacityKicker: "Schulkapazität",
      eduCapacityTitle: "Klassen vs. Schülerzahl",
      eduMapKicker: "Bezirksverteilung",
      eduMapTitle: "Schulen und Schüler nach Stadtteil",
      eduTrendKicker: "Schülerzahl-Entwicklung",
      eduTrendTitle: "Schüler stadtweit über die Zeit",
      eduUniTrendKicker: "Erstsemester",
      eduUniTrendTitle: "Studierende im 1. Fachsemester über die Zeit",
      eduUniInstitutionKicker: "Hochschulen",
      eduUniInstitutionTitle: "Erstsemester nach Hochschule und Geschlecht",
      eduProgramKicker: "Studiengänge",
      eduProgramTitle: "Studierende nach Studienform und Hochschule",
      eduProgramStudents: "Studierende gesamt",
      eduProgramStudentsHint: "Aktuelles Wintersemester"
    },
    series: {
      arrivals: "Zuzüge",
      departures: "Wegzüge",
      net: "Wanderungssaldo",
      births: "Geburten",
      deaths: "Sterbefälle",
      birthDeathGap: "Geburten minus Sterbefälle",
      youth: "Jugendquote",
      elderly: "Altenquote",
      male: "Männlich",
      female: "Weiblich",
      incoming: "Zuzüge",
      outgoing: "Wegzüge",
      housingStock: "Wohnungsbestand",
      residentialBuildings: "Wohngebäude",
      completions: "Fertiggestellte Wohnungen",
      vacancyRate: "Leerstandsquote"
    },
    map: {
      residents: "Bevölkerung mit Hauptwohnsitz",
      genderSplit: "Geschlechterverteilung",
      hover: "Bezirk auswählen",
      hoverCopy: "Bewege die Maus über einen Bezirk, um die Bevölkerung im ausgewählten Jahr zu sehen.",
      rank: "Rang",
      topDistricts: "Bezirksübersicht"
    },
    age: {
      year: "Jahr",
      years: "Jahre",
      net: "Wanderungssaldo",
      youth: "Jugendquote",
      elderly: "Altenquote"
    },
    status: {
      residents: "Bevölkerung mit Hauptwohnsitz",
      internationals: "Ausländische Bevölkerung",
      ofResidents: "Anteil an der Bevölkerung",
      sinceBaseline: "seit 2001"
    },
    alerts: "Meldungen",
    close: "Schließen",
    liveAlerts: "Live-Meldungen",
    sources: "Quelle"
  }
};

const ageLabelTranslations = {
  en: { "Under 18": "Under 18", "18-25": "18-25", "25-30": "25-30", "30-50": "30-50", "50-65": "50-65", "65+": "65+" },
  de: { "Under 18": "Unter 18", "18-25": "18-25", "25-30": "25-30", "30-50": "30-50", "50-65": "50-65", "65+": "65+" }
};

const mapBoundarySource = "Map boundary: OpenStreetMap/Nominatim relation 62481";
const coordinateSource = "District regions: clipped from Nominatim/OpenStreetMap anchor points because official district polygons are not included in the workbook";

const formatNumber = (value) => new Intl.NumberFormat(state.language === "de" ? "de-DE" : "en-US").format(value);
const css = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const t = () => translations[state.language];

function setText(selector, text) {
  const el = document.querySelector(selector);
  if (el) el.textContent = text;
}

function formatSigned(value) {
  return `${value >= 0 ? "+" : ""}${formatNumber(value)}`;
}

function mixColor(from, to, amount) {
  const parse = (hex) => hex.replace("#", "").match(/.{1,2}/g).map((p) => parseInt(p, 16));
  const [fr, fg, fb] = parse(from);
  const [tr, tg, tb] = parse(to);
  const mix = (a, b) => Math.round(a + (b - a) * amount).toString(16).padStart(2, "0");
  return `#${mix(fr, tr)}${mix(fg, tg)}${mix(fb, tb)}`;
}

function chartOptions({ percent = false } = {}) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    resizeDelay: 80,
    animation: {
      duration: 900,
      easing: "easeOutQuart"
    },
    interaction: {
      mode: "index",
      intersect: false
    },
    layout: {
      padding: {
        top: 14,
        right: 18,
        bottom: 10,
        left: 8
      }
    },
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 12,
          boxHeight: 12,
          padding: 18,
          usePointStyle: true,
          color: css("--ink"),
          font: { size: 13, weight: 750 }
        }
      },
      tooltip: {
        backgroundColor: "rgba(84, 45, 36, 0.94)",
        padding: 12,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatNumber(ctx.parsed.y)}${percent ? "%" : ""}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: css("--muted"),
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
          padding: 10,
          font: { size: 12, weight: 650 }
        }
      },
      y: {
        grid: { color: "#eeeeee" },
        border: { display: false },
        ticks: {
          color: css("--muted"),
          padding: 12,
          font: { size: 12, weight: 650 },
          callback: (value) => `${formatNumber(value)}${percent ? "%" : ""}`
        }
      }
    }
  };
}

function destroyChart(id) { state.charts[id]?.destroy(); }

function createChart(id, config) {
  destroyChart(id);
  const el = document.getElementById(id);
  if (!el) return;
  state.charts[id] = new Chart(el, config);
  requestAnimationFrame(() => state.charts[id]?.resize());
}

function sourceText(needles) {
  const sources = state.data.population.sources.filter((s) =>
    needles.some((n) => s.dataset.includes(n))
  );
  return sources.map((s) => `${s.dataset} · ${s.source} · ${s.url}`).join(" | ");
}

function setSource(id, needles) {
  const suffix =
    id.includes("source") && (id.includes("population") || id.includes("district"))
      ? ` | ${mapBoundarySource} | ${coordinateSource}`
      : "";
  setText(`#${id}`, `${t().sources}: ${sourceText(needles)}${suffix}`);
}

function annualComplete(rows) { return rows.filter((r) => r.months >= 12); }

async function loadDistrictCoordinates() {
  const response = await fetch("/data/district-coordinates.json");
  if (!response.ok) throw new Error("District coordinate cache could not be loaded.");
  const cache = await response.json();
  return new Map(cache.coordinates.map((item) => [item.name, item]));
}

function normalizeLabel(v) {
  return String(v || "").toLowerCase().trim().replace(/\s+/g, " ");
}

function findDistrictCoordinate(name) {
  if (!name) return null;
  const exact = state.districtCoordinates.get(name);
  if (exact) return exact;

  const norm = normalizeLabel(name);
  const candidates = [...state.districtCoordinates.values()]
    .map((item) => {
      const nv = normalizeLabel(item.name);
      const dv = normalizeLabel(item.displayName);
      const vv = normalizeLabel(item.matchedVariant || "");
      let score = 0;
      if (nv === norm) score += 200;
      if (dv === norm) score += 150;
      if (vv === norm) score += 120;
      if (dv.includes(norm)) score += 60;
      if (vv.includes(norm)) score += 40;
      if (nv.includes(norm)) score += 30;
      if (item.type === "administrative") score += 15;
      if (item.importance) score += Math.round(item.importance * 20);
      return { item, score };
    })
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score);

  return candidates[0]?.item ?? null;
}

// ---------------------------------------------------------------------------
// Health helpers
// ---------------------------------------------------------------------------

function syncHealthRankControls(rank) {
  const pos = document.getElementById("health-rank-position");
  const prev = document.getElementById("health-rank-prev");
  const next = document.getElementById("health-rank-next");
  const total = state.healthRankedDistricts.length;
  if (!pos || !prev || !next) return;
  pos.textContent = total ? `${t().map.rank} ${rank} / ${total}` : "";
  prev.disabled = rank <= 1;
  next.disabled = rank >= total;
}

function selectHealthRank(districts, rankIndex) {
  const index = Math.max(0, Math.min(rankIndex, districts.length - 1));
  const district = districts[index];
  if (!district) return;
  state.selectedHealthRank = index;
  updateHealthInspector(document.getElementById("health-inspector"), district, index + 1);
  syncHealthRankControls(index + 1);
}

function populationYears(population) {
  return population.population.cityPopulation.map((r) => r.year);
}

function districtSnapshot(population, year) {
  return population.population.districtPopulation
    .map((district) => {
      const snap = district.trend.find((r) => r.year === Number(year));
      if (!snap || snap.total <= 0) return null;
      return { ...district, male: snap.male, female: snap.female, total: snap.total, year: snap.year };
    })
    .filter(Boolean);
}

function healthYears(health) { return health.years; }

function renderHealthYearSlider(health) {
  const years = healthYears(health);
  const slider = document.getElementById("health-year-slider");
  if (!state.selectedHealthYear || !years.includes(Number(state.selectedHealthYear))) {
    state.selectedHealthYear = years.at(-1);
  }
  slider.min = "0";
  slider.max = String(years.length - 1);
  slider.value = String(years.indexOf(Number(state.selectedHealthYear)));
  setText("#health-slider-label", t().age.year);
}

function healthDistrictSnapshot(health, year) {
  const districts = health.districtsByYear?.[String(year)] ?? [];
  return districts.map((d) => ({ ...d, year, total: d.total }));
}

function updateHealthInspector(inspector, district, rank) {
  inspector.innerHTML = `
    <p class="eyebrow">${rank ? `${t().map.rank} ${rank}` : t().map.hover}</p>
    <h3>${district.name}</h3>
    <strong>${formatNumber(district.total)}</strong>
    <span>${t().age.year}: ${district.year}</span>
    <div class="health-counts">
      <span>${t().health.services.doctors}: ${formatNumber(district.doctors)}</span>
      <span>${t().health.services.dentists}: ${formatNumber(district.dentists)}</span>
      <span>${t().health.services.pharmacies}: ${formatNumber(district.pharmacies)}</span>
    </div>
  `;
  if (rank) { syncHealthRankControls(rank); state.selectedHealthRank = rank - 1; }
}

// ---------------------------------------------------------------------------
// Population KPIs
// ---------------------------------------------------------------------------

function renderKpis(summary) {
  const labels = t().kpis;
  const items = [
    { label: labels.population, value: formatNumber(summary.population), hint: `${labels.populationHint} (${summary.populationYear})` },
    { label: labels.growth, value: formatSigned(summary.populationGrowth), hint: labels.growthHint },
    { label: labels.migration, value: formatSigned(summary.migrationNet), hint: `${labels.migrationHint} (${summary.migrationYear})` },
    { label: labels.age, value: `${summary.youthQuote}% / ${summary.elderlyQuote}%`, hint: `${labels.ageHint} (${summary.ageQuoteYear})` }
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

// ---------------------------------------------------------------------------
// Infrastructure view
// ---------------------------------------------------------------------------

function renderInfrastructureKpis(summary) {
  const labels = t().kpis;
  const items = [
    { label: labels.infrastructureStock, value: formatNumber(summary.housingStock), hint: `${labels.infrastructureStockHint} (${summary.housingStockYear})` },
    { label: labels.infrastructureBuildings, value: formatNumber(summary.buildings), hint: `${labels.infrastructureBuildingsHint} (${summary.buildingsYear})` },
    { label: labels.infrastructureFloorArea, value: `${formatNumber(summary.floorArea)} m2`, hint: `${labels.infrastructureFloorAreaHint} (${summary.floorAreaYear})` },
    { label: labels.infrastructureVacancy, value: `${formatNumber(summary.vacancyRate)}%`, hint: `${labels.infrastructureVacancyHint} (${summary.vacancyYear})` }
  ];

  const grid = document.getElementById("infra-kpi-grid");
  if (!grid) return;
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

function valuesByYear(rows, key) {
  return new Map(rows.map((row) => [row.year, row[key] ?? 0]));
}

function renderInfrastructureStockChart(infrastructure) {
  const labels = t().series;
  const stockByYear = valuesByYear(infrastructure.housingStock, "total");
  const buildingByYear = valuesByYear(infrastructure.buildings, "buildings");
  const years = [...new Set([...stockByYear.keys(), ...buildingByYear.keys()])].sort((a, b) => a - b);
  const options = chartOptions();

  createChart("infra-stock-chart", {
    type: "line",
    data: {
      labels: years.map(String),
      datasets: [
        { label: labels.housingStock, data: years.map((year) => stockByYear.get(year) ?? null), yAxisID: "y", borderColor: css("--brand-orange"), backgroundColor: "rgba(196,77,54,0.11)", borderWidth: 3, tension: 0.32, fill: true },
        { label: labels.residentialBuildings, data: years.map((year) => buildingByYear.get(year) ?? null), yAxisID: "y1", borderColor: css("--signal-green"), backgroundColor: css("--signal-green"), borderWidth: 3, tension: 0.28 }
      ]
    },
    options: {
      ...options,
      scales: {
        ...options.scales,
        y: {
          ...options.scales.y,
          title: { display: true, text: labels.housingStock, color: css("--muted"), font: { size: 12, weight: 700 } }
        },
        y1: {
          position: "right",
          grid: { drawOnChartArea: false },
          border: { display: false },
          ticks: {
            color: css("--muted"),
            padding: 12,
            font: { size: 12, weight: 650 },
            callback: (value) => formatNumber(value)
          },
          title: { display: true, text: labels.residentialBuildings, color: css("--muted"), font: { size: 12, weight: 700 } }
        }
      }
    }
  });
}

function renderInfrastructureCompletionsChart(infrastructure) {
  createChart("infra-completions-chart", {
    type: "bar",
    data: {
      labels: infrastructure.completed.map((row) => String(row.year)),
      datasets: [
        { label: t().series.completions, data: infrastructure.completed.map((row) => row.completed), backgroundColor: "rgba(196,77,54,0.32)", borderColor: css("--brand-orange"), borderWidth: 1 }
      ]
    },
    options: chartOptions()
  });
}

function renderInfrastructureVacancyChart(infrastructure) {
  createChart("infra-vacancy-chart", {
    type: "line",
    data: {
      labels: infrastructure.vacancy.map((row) => String(row.year)),
      datasets: [
        { label: t().series.vacancyRate, data: infrastructure.vacancy.map((row) => row.rate), borderColor: css("--brand-brown"), backgroundColor: "rgba(84,45,36,0.08)", borderWidth: 3, tension: 0.3, fill: true }
      ]
    },
    options: chartOptions({ percent: true })
  });
}

function renderInfrastructureSources() {
  const prefix = `${t().sources}: `;
  const sources = state.data.infrastructure?.sources ?? [];
  const pick = (needles) => sources.filter((s) => needles.some((needle) => s.dataset?.includes(needle)));
  const fmt = (items) => items.map((src) => `${src.dataset} - ${src.source} - ${src.url}`).join(" | ");
  const fallback = "KISS-MD - https://statistik.magdeburg.de/KISS-MD/";
  const sourceSets = [
    ["infra-stock-source", ["Wohnungsbestand", "Wohnraum"]],
    ["infra-completions-source", ["Fertiggestellte Wohnungen"]],
    ["infra-vacancy-source", ["Leerstand"]]
  ];

  for (const [id, needles] of sourceSets) {
    const items = pick(needles);
    const el = document.getElementById(id);
    if (el) el.textContent = prefix + (items.length ? fmt(items) : fallback);
  }
}

function renderInfrastructureView() {
  const infrastructure = state.data.infrastructure;
  if (!infrastructure) return;
  renderInfrastructureKpis(infrastructure.summary);
  renderInfrastructureStockChart(infrastructure);
  renderInfrastructureCompletionsChart(infrastructure);
  renderInfrastructureVacancyChart(infrastructure);
  renderInfrastructureSources();
}

// ---------------------------------------------------------------------------
// Population charts
// ---------------------------------------------------------------------------

function renderMigrationChart(population) {
  const labels = t().series;
  const source = annualComplete(population.migration.annual);
  createChart("migration-chart", {
    type: "line",
    data: {
      labels: source.map((r) => String(r.year)),
      datasets: [
        { label: labels.arrivals, data: source.map((r) => r.arrivals), borderColor: css("--brand-orange"), backgroundColor: "rgba(196,77,54,0.11)", borderWidth: 3, tension: 0.34, fill: true },
        { label: labels.departures, data: source.map((r) => r.departures), borderColor: css("--brand-brown"), backgroundColor: "rgba(84,45,36,0.08)", borderWidth: 3, tension: 0.34 },
        { label: labels.net, data: source.map((r) => r.net), borderColor: css("--signal-green"), backgroundColor: css("--signal-green"), borderWidth: 2, tension: 0.22, borderDash: [6, 5] }
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
      labels: source.map((r) => String(r.year)),
      datasets: [
        { type: "line", label: labels.births, data: source.map((r) => r.births), borderColor: css("--signal-green"), backgroundColor: css("--signal-green"), borderWidth: 3, tension: 0.28 },
        { type: "line", label: labels.deaths, data: source.map((r) => r.deaths), borderColor: css("--brand-brown"), backgroundColor: css("--brand-brown"), borderWidth: 3, tension: 0.28 },
        { label: labels.birthDeathGap, data: source.map((r) => r.birthDeathGap), backgroundColor: "rgba(196,77,54,0.34)", borderColor: css("--brand-orange"), borderWidth: 1 }
      ]
    },
    options: chartOptions()
  });
}

function statusRows(population) {
  return population.populationStatus ?? [];
}

function renderStatusSlider(population) {
  const slider = document.getElementById("status-year-slider");
  const rows = statusRows(population);

  if (state.selectedStatusIndex >= rows.length) {
    state.selectedStatusIndex = rows.length - 1;
  }

  slider.min = "0";
  slider.max = String(rows.length - 1);
  slider.value = String(state.selectedStatusIndex);
  setText("#status-slider-label", t().age.year);
}

function renderStatusOrbit(root, item) {
  let orbit = root.querySelector(`[data-status-orbit="${item.className}"]`);

  if (!orbit) {
    orbit = document.createElement("article");
    orbit.className = `status-orbit ${item.className}`;
    orbit.dataset.statusOrbit = item.className;
    orbit.innerHTML = `
      <div class="status-ring">
        <strong></strong>
      </div>
      <div>
        <span></span>
        <p></p>
      </div>
    `;
    root.append(orbit);
  }

  const ring = orbit.querySelector(".status-ring");
  ring.style.setProperty("--angle", `${Math.min(item.share / 100, 1) * 360}deg`);
  ring.querySelector("strong").textContent = item.value;
  orbit.querySelector("span").textContent = item.label;
  orbit.querySelector("p").textContent = item.detail;
}

function renderPopulationStatus(population) {
  const copy = t().status;
  const rows = statusRows(population);
  const selected = rows[state.selectedStatusIndex] ?? rows.at(-1);
  const first = rows[0] ?? selected;
  const totals = rows.map((row) => row.totalPopulation);
  const minTotal = Math.min(...totals);
  const maxTotal = Math.max(...totals);
  const root = document.getElementById("status-orbits");
  const totalProgress = maxTotal > minTotal
    ? ((selected.totalPopulation - minTotal) / (maxTotal - minTotal)) * 100
    : 100;
  const residentChange = selected.totalPopulation - first.totalPopulation;
  const residentChangeShare = first.totalPopulation ? ((residentChange / first.totalPopulation) * 100).toFixed(1) : "0.0";

  document.getElementById("status-year-label").textContent = selected.year;
  renderStatusOrbit(root, {
    className: "residents",
    label: copy.residents,
    value: formatNumber(selected.totalPopulation),
    detail: `${formatSigned(residentChange)} / ${residentChangeShare}% ${copy.sinceBaseline}`,
    share: totalProgress
  });
  renderStatusOrbit(root, {
    className: "internationals",
    label: copy.internationals,
    value: formatNumber(selected.internationalPopulation),
    detail: `${selected.internationalShare}% ${copy.ofResidents}`,
    share: selected.internationalShare
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
  const detail = inspector.querySelector(".map-inspector-detail") ?? inspector;
  const maleShare = district.total ? Math.round((district.male / district.total) * 100) : 0;
  const femaleShare = district.total ? 100 - maleShare : 0;

  detail.innerHTML = `
    <p class="eyebrow">${rank ? `${copy.map.rank} ${rank}` : copy.map.hover}</p>
    <h3>${district.name}</h3>
    <strong>${formatNumber(district.total)}</strong>
    <span>${copy.map.residents} · ${district.year}</span>
    <div class="gender-meter" aria-label="${copy.map.genderSplit}">
      <span style="--value: ${maleShare}%"></span><span style="--value: ${femaleShare}%"></span>
    </div>
    <div class="gender-split">
      <span>${copy.series.male}: ${formatNumber(district.male)} (${maleShare}%)</span>
      <span>${copy.series.female}: ${formatNumber(district.female)} (${femaleShare}%)</span>
    </div>
  `;
}

function normalizeBoundaryFeature(rawBoundary) {
  const result = rawBoundary.find((item) => item.geojson?.type);
  if (!result) throw new Error("Magdeburg boundary geometry is missing.");
  return {
    type: "Feature",
    properties: { name: result.display_name, osmId: result.osm_id },
    geometry: result.geojson
  };
}

async function loadBoundary() {
  const response = await fetch("/data/magdeburg-nominatim.json");
  if (!response.ok) throw new Error("Magdeburg map boundary could not be loaded.");
  return normalizeBoundaryFeature(await response.json());
}

function boundaryPolygons(feature) {
  return feature.geometry.type === "Polygon"
    ? [feature.geometry.coordinates]
    : feature.geometry.coordinates;
}

function projectionScale(feature) {
  const coordinates = boundaryPolygons(feature).flatMap((polygon) => polygon[0]);
  const averageLat = coordinates.reduce((sum, coordinate) => sum + coordinate[1], 0) / coordinates.length;
  return Math.cos((averageLat * Math.PI) / 180);
}

function projectLonLat(lon, lat, scale) {
  return { x: lon * scale, y: lat };
}

function unprojectPoint(point, scale) {
  return [point.y, point.x / scale];
}

function openRing(ring) {
  const first = ring[0];
  const last = ring.at(-1);

  if (first && last && first[0] === last[0] && first[1] === last[1]) {
    return ring.slice(0, -1);
  }

  return ring;
}

function simplifyRing(ring, targetVertices = 260) {
  const open = openRing(ring);

  if (open.length <= targetVertices) {
    return open;
  }

  const step = Math.ceil(open.length / targetVertices);
  return open.filter((_, index) => index % step === 0);
}

function polygonArea(points) {
  let area = 0;

  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    area += current.x * next.y - next.x * current.y;
  }

  return area / 2;
}

function pointInRing(point, ring) {
  let inside = false;

  for (let index = 0, previous = ring.length - 1; index < ring.length; previous = index, index += 1) {
    const current = ring[index];
    const before = ring[previous];
    const crosses = current.y > point.y !== before.y > point.y;

    if (crosses && point.x < ((before.x - current.x) * (point.y - current.y)) / (before.y - current.y) + current.x) {
      inside = !inside;
    }
  }

  return inside;
}

function bisectorValue(point, anchor, other) {
  const left = 2 * ((other.x - anchor.x) * point.x + (other.y - anchor.y) * point.y);
  const right = other.x ** 2 + other.y ** 2 - anchor.x ** 2 - anchor.y ** 2;
  return left - right;
}

function bisectorIntersection(start, end, anchor, other) {
  const startValue = bisectorValue(start, anchor, other);
  const endValue = bisectorValue(end, anchor, other);
  const denominator = startValue - endValue;

  if (Math.abs(denominator) < 1e-12) {
    return end;
  }

  const amount = startValue / denominator;
  return {
    x: start.x + (end.x - start.x) * amount,
    y: start.y + (end.y - start.y) * amount
  };
}

function clipToCloserSide(cell, anchor, other) {
  const clipped = [];

  for (let index = 0; index < cell.length; index += 1) {
    const current = cell[index];
    const previous = cell[(index + cell.length - 1) % cell.length];
    const currentInside = bisectorValue(current, anchor, other) <= 1e-12;
    const previousInside = bisectorValue(previous, anchor, other) <= 1e-12;

    if (currentInside !== previousInside) {
      clipped.push(bisectorIntersection(previous, current, anchor, other));
    }

    if (currentInside) {
      clipped.push(current);
    }
  }

  return clipped;
}

function buildDistrictCells(districts) {
  if (state.districtCells.size) {
    return state.districtCells;
  }

  const scale = projectionScale(state.boundary);
  const boundaryRings = boundaryPolygons(state.boundary)
    .map((polygon) => simplifyRing(polygon[0]).map(([lon, lat]) => projectLonLat(lon, lat, scale)))
    .filter((ring) => ring.length >= 3)
    .map((ring) => ({
      ring,
      area: Math.abs(polygonArea(ring))
    }));
  const largestRing = boundaryRings.reduce((largest, ring) => (ring.area > largest.area ? ring : largest), boundaryRings[0]);
  const anchors = districts
    .map((district) => {
      const coordinate = state.districtCoordinates.get(district.name);

      if (!coordinate) {
        return null;
      }

      return {
        district,
        point: projectLonLat(coordinate.lon, coordinate.lat, scale)
      };
    })
    .filter(Boolean);
  const cells = new Map();

  for (const anchor of anchors) {
    const baseRing = boundaryRings.find((ring) => pointInRing(anchor.point, ring.ring)) ?? largestRing;
    let cell = baseRing.ring.map((point) => ({ ...point }));

    for (const other of anchors) {
      if (other === anchor) {
        continue;
      }

      cell = clipToCloserSide(cell, anchor.point, other.point);

      if (cell.length < 3) {
        break;
      }
    }

    if (cell.length >= 3) {
      cells.set(anchor.district.name, cell.map((point) => unprojectPoint(point, scale)));
    }
  }

  state.districtCells = cells;
  return cells;
}

function resetLeafletMap(containerId) {
  state.maps[containerId]?.remove();
  const map = L.map(containerId, { zoomControl: false, attributionControl: false, scrollWheelZoom: false, keyboard: true });
  L.control.zoom({ position: "bottomright" }).addTo(map);
  L.control.attribution({ position: "bottomleft", prefix: false })
    .addAttribution("&copy; OpenStreetMap contributors")
    .addTo(map);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19 }).addTo(map);
  state.maps[containerId] = map;
  return map;
}

function addBoundaryMask(map, feature) {
  const world = [[85, -180], [85, 180], [-85, 180], [-85, -180]];
  const holes = boundaryPolygons(feature).map((poly) => poly[0].map(([lon, lat]) => [lat, lon]));
  L.polygon([world, ...holes], { stroke: false, fillColor: "#ffffff", fillOpacity: 0.82, interactive: false }).addTo(map);

  const boundaryLayer = L.geoJSON(feature, {
    style: {
      color: css("--brand-orange"),
      weight: 3,
      opacity: 0.94,
      fillColor: css("--brand-orange"),
      fillOpacity: 0.06
    }
  }).addTo(map);

  return boundaryLayer;
}

function renderMap(containerId, inspectorId, districts, { ranked = false, onInspect: cb = null, initialIndex = 0 } = {}) {
  const inspector = document.getElementById(inspectorId);
  const max = Math.max(1, ...districts.map((d) => d.total));
  const rankedDistricts = [...districts].sort((a, b) => b.total - a.total);
  const rankByName = new Map(rankedDistricts.map((d, i) => [d.name, i + 1]));
  const topNames = new Set(rankedDistricts.slice(0, 12).map((d) => d.name));
  const map = resetLeafletMap(containerId);
  const boundaryLayer = addBoundaryMask(map, state.boundary);
  const bounds = boundaryLayer.getBounds();
  const cells = buildDistrictCells(districts);

  const detail = inspector.querySelector(".map-inspector-detail") ?? inspector;
  detail.innerHTML = `
    <p class="eyebrow">${t().map.hover}</p>
    <h3>${t().map.topDistricts}</h3>
    <span>${t().map.hoverCopy}</span>
  `;

  districts.forEach((district) => {
    const cell = cells.get(district.name);

    if (!cell) return;

    const intensity = Math.max(0.12, Math.sqrt(district.total / max));
    const markerColor = ranked && topNames.has(district.name) ? css("--brand-brown") : css("--brand-orange");
    const baseOpacity = 0.3 + intensity * 0.38;
    const marker = L.polygon(cell, {
      fillColor: mixColor("#eeeeee", markerColor, intensity),
      fillOpacity: ranked && topNames.has(district.name) ? Math.max(baseOpacity, 0.68) : baseOpacity,
      stroke: false,
      className: "district-region"
    }).addTo(map);
    const rank = rankByName.get(district.name);
    const onInspect = () => {
      if (typeof cb === "function") cb(inspector, district, ranked ? rank : null);
      else updateInspector(inspector, district, ranked ? rank : null);
    };
    marker.bindTooltip(
      `${district.name}: ${formatNumber(district.total)}`,
      {
        direction: "top",
        sticky: true
      }
    );
    marker.on("mouseover", onInspect);
    marker.on("mouseover", () => {
      marker.setStyle({ fillColor: css("--brand-brown"), fillOpacity: 0.86 });
    });
    marker.on("mouseout", () => {
      marker.setStyle({
        fillColor: mixColor("#eeeeee", markerColor, intensity),
        fillOpacity: ranked && topNames.has(district.name) ? Math.max(baseOpacity, 0.68) : baseOpacity
      });
    });
    marker.on("click", onInspect);
  });

  boundaryLayer.bringToFront();
  map.fitBounds(bounds, { padding: [16, 16] });
  map.setMaxBounds(bounds.pad(0.08));
  setTimeout(() => map.invalidateSize(), 0);

  const safeIndex = Math.max(0, Math.min(initialIndex, rankedDistricts.length - 1));
  const initialDistrict = rankedDistricts[safeIndex];
  const initialRank = ranked ? safeIndex + 1 : null;
  if (initialDistrict) {
    if (typeof cb === "function") cb(inspector, initialDistrict, initialRank);
    else updateInspector(inspector, initialDistrict, initialRank);
  }
}

function renderAgeStructure(population) {
  const copy = t();
  const selected = population.ageQuote[state.selectedAgeQuoteIndex] ?? population.ageQuote.at(-1);
  const orbitRoot = document.getElementById("age-orbits");

  document.getElementById("age-year-label").textContent = selected.year;

  [
    { label: copy.age.youth, value: selected.youth, className: "youth" },
    { label: copy.age.elderly, value: selected.elderly, className: "elderly" }
  ].forEach((item) => {
    let orbit = orbitRoot.querySelector(`[data-age-orbit="${item.className}"]`);

    if (!orbit) {
      orbit = document.createElement("div");
      orbit.className = `age-orbit ${item.className}`;
      orbit.dataset.ageOrbit = item.className;
      orbit.innerHTML = `
        <div class="age-ring">
          <strong></strong>
        </div>
        <span></span>
      `;
      orbitRoot.append(orbit);
    }

    const ring = orbit.querySelector(".age-ring");
    ring.style.setProperty("--angle", `${Math.min(item.value / 50, 1) * 360}deg`);
    ring.querySelector("strong").textContent = `${item.value}%`;
    orbit.querySelector("span").textContent = item.label;
  });
}

function renderAgeQuoteSlider(population) {
  const slider = document.getElementById("age-quote-year-slider");
  const rows = population.ageQuote;
  if (state.selectedAgeQuoteIndex >= rows.length) state.selectedAgeQuoteIndex = rows.length - 1;
  slider.min = "0";
  slider.max = String(rows.length - 1);
  slider.value = String(state.selectedAgeQuoteIndex);
  setText("#age-quote-slider-label", t().age.year);
}

function renderPeople(count, direction) {
  return Array.from({ length: count }, (_, i) => `<span class="person ${direction}" style="--i: ${i}"></span>`).join("");
}

function renderAgeFlow(population) {
  const rows = population.ageMigration;
  const selected = rows[state.selectedAgeIndex] ?? rows.at(-1);
  const root = document.getElementById("age-flow-grid");
  const max = Math.max(...selected.values.flatMap((r) => [r.incoming, r.outgoing]));

  document.getElementById("age-flow-year").textContent = selected.year;
  root.innerHTML = "";

  for (const row of selected.values) {
    const inCount = Math.max(2, Math.round((row.incoming / max) * 9));
    const outCount = Math.max(2, Math.round((row.outgoing / max) * 9));
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
          <div><span class="door-icon" aria-hidden="true"></span>${renderPeople(inCount, "incoming")}</div>
          <strong>${formatNumber(row.incoming)}</strong>
        </div>
        <div class="flow-lane outgoing">
          <span>${t().series.outgoing}</span>
          <div><span class="door-icon" aria-hidden="true"></span>${renderPeople(outCount, "outgoing")}</div>
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
  if (state.selectedAgeIndex >= rows.length) state.selectedAgeIndex = rows.length - 1;
  slider.min = "0";
  slider.max = String(rows.length - 1);
  slider.value = String(state.selectedAgeIndex);
  setText("#age-slider-label", t().age.year);
}

function renderSources() {
  setSource("status-source", ["Sonderbericht - Auslaendische Bevoelkerung"]);
  setSource("migration-source", ["Zuzüge nach", "Wegzüge aus"]);
  setSource("population-source", ["Statistischen Bezirken"]);
  setSource("vital-source", ["Geburten"]);
  setSource("age-source", ["Jugend- und Altenquote"]);
  setSource("age-migration-source", ["Zuzüge nach", "Wegzüge aus"]);
  setSource("health-source", ["Gesundheit und Soziales"]);
}

// ---------------------------------------------------------------------------
// Education view
// ---------------------------------------------------------------------------

const EDU_TYPE_COLOURS = [
  "#C44D36","#542D24","#4A7C59","#7BAFD4","#E5A14F",
  "#9B6EA8","#4EB3A2","#D4836A","#6B8E5E","#A06030","#3A6B8A","#C9A84C"
];

const EDU_PROGRAM_COLOURS = [
  "#C44D36","#4A7C59","#7BAFD4","#E5A14F","#9B6EA8","#4EB3A2","#A06030"
];

function renderEducationKpis(summary, lang) {
  const labels = lang === "de"
    ? { students: "Schüler", studentsHint: "Stadtweit, aktuelles Schuljahr", schools: "Schulen", schoolsHint: "Aktive Schulen", growth: "Schüler-Veränderung", growthHint: "Seit Basiszeitraum", uniFreshmen: "Erstsemester", uniFreshmenHint: "1. Fachsemester", programmeStudents: "Studierende gesamt", programmeStudentsHint: "Aktuelles Wintersemester", femaleShare: "Frauenanteil Uni", femaleShareHint: "Anteil weiblicher Erstsemester" }
    : { students: "School students", studentsHint: "City-wide, current school year", schools: "Schools", schoolsHint: "Active schools", growth: "Student change", growthHint: "Since baseline year", uniFreshmen: "Uni freshmen", uniFreshmenHint: "1st-semester enrolments", programmeStudents: "Enrolled students", programmeStudentsHint: "Latest winter semester", femaleShare: "Female uni share", femaleShareHint: "Share of female freshmen" };

  const items = [
    { label: labels.students, value: formatNumber(summary.totalSchoolStudents), hint: `${labels.studentsHint} (${summary.schoolDataYear})` },
    { label: labels.schools, value: formatNumber(summary.totalSchools), hint: labels.schoolsHint },
    { label: labels.growth, value: formatSigned(summary.schoolStudentsGrowth), hint: labels.growthHint },
    { label: labels.uniFreshmen, value: formatNumber(summary.universityFreshmen), hint: `${labels.uniFreshmenHint} (${summary.universityDataYear})` },
    { label: labels.programmeStudents, value: formatNumber(summary.programmeStudents), hint: `${labels.programmeStudentsHint} (${summary.programmeDataYear})` },
    { label: labels.femaleShare, value: `${summary.femaleUniShare}%`, hint: labels.femaleShareHint }
  ];

  const grid = document.getElementById("education-kpi-grid");
  if (!grid) return;
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

function renderSchoolTypeChart(schoolDetails, lang) {
  const { byType, typeLabels } = schoolDetails;

  // Sort ascending so largest bar appears at top
  const sorted = [...byType].sort((a, b) => a.students - b.students);

  const colours = [
    "#C44D36","#542D24","#4A7C59","#7BAFD4","#E5A14F",
    "#9B6EA8","#4EB3A2","#D4836A","#6B8E5E","#A06030","#3A6B8A","#C9A84C"
  ];

  // Assign a colour per type in sorted order
  const barColours = sorted.map((_, i) => colours[i % colours.length]);

  createChart("school-type-chart", {
    type: "bar",
    data: {
      labels: sorted.map((d) => typeLabels[lang]?.[d.type] ?? d.type),
      datasets: [
        {
          // Thin stem of the lollipop
          label: lang === "de" ? "Schüler" : "Students",
          data: sorted.map((d) => d.students),
          backgroundColor: barColours.map((c) => c + "22"),
          borderColor: barColours,
          borderWidth: 0,
          borderRadius: 0,
          barThickness: 3
        },
        {
          // Round head of the lollipop
          type: "bubble",
          label: "_head",
          data: sorted.map((d, i) => ({
            x: d.students,
            y: typeLabels[lang]?.[sorted[i].type] ?? sorted[i].type,
            r: 7,
            students: d.students,
            schools: d.schools
          })),
          backgroundColor: barColours,
          borderColor: "#ffffff",
          borderWidth: 2
        }
      ]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: true,
      animation: { duration: 900, easing: "easeOutQuart" },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "rgba(84,45,36,0.94)",
          padding: 12,
          filter: (item) => item.datasetIndex === 1,
          callbacks: {
            title: (items) => items[0]?.label ?? "",
            label: (ctx) => [
              ` ${lang === "de" ? "Schüler" : "Students"}: ${formatNumber(ctx.raw.students)}`,
              ` ${lang === "de" ? "Schulen" : "Schools"}: ${formatNumber(ctx.raw.schools)}`
            ]
          }
        }
      },
      scales: {
        x: {
          grid: { color: "#eeeeee" },
          ticks: {
            color: css("--muted"),
            callback: (v) => v >= 1000 ? (v / 1000).toFixed(0) + "k" : v
          }
        },
        y: {
          grid: { display: false },
          ticks: {
            color: css("--ink"),
            font: { size: 12, weight: 600 }
          }
        }
      }
    }
  });
}

function renderCapacityChart(schoolDetails, lang) {
  const { byType, typeLabels } = schoolDetails;

  // Build per-type aggregates
  const aggregated = byType.map((d) => ({
    type: typeLabels[lang]?.[d.type] ?? d.type,
    schools: d.schools,
    classes: d.classes,
    students: d.students,
    avgClassSize: d.classes > 0 ? Math.round(d.students / d.classes) : 0,
    avgSchoolSize: d.schools > 0 ? Math.round(d.students / d.schools) : 0
  })).sort((a, b) => b.students - a.students);

  const TYPE_COLORS = {
    "Primary": "#C44D36", "Grundschule": "#C44D36",
    "Secondary": "#4EB3A2", "Sekundarschule": "#4EB3A2",
    "Gemeinschaftsschule": "#7BAFD4",
    "Gymnasium": "#4A7C59",
    "IGS": "#E5A14F",
    "Special needs": "#9B6EA8", "Förderschule": "#9B6EA8",
    "Berufsbildende": "#542D24", "Vocational": "#542D24",
    "Sixth-form": "#3A6B8A", "Fachgymnasium": "#3A6B8A",
    "Evening gym.": "#D4836A", "Abendgym.": "#D4836A",
    "Kolleg": "#A06030",
    "College": "#C9A84C"
  };

  const getColor = (type) =>
    TYPE_COLORS[type] ?? TYPE_COLORS[typeLabels?.en?.[type]] ?? "#888";

  const metrics = [
    {
      key: "schools",
      label: lang === "de" ? "Schulen" : "Schools",
      fn: (d) => d.schools,
      fmt: (v) => v
    },
    {
      key: "classes",
      label: lang === "de" ? "Klassen" : "Classes",
      fn: (d) => d.classes,
      fmt: (v) => v
    },
    {
      key: "students",
      label: lang === "de" ? "Schüler" : "Students",
      fn: (d) => d.students,
      fmt: (v) => v >= 1000 ? (v / 1000).toFixed(1) + "k" : v
    },
    {
      key: "avgClassSize",
      label: lang === "de" ? "Ø Klassengröße" : "Avg class size",
      fn: (d) => d.avgClassSize,
      fmt: (v) => v
    },
    {
      key: "avgSchoolSize",
      label: lang === "de" ? "Ø Schulgröße" : "Avg school size",
      fn: (d) => d.avgSchoolSize,
      fmt: (v) => v >= 1000 ? (v / 1000).toFixed(1) + "k" : v
    }
  ];

  // Compute min/max per metric for colour scaling
  metrics.forEach((m) => {
    const vals = aggregated.map(m.fn);
    m.min = Math.min(...vals);
    m.max = Math.max(...vals);
  });

  const HEAT = ["#FAECE7", "#F5C4B3", "#F0997B", "#D85A30", "#993C1D", "#712B13"];

  function heatBg(val, min, max) {
    const t = Math.round(((val - min) / (max - min || 1)) * 5);
    return HEAT[Math.max(0, Math.min(5, t))];
  }

  function heatText(val, min, max) {
    return (val - min) / (max - min || 1) > 0.55 ? "#ffffff" : "#712B13";
  }

  // Replace canvas with a styled table
  const canvas = document.getElementById("school-capacity-chart");
  if (!canvas) return;

  // Remove old chart instance if any
  destroyChart("school-capacity-chart");

  // Replace canvas with a div for the table
  const wrapper = document.createElement("div");
  wrapper.id = "school-capacity-heatmap";
  wrapper.style.cssText = "overflow-x:auto; margin-top:0.5rem;";
  canvas.replaceWith(wrapper);

  // Build table HTML
  let html = `
    <table style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead>
        <tr>
          <th style="text-align:left;padding:8px 10px;color:#888;font-weight:500;
                     border-bottom:1px solid #e5e5e5;white-space:nowrap;">
            ${lang === "de" ? "Schulart" : "School type"}
          </th>
          ${metrics.map((m) => `
            <th style="padding:8px 10px;color:#888;font-weight:500;
                       border-bottom:1px solid #e5e5e5;text-align:center;
                       white-space:nowrap;">
              ${m.label}
            </th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${aggregated.map((d) => `
          <tr style="transition:background 0.15s;" 
              onmouseover="this.style.outline='2px solid #C44D3655'"
              onmouseout="this.style.outline='none'">
            <td style="padding:9px 10px;font-weight:600;color:#2C2C2A;
                       border-bottom:1px solid #f0f0f0;white-space:nowrap;">
              <span style="display:inline-block;width:9px;height:9px;
                           border-radius:2px;background:${getColor(d.type)};
                           margin-right:7px;vertical-align:middle;flex-shrink:0;">
              </span>${d.type}
            </td>
            ${metrics.map((m) => {
              const val = m.fn(d);
              const bg = heatBg(val, m.min, m.max);
              const tc = heatText(val, m.min, m.max);
              return `
                <td style="padding:9px 10px;text-align:center;background:${bg};
                           color:${tc};font-weight:600;border-bottom:1px solid #f0f0f0;
                           border-left:2px solid #fff;border-right:2px solid #fff;">
                  ${m.fmt(val)}
                </td>`;
            }).join("")}
          </tr>`).join("")}
      </tbody>
    </table>`;

  wrapper.innerHTML = html;

  // Add colour scale legend
  const legend = document.createElement("div");
  legend.style.cssText = "display:flex;align-items:center;gap:8px;margin-top:12px;font-size:11px;color:#888;";
  legend.innerHTML = `
    <span>${lang === "de" ? "Niedrig" : "Low"}</span>
    ${HEAT.map((c) => `<div style="width:18px;height:12px;border-radius:2px;background:${c};"></div>`).join("")}
    <span>${lang === "de" ? "Hoch" : "High"}</span>
    <span style="margin-left:12px;color:#aaa;">
      ${lang === "de" 
        ? "· Farbe zeigt relativen Wert je Spalte" 
        : "· Colour shows relative value within each column"}
    </span>`;
  wrapper.after(legend);
}

function renderSchoolTrendChart(schoolDetails) {
  const { cityTrend } = schoolDetails;
  createChart("school-trend-chart", {
    type: "bar",
    data: {
      labels: cityTrend.map((r) => String(r.year)),
      datasets: [{ label: state.language === "de" ? "Schüler gesamt" : "Total students", data: cityTrend.map((r) => r.students), backgroundColor: "rgba(196,77,54,0.30)", borderColor: css("--brand-orange"), borderWidth: 2, borderRadius: 3 }]
    },
    options: {
      responsive: true, maintainAspectRatio: true, animation: { duration: 900 },
      plugins: { legend: { display: false }, tooltip: { backgroundColor: "rgba(84,45,36,0.94)", padding: 10, callbacks: { label: (ctx) => ` ${formatNumber(ctx.parsed.y)} students` } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: css("--muted"), maxRotation: 0, autoSkip: true, maxTicksLimit: 12 } },
        y: { grid: { color: "#eeeeee" }, ticks: { color: css("--muted"), callback: (v) => formatNumber(v) } }
      }
    }
  });
}

function renderEducationDistrictMap(districtSchools) {
  const inspector = document.getElementById("education-inspector");
  if (!inspector || !state.boundary) return;
  const districts = districtSchools.latestDistrictBreakdown;
  const max = Math.max(1, ...districts.map((d) => d.students));
  const ranked = [...districts].sort((a, b) => b.students - a.students);
  const rankByName = new Map(ranked.map((d, i) => [d.name, i + 1]));
  const topNames = new Set(ranked.slice(0, 10).map((d) => d.name));
  const map = resetLeafletMap("education-map");
  const boundaryLayer = addBoundaryMask(map, state.boundary);
  const bounds = boundaryLayer.getBounds();

  inspector.innerHTML = `<p class="eyebrow">${t().map.hover}</p><h3>${t().map.topDistricts}</h3><span>${state.language === "de" ? "Fahre über einen Bezirk für Details." : "Hover a district for details."}</span>`;

  districts.forEach((district) => {
    const coord = findDistrictCoordinate(district.name);
    if (!coord) return;
    const intensity = Math.max(0.12, Math.sqrt(district.students / max));
    const markerColor = topNames.has(district.name) ? css("--brand-brown") : css("--brand-orange");
    const marker = L.circleMarker([coord.lat, coord.lon], {
      radius: 5 + intensity * 12,
      fillColor: mixColor("#eeeeee", markerColor, intensity),
      fillOpacity: topNames.has(district.name) ? 0.88 : 0.68,
      stroke: false
    }).addTo(map);
    const rank = rankByName.get(district.name);
    marker.bindTooltip(`${district.name}: ${formatNumber(district.students)} ${state.language === "de" ? "Schüler" : "students"}`, { direction: "top", sticky: true });
    marker.on("mouseover", () => {
      inspector.innerHTML = `<p class="eyebrow">${t().map.rank} ${rank}</p><h3>${district.name}</h3><strong>${formatNumber(district.students)}</strong><span>${state.language === "de" ? "Schüler" : "Students"} · ${districtSchools.latestYear}</span><div class="gender-split" style="margin-top:0.5rem"><span>${state.language === "de" ? "Schulen" : "Schools"}: ${district.schools}</span><span>${state.language === "de" ? "Klassen" : "Classes"}: ${district.classes}</span></div>`;
    });
    marker.on("click", () => marker.fire("mouseover"));
  });

  map.fitBounds(bounds, { padding: [16, 16] });
  map.setMaxBounds(bounds.pad(0.08));
  setTimeout(() => map.invalidateSize(), 0);

  const top = ranked[0];
  if (top) inspector.innerHTML = `<p class="eyebrow">${t().map.rank} 1</p><h3>${top.name}</h3><strong>${formatNumber(top.students)}</strong><span>${state.language === "de" ? "Schüler" : "Students"} · ${districtSchools.latestYear}</span><div class="gender-split" style="margin-top:0.5rem"><span>${state.language === "de" ? "Schulen" : "Schools"}: ${top.schools}</span><span>${state.language === "de" ? "Klassen" : "Classes"}: ${top.classes}</span></div>`;
}

function renderUniversityTrendChart(universities) {
  const { trend } = universities;
  createChart("university-trend-chart", {
    type: "line",
    data: {
      labels: trend.map((r) => String(r.year)),
      datasets: [
        { label: state.language === "de" ? "Gesamt" : "Total", data: trend.map((r) => r.total), borderColor: css("--brand-orange"), backgroundColor: "rgba(196,77,54,0.10)", borderWidth: 3, tension: 0.35, fill: true },
        { label: state.language === "de" ? "Männlich" : "Male", data: trend.map((r) => r.male), borderColor: css("--brand-brown"), borderWidth: 2, tension: 0.35 },
        { label: state.language === "de" ? "Weiblich" : "Female", data: trend.map((r) => r.female), borderColor: css("--signal-green"), borderWidth: 2, tension: 0.35 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true, animation: { duration: 900, easing: "easeOutQuart" },
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: { labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, color: css("--ink"), font: { weight: 700 } } },
        tooltip: { backgroundColor: "rgba(84,45,36,0.94)", padding: 12, callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${formatNumber(ctx.parsed.y)}` } }
      },
      scales: {
        x: { grid: { display: false }, ticks: { color: css("--muted"), maxRotation: 0 } },
        y: { grid: { color: "#eeeeee" }, ticks: { color: css("--muted"), callback: (v) => formatNumber(v) } }
      }
    }
  });
}

function renderInstitutionChart(universities) {
  const top = universities.institutionBreakdown.slice(0, 8);
  createChart("institution-breakdown-chart", {
    type: "bar",
    data: {
      labels: top.map((d) => {
        const parts = d.name.split(/\s+/);
        const mid = Math.ceil(parts.length / 2);
        return [parts.slice(0, mid).join(" "), parts.slice(mid).join(" ")];
      }),
      datasets: [
        { label: state.language === "de" ? "Männlich" : "Male", data: top.map((d) => d.male), backgroundColor: css("--brand-brown") + "CC", borderColor: css("--brand-brown"), borderWidth: 1, stack: "gender" },
        { label: state.language === "de" ? "Weiblich" : "Female", data: top.map((d) => d.female), backgroundColor: css("--signal-green") + "CC", borderColor: css("--signal-green"), borderWidth: 1, stack: "gender" }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: true, animation: { duration: 900 },
      plugins: {
        legend: { labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, color: css("--ink"), font: { weight: 700 } } },
        tooltip: { backgroundColor: "rgba(84,45,36,0.94)", padding: 10, callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${formatNumber(ctx.parsed.y)}` } }
      },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { color: css("--muted"), maxRotation: 30, font: { size: 10 } } },
        y: { stacked: true, grid: { color: "#eeeeee" }, ticks: { color: css("--muted"), callback: (v) => formatNumber(v) } }
      }
    }
  });
}

function renderStudyProgramChart(studyPrograms, lang) {
  const institutions = studyPrograms.latestInstitutionBreakdown ?? [];
  const formTotals = new Map();
  for (const institution of institutions) {
    for (const [form, data] of Object.entries(institution.studyForms ?? {})) {
      formTotals.set(form, (formTotals.get(form) ?? 0) + data.total);
    }
  }

  const formLabels = lang === "de"
    ? {
      "Direktstudium": "Direktstudium",
      "Berufsbegleitendes Fernstudium": "Berufsbegl. Fernstudium",
      "Grundständiges Studium": "Grundständiges Studium",
      "Master- und Aufbaustudiengänge": "Master- und Aufbaustudiengänge",
      "Weiterbildung": "Weiterbildung",
      "Promotionsstudium": "Promotionsstudium",
      "Struktur. Promotionsstudium": "Struktur. Promotionsstudium"
    }
    : {
      "Direktstudium": "Direct study",
      "Berufsbegleitendes Fernstudium": "Part-time distance study",
      "Grundständiges Studium": "Undergraduate study",
      "Master- und Aufbaustudiengänge": "Master's / advanced",
      "Weiterbildung": "Continuing education",
      "Promotionsstudium": "Doctoral study",
      "Struktur. Promotionsstudium": "Structured doctorate"
    };

  const forms = [...formTotals.entries()].sort((a, b) => b[1] - a[1]).map(([form]) => form);
  const datasets = forms.map((form, index) => ({
    label: formLabels[form] ?? form,
    data: institutions.map((institution) => institution.studyForms?.[form]?.total ?? 0),
    backgroundColor: EDU_PROGRAM_COLOURS[index % EDU_PROGRAM_COLOURS.length] + "CC",
    borderColor: EDU_PROGRAM_COLOURS[index % EDU_PROGRAM_COLOURS.length],
    borderWidth: 1,
    stack: "studyForms"
  }));

  createChart("study-program-chart", {
    type: "bar",
    data: {
      labels: institutions.map((institution) => {
        const parts = institution.name.split(/\s+/);
        const mid = Math.ceil(parts.length / 2);
        return [parts.slice(0, mid).join(" "), parts.slice(mid).join(" ")];
      }),
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      animation: { duration: 900 },
      plugins: {
        legend: {
          position: "right",
          labels: { boxWidth: 10, boxHeight: 10, usePointStyle: true, color: css("--ink"), font: { weight: 700, size: 11 } }
        },
        tooltip: {
          backgroundColor: "rgba(84,45,36,0.94)",
          padding: 10,
          callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ${formatNumber(ctx.parsed.y)}` }
        }
      },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { color: css("--muted"), maxRotation: 20, font: { size: 10 } } },
        y: { stacked: true, grid: { color: "#eeeeee" }, ticks: { color: css("--muted"), callback: (v) => formatNumber(v) } }
      }
    }
  });
}

function renderEducationSources() {
  const prefix = `${t().sources}: `;
  const sources = state.data.education?.sources ?? [];
  const pick = (needle) => sources.find((s) => s.dataset?.includes(needle));
  const fmt = (src) => src ? `${src.dataset} · ${src.source} · ${src.url}` : "Amt für Statistik Magdeburg";
  [
    ["edu-type-source", pick("Schulen in der Stadt")],
    ["edu-capacity-source", pick("Schulen in der Stadt")],
    ["edu-map-source", pick("Schulen in der Stadt Magdeburg nach Stadtteilen")],
    ["edu-trend-source", pick("Schulen in der Stadt")],
    ["edu-uni-trend-source", pick("Studierenden")],
    ["edu-uni-institution-source", pick("Studierenden")],
    ["edu-program-source", pick("Studierende nach Studienform und Studiengang")]
  ].forEach(([id, src]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = prefix + fmt(src);
  });
}

function renderEducationView() {
  const edu = state.data.education;
  if (!edu) return;
  renderEducationKpis(edu.summary, state.language);
  renderSchoolTypeChart(edu.schoolDetails, state.language);
  renderCapacityChart(edu.schoolDetails, state.language);
  renderSchoolTrendChart(edu.schoolDetails);
  renderEducationDistrictMap(edu.districtSchools);
  renderUniversityTrendChart(edu.universities);
  renderInstitutionChart(edu.universities);
  renderStudyProgramChart(edu.studyPrograms, state.language);
  renderEducationSources();
}

// ---------------------------------------------------------------------------
// Health view
// ---------------------------------------------------------------------------

function renderHealthView() {
  const health = state.data.health;
  const selectedYear = state.selectedHealthYear ?? health.latestYear;
  const districts = healthDistrictSnapshot(health, selectedYear);
  const rankedDistricts = [...districts].sort((a, b) => b.total - a.total);
  state.healthRankedDistricts = rankedDistricts;
  if (state.selectedHealthRank >= rankedDistricts.length) state.selectedHealthRank = 0;
  renderHealthYearSlider(health);
  renderMap("health-map", "health-inspector", districts, { ranked: true, onInspect: updateHealthInspector, initialIndex: state.selectedHealthRank });
  syncHealthRankControls(state.selectedHealthRank + 1);
  document.getElementById("health-year-output").textContent = selectedYear;
  setSource("health-source", ["Gesundheit und Soziales"]);
}

// ---------------------------------------------------------------------------
// Population view
// ---------------------------------------------------------------------------

function renderPopulationMapSection(population) {
  const districts = districtSnapshot(population, state.selectedPopulationYear);
  renderMap("population-map", "population-inspector", districts);
  renderPopulationYearSlider(population);
}

function renderPopulationView() {
  const population = state.data.population;

  renderKpis(population.summary);
  renderStatusSlider(population);
  renderPopulationStatus(population);
  renderMigrationChart(population);
  renderPopulationMapSection(population);
  renderVitalChart(population);
  renderAgeQuoteSlider(population);
  renderAgeStructure(population);
  renderAgeSlider(population);
  renderAgeFlow(population);
  renderSources();
}

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Static text
// ---------------------------------------------------------------------------

function updateStaticText() {
  const copy = t();
  document.title = "MagdePulse";
  document.querySelector(".brand strong").textContent = "MagdePulse";
  document.querySelector(".brand em").textContent = copy.tagline;

  const kickerMap = {
    population: copy.introKicker,
    education: copy.educationKicker,
    infrastructure: copy.infrastructureKicker,
    health: copy.healthKicker ?? copy.introKicker
  };
  const copyMap = {
    population: copy.introCopy,
    education: copy.educationCopy,
    infrastructure: copy.infrastructureIntro,
    health: copy.healthIntro
  };

  setText("#topic-kicker", kickerMap[state.topic] ?? copy.comingSoon);
  setText("#page-title", copy.introTitle);
  setText("#page-copy", copyMap[state.topic] ?? copy.placeholders[state.topic] ?? copy.readyCopy);
  setText("#placeholder-kicker", copy.comingSoon);
  setText("#placeholder-title", copy.placeholders[state.topic] ?? copy.placeholders.infrastructure);
  setText("#placeholder-copy", copy.readyCopy);
  setText("#alerts-button span", copy.alerts);
  setText(".panel-title span", copy.liveAlerts);
  setText("#close-alerts", copy.close);

  document.querySelectorAll(".topic-button").forEach((btn) => {
    btn.textContent = copy.topics[btn.dataset.topic];
  });

  const sectionCopy = [
    ["status-orbits", "statusKicker", "statusTitle"],
    ["migration-chart", "migrationKicker", "migrationTitle"],
    ["population-map", "populationKicker", "populationTitle"],
    ["health-map", "healthKicker", "healthTitle"],
    ["infra-stock-chart", "infrastructureStockKicker", "infrastructureStockTitle"],
    ["infra-completions-chart", "infrastructureCompletionsKicker", "infrastructureCompletionsTitle"],
    ["infra-vacancy-chart", "infrastructureVacancyKicker", "infrastructureVacancyTitle"],
    ["vital-chart", "vitalKicker", "vitalTitle"],
    ["age-orbits", "ageKicker", "ageTitle"],
    ["age-flow-grid", "ageMigrationKicker", "ageMigrationTitle"],
    ["school-type-chart", "eduTypeKicker", "eduTypeTitle"],
    ["school-capacity-chart", "eduCapacityKicker", "eduCapacityTitle"],
    ["education-map", "eduMapKicker", "eduMapTitle"],
    ["school-trend-chart", "eduTrendKicker", "eduTrendTitle"],
    ["university-trend-chart", "eduUniTrendKicker", "eduUniTrendTitle"],
    ["institution-breakdown-chart", "eduUniInstitutionKicker", "eduUniInstitutionTitle"]
  ];

  for (const [id, kicker, title] of sectionCopy) {
    const card = document.getElementById(id)?.closest(".chart-card");
    if (!card) continue;
    const eyebrow = card.querySelector(".eyebrow");
    const h2 = card.querySelector("h2");
    if (eyebrow) eyebrow.textContent = copy.charts[kicker];
    if (h2) h2.textContent = copy.charts[title];
  }
}

// ---------------------------------------------------------------------------
// Topic routing
// ---------------------------------------------------------------------------

function renderTopic() {
  const isPopulation = state.topic === "population";
  const isEducation = state.topic === "education";
  const isInfrastructure = state.topic === "infrastructure";
  const isHealth = state.topic === "health";

  document.getElementById("population-view").hidden = !isPopulation;
  document.getElementById("education-view").hidden = !isEducation;
  document.getElementById("infrastructure-view").hidden = !isInfrastructure;
  document.getElementById("health-view").hidden = !isHealth;
  document.getElementById("placeholder-view").hidden = isPopulation || isEducation || isInfrastructure || isHealth;

  updateStaticText();
  if (!state.data) return;

  if (isPopulation) renderPopulationView();
  if (isEducation) renderEducationView();
  if (isInfrastructure) renderInfrastructureView();
  if (isHealth) renderHealthView();
}

// ---------------------------------------------------------------------------
// Event bindings
// ---------------------------------------------------------------------------

function bindEvents() {
  document.querySelectorAll(".topic-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.topic = btn.dataset.topic;
      document.querySelectorAll(".topic-button").forEach((b) => b.classList.toggle("is-active", b === btn));
      renderTopic();
    });
  });

  document.querySelectorAll(".language-toggle button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.language = btn.dataset.lang;
      document.documentElement.lang = state.language;
      document.querySelectorAll(".language-toggle button").forEach((b) => b.classList.toggle("is-active", b === btn));
      renderTopic();
      if (state.data) renderAlerts(state.data.alerts);
    });
  });

  document.getElementById("population-year-slider").addEventListener("input", (e) => {
    const years = populationYears(state.data.population);
    state.selectedPopulationYear = years[Number(e.target.value)];
    renderPopulationMapSection(state.data.population);
  });

  document.getElementById("status-year-slider").addEventListener("input", (event) => {
    state.selectedStatusIndex = Number(event.target.value);
    renderStatusSlider(state.data.population);
    renderPopulationStatus(state.data.population);
  });

  document.getElementById("age-quote-year-slider").addEventListener("input", (e) => {
    state.selectedAgeQuoteIndex = Number(e.target.value);
    renderAgeQuoteSlider(state.data.population);
    renderAgeStructure(state.data.population);
  });

  document.getElementById("age-year-slider").addEventListener("input", (e) => {
    state.selectedAgeIndex = Number(e.target.value);
    renderAgeFlow(state.data.population);
  });

  document.getElementById("health-year-slider").addEventListener("input", (e) => {
    const years = healthYears(state.data.health);
    state.selectedHealthYear = years[Number(e.target.value)];
    state.selectedHealthRank = 0;
    renderHealthView();
  });

  document.getElementById("health-rank-prev").addEventListener("click", () => {
    selectHealthRank(state.healthRankedDistricts, state.selectedHealthRank - 1);
  });

  document.getElementById("health-rank-next").addEventListener("click", () => {
    selectHealthRank(state.healthRankedDistricts, state.selectedHealthRank + 1);
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

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

async function loadDashboard() {
  const response = await fetch("/api/dashboard");
  if (!response.ok) throw new Error("Dashboard data could not be loaded.");
  state.data = await response.json();
  [state.boundary, state.districtCoordinates] = await Promise.all([loadBoundary(), loadDistrictCoordinates()]);
  state.selectedPopulationYear = populationYears(state.data.population).at(-1);
  state.selectedStatusIndex = statusRows(state.data.population).length - 1;
  state.selectedAgeQuoteIndex = state.data.population.ageQuote.length - 1;
  state.selectedAgeIndex = state.data.population.ageMigration.length - 1;
  state.selectedHealthYear = state.data.health?.latestYear;
  renderAlerts(state.data.alerts);
  renderTopic();
}

bindEvents();
loadDashboard().catch((error) => {
  setText("#topic-kicker", "Error");
  setText("#page-title", "Dashboard unavailable");
  setText("#page-copy", error.message);
});
