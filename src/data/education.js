import ExcelJS from "exceljs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { dataSources } from "./sources.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const educationDir = path.join(__dirname, "education");

let cachedEducationData;

// ---------------------------------------------------------------------------
// Utility helpers
// ---------------------------------------------------------------------------

function asNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (value && typeof value === "object") return asNumber(value.result ?? value.text);
  const parsed = Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function asString(value) {
  if (value && typeof value === "object") return String(value.result ?? value.text ?? "").trim();
  return String(value ?? "").trim();
}

// ---------------------------------------------------------------------------
// File discovery
// ---------------------------------------------------------------------------

async function getEducationFiles() {
  const files = await fs.readdir(educationDir);
  const pick = (predicate, label) => {
    const file = files.find(predicate);
    if (!file) throw new Error(`A required education dataset is missing: ${label}.`);
    return path.join(educationDir, file);
  };

  return {
    districtSchools: pick(
      (n) => n.includes("Schulen in der Stadt Magdeburg nach Stadtteilen"),
      "district schools"
    ),
    schoolDetails: pick(
      (n) => n === "Schulen in der Stadt Magdeburg.xlsx",
      "school details"
    ),
    universityFreshmen: pick(
      (n) => n.includes("Anzahl der Studierenden im 1. Fachsemester"),
      "university freshmen"
    ),
    studyPrograms: pick(
      (n) => n.includes("Studierende nach Studienform und Studiengang im Wintersemester"),
      "study programs"
    )
  };
}

