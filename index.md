# MagdePulse (SmartCity Magdeburg Dashboard)

## Overview
MagdePulse is a Node.js dashboard application created for the SmartCity Magdeburg hackathon. It visualizes and explores various data aspects of Magdeburg, including population, education, infrastructure, and health services.

## Architecture
- **Backend:** Node.js server using Express (`src/server.js`). It reads and parses data (from `src/data/` which contains logic and Excel datasets) and exposes an aggregated data API at `/api/dashboard`.
- **Frontend:** Vanilla HTML/CSS/JS (`public/index.html` and `public/app.js`). It fetches data from the backend API and visualizes it using:
  - **Chart.js** for charting trends (e.g., migration, demographics).
  - **Leaflet** for rendering map-based statistics across the statistical districts.

## Data Modules
The project organizes its data handling into specific topics:
- **Population:** Demographics, migration, life events, and age structures.
- **Infrastructure:** Housing stock, completions, and vacancy rates.
- **Health:** Health services distribution (e.g., doctors, dentists, pharmacies) per district.
- **Education:** Schools, student trends, district distribution, and university enrolment indicators.

## Setup and Running
The app can be run via npm or Docker.

**Local Execution:**
```bash
npm install
npm run dev
```

**Docker:**
```bash
docker build -t magdepulse .
docker run --rm -p 8080:8080 magdepulse
```
The application will be accessible at `http://localhost:8080`.
