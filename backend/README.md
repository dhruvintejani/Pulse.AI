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

## Tests

```bash
cd backend
pytest
```

The test suite uses Pytest, FastAPI TestClient, dependency overrides, and mocked services so backend API behavior can be tested without a live MongoDB instance.

## Docker

```bash
cd backend
cp .env.example .env
docker compose up --build
```

## Clerk setup

Pulse AI uses Clerk as the only authentication provider.

```env
CLERK_ISSUER=https://your-clerk-domain.clerk.accounts.dev
CLERK_JWKS_URL=https://your-clerk-domain.clerk.accounts.dev/.well-known/jwks.json
CLERK_AUDIENCE=
CLERK_AUTHORIZED_PARTIES=http://localhost:5173,http://localhost:3000
CLERK_SECRET_KEY=
ADMIN_EMAILS=admin@example.com
ADMIN_CLERK_USER_IDS=
```

Protected endpoints expect:

```http
Authorization: Bearer <clerk_jwt>
```

The API verifies the Clerk JWT, resolves the Clerk user ID, creates the MongoDB user profile on first authenticated request, keeps `clerk_user_id` synchronized with MongoDB, and promotes users listed in `ADMIN_EMAILS` or `ADMIN_CLERK_USER_IDS` to owner role.

## Security

Pulse AI includes rate limiting, strict CORS configuration, trusted host protection, request body size limits, security headers, suspicious input rejection, Pydantic request validation, Clerk passwordless authentication, and protected API dependencies.

```env
RATE_LIMIT_DEFAULT=120/minute
RATE_LIMIT_STORAGE_URI=memory://
BACKEND_CORS_ORIGINS=http://localhost:5173,http://localhost:3000
SECURITY_ALLOWED_HOSTS=*
SECURITY_HEADERS_ENABLED=true
SECURITY_ENABLE_HSTS=false
SECURITY_MAX_REQUEST_SIZE_BYTES=2097152
SECURITY_INPUT_SANITIZATION_ENABLED=true
```

In production, configure explicit CORS origins, explicit trusted hosts, Clerk issuer/JWKS values, and HSTS after HTTPS is enabled.

## Endpoints

```text
GET /api/v1/health
GET /api/v1/health/ready
GET /api/v1/auth/me
GET /api/v1/users/me

GET /api/v1/search
GET /api/v1/search/filters

GET /api/v1/settings/me
PATCH /api/v1/settings/me
GET /api/v1/settings/me/recent-searches
POST /api/v1/settings/me/recent-searches
DELETE /api/v1/settings/me/recent-searches

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

POST /api/v1/uploads
POST /api/v1/uploads/validate
GET /api/v1/uploads/{upload_id}/progress

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

GET /api/v1/dashboard/overview
GET /api/v1/dashboard/recent-chats
GET /api/v1/dashboard/recent-documents
GET /api/v1/dashboard/user-statistics
GET /api/v1/dashboard/ai-usage
GET /api/v1/dashboard/notifications
GET /api/v1/dashboard/activity-timeline
GET /api/v1/dashboard/charts
GET /api/v1/dashboard/search

GET /api/v1/notifications
POST /api/v1/notifications
GET /api/v1/notifications/unread-count
GET /api/v1/notifications/categories
GET /api/v1/notifications/preferences
PATCH /api/v1/notifications/preferences
POST /api/v1/notifications/mark-all-read
DELETE /api/v1/notifications/clear-all
GET /api/v1/notifications/stream
PATCH /api/v1/notifications/{notification_id}
PATCH /api/v1/notifications/{notification_id}/read
PATCH /api/v1/notifications/{notification_id}/unread
DELETE /api/v1/notifications/{notification_id}

GET /api/v1/admin/dashboard
GET /api/v1/admin/users
PATCH /api/v1/admin/users/{user_id}
DELETE /api/v1/admin/users/{user_id}
GET /api/v1/admin/chats
GET /api/v1/admin/documents
GET /api/v1/admin/analytics
GET /api/v1/admin/system-logs
POST /api/v1/admin/system-logs
GET /api/v1/admin/feedback
PATCH /api/v1/admin/feedback/{feedback_id}
GET /api/v1/admin/notifications
POST /api/v1/admin/notifications/broadcast
GET /api/v1/admin/roles
POST /api/v1/admin/roles
GET /api/v1/admin/permissions
GET /api/v1/admin/settings
```

## Global search

Global search supports chats, messages, documents, users, and settings. It includes filters, pagination, highlighted snippets, and recent searches persisted in MongoDB user settings.

## User settings

User settings persist theme, language, timezone, notification preferences, profile settings, privacy settings, security settings, appearance settings, AI preferences, metadata, and recent searches in MongoDB.

## Logging

Loguru writes production logs to files under `LOG_DIR` with rotation, retention, and compression.

```env
LOG_LEVEL=INFO
LOG_JSON=false
LOG_DIR=logs
LOG_ROTATION=50 MB
LOG_RETENTION=30 days
LOG_COMPRESSION=zip
LOG_PERFORMANCE_THRESHOLD_MS=1000
```

Log files include `app.log`, `errors.log`, `warnings.log`, `requests.log`, `auth.log`, and `performance.log`.

## Upload module

The secure upload module supports PDF, DOCX, TXT, CSV, JPG, JPEG, PNG, GIF, and WEBP. It validates extension, MIME type, file signature, UTF-8 text compatibility, maximum size, unsafe file names, and blocked executable extensions. Upload responses return metadata only and include fields needed by the frontend for upload progress UI.

## Notification system

Notifications are stored in MongoDB and support unread count, read/unread state, delete, clear all, categories, notification preferences, and SSE real-time readiness through `/api/v1/notifications/stream`.

## Admin panel

The admin API is protected by `require_admin_user`. Only users with `owner` or `admin` role can access `/api/v1/admin/*`. Admin features include dashboard, users, chats, documents, analytics, system logs, feedback, notifications, roles, permissions, and settings.

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
tests/
```

The backend now includes architecture, MongoDB setup, ODM models, validation, indexes, soft delete, pagination/search utilities, middleware, Clerk auth integration, protected route dependencies, global search, user settings persistence, AI chat CRUD, document CRUD/upload/preview/search, secure metadata-only upload module, dashboard APIs, admin APIs, notification system, streaming response scaffolding, typing status, provider abstraction, document storage abstraction, production Loguru file logging, rate limiting, CORS, OWASP-style security protections, and Docker support.
