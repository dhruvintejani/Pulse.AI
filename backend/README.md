# Pulse AI Backend

Production-ready FastAPI backend foundation for Pulse AI.

## Run locally

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

## Docker

```bash
cd backend
cp .env.example .env
docker compose up --build
```

## Endpoints

```text
GET /api/v1/health
GET /api/v1/health/ready
```

## Structure

```text
app/
  api/v1/endpoints
  core
  db
  models
  schemas
  middleware
  repositories
  services
  dependencies
  utils
```

Business logic is intentionally not implemented yet. The backend includes architecture, MongoDB setup, ODM models, validation, indexes, soft delete, pagination/search utilities, middleware, error handling, rate limiting, logging, CORS, and Docker support.
