# SmartCity Dashboard

Node.js dashboard scaffold for the SmartCity Magdeburg hackathon project.

## Run Locally

```powershell
npm install
npm run dev
```

The app listens on `http://localhost:8080`.

## Docker

```powershell
docker build -t smartcity-dashboard .
docker run --rm -p 8080:8080 smartcity-dashboard
```

The project is configured to expose and serve port `8080` in Docker.