async function readSheetRows(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const sheet = workbook.worksheets[0];
  const rows = [];
  for (let r = 2; r <= sheet.rowCount; r += 1) {
    rows.push(sheet.getRow(r).values.slice(1));
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Parser: district schools  (col layout: year | district | schools | classes | students)
// ---------------------------------------------------------------------------

function parseDistrictSchoolsRows(rows) {
  const districtTrends = new Map();

  for (const row of rows) {
    const name = asString(row[1]);
    if (name === "Magdeburg" || name === "Stadtgebiet") continue;
    const trend = districtTrends.get(name) ?? [];
    trend.push({
      year: Number(row[0]),
      schools: asNumber(row[2]),
      classes: asNumber(row[3]),
      students: asNumber(row[4])
    });
    districtTrends.set(name, trend);
  }

  const cityTotals = rows
    .filter((r) => asString(r[1]) === "Magdeburg" || asString(r[1]) === "Stadtgebiet")
    .map((r) => ({
      year: Number(r[0]),
      schools: asNumber(r[2]),
      classes: asNumber(r[3]),
      students: asNumber(r[4])
    }))
    .sort((a, b) => a.year - b.year);

  const latestYear =
    cityTotals.at(-1)?.year ??
    Math.max(...rows.map((r) => Number(r[0])).filter((n) => !isNaN(n)));

  const latestDistrictBreakdown = rows
    .filter(
      (r) =>
        Number(r[0]) === latestYear &&
        asString(r[1]) !== "Magdeburg" &&
        asString(r[1]) !== "Stadtgebiet"
    )
    .map((r) => ({
      name: asString(r[1]),
      schools: asNumber(r[2]),
      classes: asNumber(r[3]),
      students: asNumber(r[4])
    }))
    .sort((a, b) => b.students - a.students);

  return {
    cityTotals,
    districtTrends: Object.fromEntries(districtTrends),
    latestDistrictBreakdown,
    latestYear
  };
}

// ---------------------------------------------------------------------------
// Parser: school details  (col: year | name | type | form | ownership | classes | students)
// ---------------------------------------------------------------------------

// Canonical short labels used in charts
const TYPE_LABELS = {
  en: {
    Grundschule: "Primary",
    Sekundarschule: "Secondary",
    Gesamtschule: "Comprehensive",
    Gymnasium: "Gymnasium",
    Förderschule: "Special needs",
    Berufsschule: "Vocational",
    Berufsbildende: "Vocational",
    Fachgymnasium: "Sixth-form",
    Fachschule: "College",
    Abendgymnasium: "Evening gym.",
    Kolleg: "Kolleg"
  },
  de: {
    Grundschule: "Grundschule",
    Sekundarschule: "Sekundarschule",
    Gesamtschule: "Gesamtschule",
    Gymnasium: "Gymnasium",
    Förderschule: "Förderschule",
    Berufsschule: "Berufsschule",
    Berufsbildende: "Berufsbildende",
    Fachgymnasium: "Fachgymnasium",
    Fachschule: "Fachschule",
    Abendgymnasium: "Abendgym.",
    Kolleg: "Kolleg"
  }
};

function canonicalType(rawType) {
  if (!rawType) return "Other";
  for (const key of Object.keys(TYPE_LABELS.en)) {
    if (rawType.includes(key)) return key;
  }
  return rawType.split(" ")[0] ?? "Other";
}

function parseSchoolDetailsRows(rows) {
  const schools = rows.map((r) => ({
    year: Number(r[0]),
    name: asString(r[1]),
    type: asString(r[2]),
    form: asString(r[3]),
    ownership: asString(r[4]),
    classes: asNumber(r[5]),
    students: asNumber(r[6])
  }));

  const latestYear = Math.max(...schools.map((s) => s.year));
  const activeSchools = schools.filter((s) => s.year === latestYear && s.students > 0);

  // Aggregate: students by school type
  const byTypeMap = new Map();
  for (const school of activeSchools) {
    const type = canonicalType(school.type);
    const prev = byTypeMap.get(type) ?? { students: 0, schools: 0, classes: 0 };
    byTypeMap.set(type, {
      students: prev.students + school.students,
      schools: prev.schools + 1,
      classes: prev.classes + school.classes
    });
  }
  const byType = [...byTypeMap.entries()]
    .map(([type, data]) => ({ type, ...data }))
    .sort((a, b) => b.students - a.students);

  // Aggregate: ownership (public vs private)
  const ownershipMap = new Map();
  for (const school of activeSchools) {
    const key = school.ownership || "Unbekannt";
    const prev = ownershipMap.get(key) ?? { students: 0, schools: 0 };
    ownershipMap.set(key, {
      students: prev.students + school.students,
      schools: prev.schools + 1
    });
  }
  const byOwnership = [...ownershipMap.entries()].map(([ownership, data]) => ({ ownership, ...data }));

  // Capacity data for scatter: one point per school
  const capacityData = activeSchools
    .filter((s) => s.classes > 0 && s.students > 0)
    .map((s) => ({
      name: s.name,
      type: canonicalType(s.type),
      classes: s.classes,
      students: s.students,
      avgPerClass: Math.round(s.students / s.classes)
    }));

  // City-wide trend across all years
  const cityTrendMap = new Map();
  for (const school of schools) {
    const prev = cityTrendMap.get(school.year) ?? { year: school.year, students: 0, schools: 0 };
    cityTrendMap.set(school.year, {
      year: school.year,
      students: prev.students + school.students,
      schools: prev.schools + 1
    });
  }
  const cityTrend = [...cityTrendMap.values()].sort((a, b) => a.year - b.year);

  return {
    activeSchools,
    byType,
    byOwnership,
    capacityData,
    cityTrend,
    latestYear,
    typeLabels: TYPE_LABELS
  };
}

// ---------------------------------------------------------------------------
// Parser: university freshmen  (col: year | institution | subject | total | male | female)
// ---------------------------------------------------------------------------

function parseUniversityFreshmenRows(rows) {
  const yearlyData = new Map();

  for (const row of rows) {
    const year = Number(row[0]);
    if (!Number.isFinite(year)) continue;
    const institution = asString(row[1]);
    const total = asNumber(row[3]);
    const male = asNumber(row[4]);
    const female = asNumber(row[5]);

    const yearObj = yearlyData.get(year) ?? {
      year,
      total: 0,
      male: 0,
      female: 0,
      institutions: {}
    };
    yearObj.total += total;
    yearObj.male += male;
    yearObj.female += female;

    if (!yearObj.institutions[institution]) {
      yearObj.institutions[institution] = { total: 0, male: 0, female: 0 };
    }
    yearObj.institutions[institution].total += total;
    yearObj.institutions[institution].male += male;
    yearObj.institutions[institution].female += female;

    yearlyData.set(year, yearObj);
  }

  const sorted = [...yearlyData.values()].sort((a, b) => a.year - b.year);

  // Trend arrays for charts
  const trend = sorted.map((y) => ({
    year: y.year,
    total: y.total,
    male: y.male,
    female: y.female,
    femaleShare: y.total ? Math.round((y.female / y.total) * 100) : 0
  }));

  // Institution breakdown for the latest year
  const latest = sorted.at(-1);
  const institutionBreakdown = latest
    ? Object.entries(latest.institutions)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.total - a.total)
    : [];

  return { trend, institutionBreakdown, latestYear: latest?.year };
}

// ---------------------------------------------------------------------------
// Parser: study programmes  (col: year | institution | study form | programme | degree | degree label | total | male | female | first-sem total | first-sem male | first-sem female)
// ---------------------------------------------------------------------------

function parseStudyProgramRows(rows) {
  const yearlyData = new Map();

  for (const row of rows) {
    const year = Number(row[0]);
    if (!Number.isFinite(year)) continue;

    const institution = asString(row[1]);
    const studyForm = asString(row[2]);
    const total = asNumber(row[6]);
    const male = asNumber(row[7]);
    const female = asNumber(row[8]);
    const firstSemester = asNumber(row[9]);

    const yearObj = yearlyData.get(year) ?? {
      year,
      total: 0,
      male: 0,
      female: 0,
      firstSemester: 0,
      institutions: {}
    };

    yearObj.total += total;
    yearObj.male += male;
    yearObj.female += female;
    yearObj.firstSemester += firstSemester;

    if (!yearObj.institutions[institution]) {
      yearObj.institutions[institution] = {
        total: 0,
        male: 0,
        female: 0,
        firstSemester: 0,
        studyForms: {}
      };
    }

    const institutionBucket = yearObj.institutions[institution];
    institutionBucket.total += total;
    institutionBucket.male += male;
    institutionBucket.female += female;
    institutionBucket.firstSemester += firstSemester;

    if (!institutionBucket.studyForms[studyForm]) {
      institutionBucket.studyForms[studyForm] = { total: 0, male: 0, female: 0, firstSemester: 0 };
    }

    const formBucket = institutionBucket.studyForms[studyForm];
    formBucket.total += total;
    formBucket.male += male;
    formBucket.female += female;
    formBucket.firstSemester += firstSemester;

    yearlyData.set(year, yearObj);
  }

  const sorted = [...yearlyData.values()].sort((a, b) => a.year - b.year);

  const trend = sorted.map((y) => ({
    year: y.year,
    total: y.total,
    male: y.male,
    female: y.female,
    firstSemester: y.firstSemester,
    femaleShare: y.total ? Math.round((y.female / y.total) * 100) : 0
  }));

  const latest = sorted.at(-1);
  const latestInstitutionBreakdown = latest
    ? Object.entries(latest.institutions)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.total - a.total)
    : [];

  return {
    trend,
    latestInstitutionBreakdown,
    latestYear: latest?.year
  };
}

