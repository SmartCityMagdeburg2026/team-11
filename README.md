# MagdePulse

Node.js dashboard for exploring Magdeburg population data.

## Run Locally

```powershell
npm.cmd install
npm.cmd run dev
```

The app listens on `http://localhost:8080`.

## Docker

```powershell
docker build -t magdepulse .
docker run --rm -p 8080:8080 magdepulse
```

The project is configured to expose and serve port `8080` in Docker.
