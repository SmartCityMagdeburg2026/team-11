const ids = {
  cityName: "city-name",
  lastUpdated: "last-updated",
  metricGrid: "metric-grid",
  districtList: "district-list",
  alertList: "alert-list",
  mobilityBars: "mobility-bars",
  energyBars: "energy-bars",
  activityList: "activity-list"
};

const getElement = (id) => document.getElementById(id);

const clampPercent = (value) => `${Math.max(0, Math.min(100, Number(value) || 0))}%`;

function toneClass(tone) {
  return `tone-${tone || "info"}`;
}

function renderMetrics(metrics) {
  const grid = getElement(ids.metricGrid);
  grid.innerHTML = "";

  for (const metric of metrics) {
    const card = document.createElement("article");
    card.className = "metric-card";

    card.innerHTML = `
      <header>
        <p class="metric-label"></p>
        <span class="metric-trend"></span>
      </header>
      <div>
        <div class="metric-value">
          <strong></strong>
          <span></span>
        </div>
        <p class="metric-delta"></p>
      </div>
    `;

    card.querySelector(".metric-label").textContent = metric.label;
    card.querySelector(".metric-trend").textContent = metric.trend;
    card.querySelector(".metric-trend").classList.add(toneClass(metric.tone));
    card.querySelector("strong").textContent = metric.value;
    card.querySelector(".metric-value span").textContent = metric.unit;
    card.querySelector(".metric-delta").textContent = `${metric.delta} since last cycle`;

    grid.append(card);
  }
}

function renderDistricts(districts) {
  const list = getElement(ids.districtList);
  list.innerHTML = "";

  for (const district of districts) {
    const row = document.createElement("article");
    row.className = "district-row";
    row.innerHTML = `
      <div>
        <p class="district-name"></p>
        <span class="district-meta"></span>
      </div>
      <div class="score">
        <strong></strong>
        <div class="track" aria-hidden="true">
          <div class="fill"></div>
        </div>
      </div>
      <div class="district-signals">
        <div class="mini-signal">
          <span>Traffic</span>
          <div class="track" aria-hidden="true"><div class="fill traffic"></div></div>
        </div>
        <div class="mini-signal">
          <span>Energy</span>
          <div class="track" aria-hidden="true"><div class="fill energy"></div></div>
        </div>
      </div>
    `;

    row.querySelector(".district-name").textContent = district.name;
    row.querySelector(".district-meta").textContent = district.status;
    row.querySelector(".score strong").textContent = district.score;
    row.querySelector(".score .fill").style.setProperty("--value", clampPercent(district.score));
    row.querySelector(".fill.traffic").style.setProperty("--value", clampPercent(district.traffic));
    row.querySelector(".fill.energy").style.setProperty("--value", clampPercent(district.energy));

    list.append(row);
  }
}

function renderAlerts(alerts) {
  const list = getElement(ids.alertList);
  list.innerHTML = "";

  for (const alert of alerts) {
    const item = document.createElement("li");
    const severity = alert.severity.toLowerCase() === "info" ? "info" : alert.severity.toLowerCase();

    item.innerHTML = `
      <p class="alert-title"></p>
      <div class="alert-meta">
        <span class="severity"></span>
        <span class="alert-time"></span>
      </div>
    `;

    item.querySelector(".alert-title").textContent = alert.title;
    item.querySelector(".severity").textContent = alert.severity;
    item.querySelector(".severity").classList.add(toneClass(severity));
    item.querySelector(".alert-time").textContent = alert.time;

    list.append(item);
  }
}

function renderBars(containerId, values, fillClass = "") {
  const container = getElement(containerId);
  container.innerHTML = "";

  for (const item of values) {
    const row = document.createElement("div");
    row.className = "bar-row";
    row.innerHTML = `
      <div class="bar-heading">
        <span></span>
        <span class="bar-value"></span>
      </div>
      <div class="track" aria-hidden="true">
        <div class="fill"></div>
      </div>
    `;

    row.querySelector(".bar-heading span").textContent = item.label;
    row.querySelector(".bar-value").textContent = `${item.value}%`;
    row.querySelector(".fill").style.setProperty("--value", clampPercent(item.value));

    if (fillClass) {
      row.querySelector(".fill").classList.add(fillClass);
    }

    container.append(row);
  }
}

function renderActivity(activity) {
  const list = getElement(ids.activityList);
  list.innerHTML = "";

  for (const event of activity) {
    const item = document.createElement("li");
    item.innerHTML = `
      <p class="activity-title"></p>
      <div class="activity-meta">
        <span></span>
        <span class="activity-time"></span>
      </div>
    `;

    item.querySelector(".activity-title").textContent = event.action;
    item.querySelector(".activity-meta span").textContent = event.actor;
    item.querySelector(".activity-time").textContent = event.time;

    list.append(item);
  }
}

function renderDashboard(data) {
  getElement(ids.cityName).textContent = data.city;
  getElement(ids.lastUpdated).textContent = new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date(data.generatedAt));

  renderMetrics(data.metrics);
  renderDistricts(data.districts);
  renderAlerts(data.alerts);
  renderBars(ids.mobilityBars, data.mobility, "traffic");
  renderBars(ids.energyBars, data.energy, "energy");
  renderActivity(data.activity);
}

async function loadDashboard() {
  try {
    const response = await fetch("/api/dashboard");

    if (!response.ok) {
      throw new Error(`Dashboard API returned ${response.status}`);
    }

    renderDashboard(await response.json());
  } catch (error) {
    getElement(ids.metricGrid).innerHTML = `<div class="error-state">${error.message}</div>`;
  }
}

loadDashboard();
