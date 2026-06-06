const MAGDEBURG = { lat: 52.1205, lon: 11.6276 };
const CACHE_MS = 5 * 60 * 1000;
const WEATHER_URL = `https://api.brightsky.dev/current_weather?lat=${MAGDEBURG.lat}&lon=${MAGDEBURG.lon}`;
const WATER_BASE = "https://www.pegelonline.wsv.de/webservices/rest-api/v2";
const WATER_STATION = "MAGDEBURG-STROMBR%C3%9CCKE";
const WATER_NOW_URL = `${WATER_BASE}/stations/${WATER_STATION}/W/currentmeasurement.json`;
const WATER_SERIES_URL = `${WATER_BASE}/stations/${WATER_STATION}/W/measurements.json?start=P7D`;
const AIR_URL = `https://data.sensor.community/airrohr/v1/filter/area=${MAGDEBURG.lat},${MAGDEBURG.lon},10`;

let liveCache = null;

function round(value, digits = 1) {
  if (!Number.isFinite(value)) return null;
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

async function fetchJson(url, timeoutMs = 7000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function failedLiveBlock(sourceId, error) {
  return {
    status: "unavailable",
    sourceId,
    message: error instanceof Error ? error.message : "Live source unavailable"
  };
}

async function getWeather() {
  try {
    const payload = await fetchJson(WEATHER_URL);
    const weather = payload.weather ?? {};
    return {
      status: "ok",
      sourceId: "weather",
      timestamp: weather.timestamp ?? payload.sources?.[0]?.observation_date ?? null,
      condition: weather.condition ?? null,
      temperatureC: round(Number(weather.temperature)),
      windSpeedKmh: round(Number(weather.wind_speed)),
      precipitationMm: round(Number(weather.precipitation)),
      cloudCoverPct: round(Number(weather.cloud_cover), 0)
    };
  } catch (error) {
    return failedLiveBlock("weather", error);
  }
}

function summarizeWaterSeries(series) {
  const values = series
    .map((row) => ({ timestamp: row.timestamp, value: Number(row.value) }))
    .filter((row) => Number.isFinite(row.value))
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  if (!values.length) {
    return { measurements: 0, minCm: null, maxCm: null, trendCm: null };
  }

  return {
    measurements: values.length,
    minCm: Math.min(...values.map((row) => row.value)),
    maxCm: Math.max(...values.map((row) => row.value)),
    trendCm: round(values.at(-1).value - values[0].value, 0)
  };
}

async function getWaterLevel() {
  try {
    const [now, series] = await Promise.all([
      fetchJson(WATER_NOW_URL),
      fetchJson(WATER_SERIES_URL)
    ]);

    return {
      status: "ok",
      sourceId: "water",
      station: "Magdeburg-Strombr\u00fccke",
      timestamp: now.timestamp ?? null,
      levelCm: round(Number(now.value), 0),
      ...summarizeWaterSeries(Array.isArray(series) ? series : [])
    };
  } catch (error) {
    return failedLiveBlock("water", error);
  }
}

function airQualityKey(pm25, pm10) {
  const pm25Score = Number.isFinite(pm25) ? pm25 / 15 : 0;
  const pm10Score = Number.isFinite(pm10) ? pm10 / 45 : 0;
  const score = Math.max(pm25Score, pm10Score);
  if (score <= 0.5) return "good";
  if (score <= 1) return "moderate";
  if (score <= 2) return "elevated";
  return "high";
}

async function getAirQuality() {
  try {
    const rows = await fetchJson(AIR_URL);
    const pm10 = [];
    const pm25 = [];

    for (const row of Array.isArray(rows) ? rows : []) {
      for (const value of row.sensordatavalues ?? []) {
        const measured = Number(value.value);
        if (!Number.isFinite(measured)) continue;
        if (value.value_type === "P1") pm10.push(measured);
        if (value.value_type === "P2") pm25.push(measured);
      }
    }

    const avg = (values) => values.length
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : null;
    const pm10Avg = round(avg(pm10));
    const pm25Avg = round(avg(pm25));

    return {
      status: "ok",
      sourceId: "air",
      timestamp: new Date().toISOString(),
      sensors: Math.max(pm10.length, pm25.length),
      pm10: pm10Avg,
      pm25: pm25Avg,
      qualityKey: airQualityKey(pm25Avg, pm10Avg),
      guideline: { pm10: 45, pm25: 15, unit: "\u00b5g/m\u00b3", basis: "WHO 24h guideline" }
    };
  } catch (error) {
    return failedLiveBlock("air", error);
  }
}

export async function getLiveDashboardData({ force = false } = {}) {
  if (!force && liveCache && Date.now() - liveCache.cachedAt < CACHE_MS) {
    return liveCache.payload;
  }

  const [weather, water, air] = await Promise.all([
    getWeather(),
    getWaterLevel(),
    getAirQuality()
  ]);

  const payload = {
    updatedAt: new Date().toISOString(),
    refreshSeconds: CACHE_MS / 1000,
    anchor: MAGDEBURG,
    weather,
    water,
    air,
    sources: [
      {
        id: "weather",
        name: "Bright Sky / DWD current weather",
        url: WEATHER_URL
      },
      {
        id: "water",
        name: "PEGELONLINE / WSV Elbe water level",
        url: WATER_NOW_URL
      },
      {
        id: "air",
        name: "Sensor.Community air quality",
        url: AIR_URL
      }
    ]
  };

  liveCache = { cachedAt: Date.now(), payload };
  return payload;
}
