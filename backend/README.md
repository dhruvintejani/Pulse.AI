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

On Windows:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

## Docker

```bash
cd backend
cp .env.example .env
docker compose up --build
```

## Clerk setup

Pulse AI uses Clerk as the only authentication provider.

Set these values in `.env`:

```env
CLERK_ISSUER=https://your-clerk-domain.clerk.accounts.dev
CLERK_JWKS_URL=https://your-clerk-domain.clerk.accounts.dev/.well-known/jwks.json
CLERK_AUDIENCE=
CLERK_AUTHORIZED_PARTIES=http://localhost:5173,http://localhost:3000
```

Protected endpoints expect:

```http
Authorization: Bearer <clerk_jwt>
```

The API verifies the Clerk JWT, resolves the Clerk user ID, creates the MongoDB user profile on first authenticated request, and keeps `clerk_user_id` synchronized with MongoDB.

## Endpoints

```text
GET /api/v1/health
GET /api/v1/health/ready
GET /api/v1/auth/me
GET /api/v1/users/me
GET /api/v1/ai/providers

GET /api/v1/conversations
POST /api/v1/conversations
GET /api/v1/conversations/{conversation_id}
PATCH /api/v1/conversations/{conversation_id}
DELETE /api/v1/conversations/{conversation_id}
PATCH /api/v1/conversations/{conversation_id}/rename
PATCH /api/v1/conversations/{conversation_id}/pin
PATCH /api/v1/conversations/{conversation_id}/favorite
GET /api/v1/conversations/{conversation_id}/messages
POST /api/v1/conversations/{conversation_id}/messages
GET /api/v1/conversations/{conversation_id}/messages/{message_id}
PATCH /api/v1/conversations/{conversation_id}/messages/{message_id}
DELETE /api/v1/conversations/{conversation_id}/messages/{message_id}
PATCH /api/v1/conversations/{conversation_id}/messages/{message_id}/reaction
POST /api/v1/conversations/{conversation_id}/messages/{message_id}/regenerate
POST /api/v1/conversations/{conversation_id}/stream
GET /api/v1/conversations/{conversation_id}/typing
POST /api/v1/conversations/{conversation_id}/typing
```

## AI providers

Provider selection is configuration-driven.

```env
AI_DEFAULT_PROVIDER=mock
AI_ENABLED_PROVIDERS=mock,openai,gemini,claude,groq,deepseek
OPENAI_API_KEY=
GEMINI_API_KEY=
CLAUDE_API_KEY=
GROQ_API_KEY=
DEEPSEEK_API_KEY=
```

The backend includes a provider abstraction and registry for OpenAI, Gemini, Claude, Groq, and DeepSeek. Real provider transports are intentionally isolated behind the provider layer, so chat routes do not hardcode provider-specific logic.

## Structure

```text
app/
  api/v1/endpoints
  core
  db
  dependencies
  middleware
  models
  providers
  repositories
  schemas
  services
  utils
```

The backend now includes architecture, MongoDB setup, ODM models, validation, indexes, soft delete, pagination/search utilities, middleware, Clerk auth integration, protected route dependencies, AI chat CRUD, streaming response scaffolding, typing status, provider abstraction, error handling, rate limiting, logging, CORS, and Docker support.
