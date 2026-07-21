# AI News Intelligence System

A production-ready AI-powered news intelligence platform with a React frontend and a FastAPI backend for category prediction, sentiment analysis, and news volume forecasting.

## Architecture

React → FastAPI → Model Loader → CNN/BiLSTM/LSTM Forecast

## Features

- Responsive dashboard and analysis experience
- Real inference endpoints for category and sentiment prediction
- Forecast endpoint with persisted model artifacts and fallback-safe inference
- Health, version, and readiness monitoring endpoints
- Deployment-ready backend and frontend configuration

## Backend

### Requirements

- Python 3.10+
- Install dependencies from backend/requirements.txt

### Run locally

```bash
cd backend
pip install -r requirements.txt
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

### Deployment

The backend is ready to deploy on Render or Railway using the included Procfile.

## Frontend

### Run locally

```bash
cd frontend
npm install
npm run dev
```

### Build

```bash
npm run build
```

## API Overview

- GET /health
- GET /version
- GET /readyz
- GET /dashboard
- GET /forecast
- POST /predict

## Folder Structure

- backend/ - FastAPI application and ML modules
- frontend/ - React/Vite UI
- notebook/ - Training notebook kept separate from inference code
- model/ - Optional model storage
