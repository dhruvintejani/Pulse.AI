# Backend Guide

The Pulse AI backend is a FastAPI application built with Python 3.13+, Pydantic v2, Motor, Beanie ODM, Clerk JWT verification, SlowAPI rate limiting, Loguru logging, and Docker deployment support.

## Requirements

- Python 3.13+
- MongoDB Atlas or local MongoDB
- Clerk application
- Optional AI provider keys for OpenAI, Gemini, Claude, Groq, and DeepSeek

## Install and run

macOS / Linux:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Windows:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

The local backend runs on:

```text
http://localhost:8000
```

## API base path

```text
/api/v1
```

## Local health checks

```bash
curl http://localhost:8000/api/v1/health
curl http://localhost:8000/api/v1/health/ready
```

## Environment variables

Use `backend/.env.example` for development and `backend/.env.production.example` for Render.

Core variables:

```env
ENVIRONMENT=development
DEBUG=true
APP_NAME=Pulse AI API
APP_VERSION=1.0.0
API_V1_PREFIX=/api/v1

MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=pulse_ai

BACKEND_CORS_ORIGINS=http://localhost:5173
SECURITY_ALLOWED_HOSTS=localhost,127.0.0.1

CLERK_ISSUER=https://your-clerk-domain.clerk.accounts.dev
CLERK_JWKS_URL=https://your-clerk-domain.clerk.accounts.dev/.well-known/jwks.json
CLERK_AUTHORIZED_PARTIES=http://localhost:5173
CLERK_SECRET_KEY=sk_test_or_sk_live_value

ADMIN_EMAILS=admin@your-domain.com
INTERNAL_JWT_SECRET=use-a-long-random-secret
```

AI provider keys can stay empty until real provider calls are enabled:

```env
AI_DEFAULT_PROVIDER=mock
AI_ENABLED_PROVIDERS=mock,openai,gemini,claude,groq,deepseek
OPENAI_API_KEY=
GEMINI_API_KEY=
CLAUDE_API_KEY=
GROQ_API_KEY=
DEEPSEEK_API_KEY=
```

## Application startup

`backend/app/main.py` creates the FastAPI application, configures middleware, registers exception handlers, initializes MongoDB, and mounts the versioned API router.

Startup flow:

```text
configure logging
initialize MongoDB and Beanie models
register middleware
register exception handlers
mount /api/v1 router
serve health endpoints
```

## Auth model

Clerk is the only authentication provider.

Backend responsibilities:

- Verify Clerk JWTs.
- Reject invalid or expired tokens.
- Synchronize Clerk user ID with MongoDB user profile.
- Create the MongoDB user profile on first authenticated request.
- Scope user-owned resources by MongoDB user ID.

Do not add password login, refresh tokens, or a separate auth database.

## API modules

```text
app/api/v1/endpoints/auth.py            Authenticated user profile
app/api/v1/endpoints/users.py           Current MongoDB user profile
app/api/v1/endpoints/conversations.py   Conversation and message APIs
app/api/v1/endpoints/documents.py       Documents, categories, tags, preview, move, rename
app/api/v1/endpoints/uploads.py         Secure metadata-only upload module
app/api/v1/endpoints/dashboard.py       Overview, charts, recent resources, timeline
app/api/v1/endpoints/notifications.py   Notification center and preferences
app/api/v1/endpoints/search.py          Global search and filters
app/api/v1/endpoints/settings.py        User settings and recent searches
app/api/v1/endpoints/admin.py           Admin-only users, logs, feedback, roles, settings
app/api/v1/endpoints/health.py          Health and readiness checks
```

## Database model standards

Every user-owned model should include:

- `created_at`
- `updated_at`
- `deleted_at`
- `is_deleted`
- Owner/user relationship
- Searchable text fields where needed
- Indexes for owner, status, updated time, soft delete, and search queries
- Pydantic validation at the schema boundary

## Pagination and search

List endpoints should accept pagination dependencies and return a typed page response.

Standard query shape:

```text
page=1
size=10
q=keyword
status=active
category=research
```

Standard response shape:

```json
{
  "items": [],
  "page": 1,
  "size": 10,
  "total": 0,
  "pages": 0
}
```

## Error handling

Global exception handlers should normalize:

- Validation errors
- Authentication errors
- Authorization errors
- Not found errors
- Rate limit errors
- Request size errors
- Unexpected server errors

Responses should be friendly enough for the frontend to display and structured enough for logs and monitoring.

## Logging

Loguru is used for application logs.

Recommended log categories:

- Requests
- Errors
- Warnings
- Authentication events
- Admin actions
- Performance timings
- Provider calls
- Upload validation

Logs are file-ready and can later be shipped to an external observability provider.

## Tests

Run backend tests:

```bash
cd backend
pytest
```

Recommended coverage areas:

- Health checks
- Clerk auth dependency behavior
- Conversation CRUD
- Message CRUD
- Documents
- Upload validation
- Search
- Notifications
- Dashboard APIs
- Admin authorization
- Error handling

## Docker

Build locally:

```bash
cd backend
docker build -t pulse-ai-api .
docker run --env-file .env -p 8000:8000 pulse-ai-api
```

Docker Compose workflow:

```bash
cd backend
docker compose up --build
```

## Production checklist

- `ENVIRONMENT=production`
- `DEBUG=false`
- Render health path points to `/api/v1/health`
- MongoDB Atlas URI is configured
- CORS allows the final Vercel domain
- Clerk authorized parties include the final Vercel domain
- Admin emails are set
- Internal JWT secret is long and unique
- Security headers are enabled
- Request size limits are enabled
- Logs are persisted or exported
