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
CLERK_SECRET_KEY=
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

GET /api/v1/documents
POST /api/v1/documents/upload
GET /api/v1/documents/recent
GET /api/v1/documents/categories
GET /api/v1/documents/tags
GET /api/v1/documents/{document_id}
GET /api/v1/documents/{document_id}/preview
PATCH /api/v1/documents/{document_id}
DELETE /api/v1/documents/{document_id}
PATCH /api/v1/documents/{document_id}/rename
PATCH /api/v1/documents/{document_id}/move
```

## Document storage

Document uploads currently store metadata in MongoDB and route through a storage provider abstraction.

```env
DOCUMENT_STORAGE_PROVIDER=metadata
DOCUMENT_MAX_UPLOAD_SIZE_MB=25
DOCUMENT_PREVIEW_MAX_CHARS=5000
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=pulse-ai/documents
```

Cloudinary is prepared as a provider behind the storage interface so upload routes do not need to change when Cloudinary transport is added.

## AI providers

The frontend does not select or know the AI provider. It calls the common conversation/message/stream endpoints, and the backend selects the configured provider through the provider registry.

```env
AI_DEFAULT_PROVIDER=mock
AI_ENABLED_PROVIDERS=mock,openai,gemini,claude,groq,deepseek
OPENAI_API_KEY=
GEMINI_API_KEY=
CLAUDE_API_KEY=
GROQ_API_KEY=
DEEPSEEK_API_KEY=
```

The backend includes a common `AIProvider` interface and registry for OpenAI, Gemini, Claude, Groq, and DeepSeek. Real provider transports are isolated behind the provider layer, so chat routes and frontend contracts do not hardcode provider-specific logic.

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
  storage
  utils
```

The backend now includes architecture, MongoDB setup, ODM models, validation, indexes, soft delete, pagination/search utilities, middleware, Clerk auth integration, protected route dependencies, AI chat CRUD, document CRUD/upload/preview/search, streaming response scaffolding, typing status, provider abstraction, document storage abstraction, error handling, rate limiting, logging, CORS, and Docker support.