// ---------------------------------------------------------------------------
// Summary KPIs
// ---------------------------------------------------------------------------

function buildSummary({ districtSchools, schoolDetails, universities, studyPrograms }) {
  const latestSchoolData = districtSchools.cityTotals.at(-1);
  const firstSchoolData = districtSchools.cityTotals[0];
  const latestUniData = universities.trend.at(-1);
  const firstUniData = universities.trend[0];
  const largestType = schoolDetails.byType[0];
  const latestProgrammeData = studyPrograms.trend.at(-1);

  return {
    totalSchoolStudents: latestSchoolData?.students ?? 0,
    totalSchools: latestSchoolData?.schools ?? 0,
    schoolStudentsGrowth:
      latestSchoolData && firstSchoolData
        ? latestSchoolData.students - firstSchoolData.students
        : 0,
    schoolDataYear: latestSchoolData?.year,
    universityFreshmen: latestUniData?.total ?? 0,
    universityFreshmenGrowth:
      latestUniData && firstUniData ? latestUniData.total - firstUniData.total : 0,
    universityDataYear: latestUniData?.year,
    dominantSchoolType: largestType?.type ?? "",
    dominantSchoolTypeStudents: largestType?.students ?? 0,
    femaleUniShare: latestUniData?.femaleShare ?? 0,
    programmeStudents: latestProgrammeData?.total ?? 0,
    programmeDataYear: latestProgrammeData?.year
  };
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function getEducationDashboardData() {
  if (cachedEducationData) return cachedEducationData;

  const files = await getEducationFiles();
  const [districtRows, schoolDetailsRows, universityRows, studyProgramRows] = await Promise.all([
    readSheetRows(files.districtSchools),
    readSheetRows(files.schoolDetails),
    readSheetRows(files.universityFreshmen).catch(() => []),
    readSheetRows(files.studyPrograms)
  ]);

  const districtSchools = parseDistrictSchoolsRows(districtRows);
  const schoolDetails = parseSchoolDetailsRows(schoolDetailsRows);
  const universities = parseUniversityFreshmenRows(universityRows);
  const studyPrograms = parseStudyProgramRows(studyProgramRows);

  cachedEducationData = {
    generatedAt: new Date().toISOString(),
    summary: buildSummary({ districtSchools, schoolDetails, universities, studyPrograms }),
    datasets: [
      path.basename(files.districtSchools),
      path.basename(files.schoolDetails),
      path.basename(files.universityFreshmen),
      path.basename(files.studyPrograms)
    ],
    districtSchools,
    schoolDetails,
    universities,
    studyPrograms,
    sources: dataSources
  };

  return cachedEducationData;
}
