# Deployment Guide

Pulse AI is prepared for a portfolio-grade production deployment with Vercel for the frontend, Render for the FastAPI backend, MongoDB Atlas for persistence, and Clerk for authentication.

## Deployment architecture

```text
User Browser / PWA
  -> Vercel frontend
  -> Clerk session + JWT
  -> Render FastAPI backend
  -> MongoDB Atlas
```

## 1. Prerequisites

Create or prepare:

- Vercel project for the frontend.
- Render web service for the backend.
- MongoDB Atlas cluster.
- Clerk application.
- Clerk JWT template only if the project needs a named JWT template.
- Production frontend domain.
- Production backend domain.

## 2. Frontend deployment on Vercel

Vercel settings:

```text
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

Required frontend environment variables:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_live_value_from_clerk
VITE_CLERK_JWT_TEMPLATE=
VITE_API_BASE_URL=https://your-render-backend.onrender.com
VITE_API_VERSION=v1
VITE_API_PREFIX=/api/v1
VITE_API_TIMEOUT_MS=30000
VITE_API_RETRY_COUNT=1
VITE_API_WITH_CREDENTIALS=false
VITE_ADMIN_EMAILS=admin@your-domain.com
VITE_APP_ENV=production
VITE_ENABLE_SOURCEMAPS=false
VITE_SITE_URL=https://your-vercel-frontend.vercel.app
VITE_ERROR_LOG_ENDPOINT=
```

The repository includes `vercel.json` with SPA rewrites, static asset caching, service worker headers, manifest headers, and security headers.

## 3. Backend deployment on Render

Render settings:

```text
Runtime: Docker
Dockerfile Path: ./backend/Dockerfile
Docker Context: ./backend
Health Check Path: /api/v1/health
```

Required backend environment variables:

```env
ENVIRONMENT=production
DEBUG=false
APP_NAME=Pulse AI API
APP_VERSION=1.0.0
API_V1_PREFIX=/api/v1

MONGODB_URI=mongodb+srv://user:password@cluster-url/pulse_ai?retryWrites=true&w=majority
MONGODB_DB_NAME=pulse_ai
MONGODB_SERVER_SELECTION_TIMEOUT_MS=5000

BACKEND_CORS_ORIGINS=https://your-vercel-frontend.vercel.app
BACKEND_CORS_ALLOW_CREDENTIALS=true
BACKEND_CORS_ALLOW_METHODS=GET,POST,PUT,PATCH,DELETE,OPTIONS
BACKEND_CORS_ALLOW_HEADERS=Authorization,Content-Type,X-Request-ID,X-CSRF-Token
BACKEND_CORS_EXPOSE_HEADERS=X-Request-ID,X-Process-Time-Ms

SECURITY_ALLOWED_HOSTS=your-render-backend.onrender.com
SECURITY_HEADERS_ENABLED=true
SECURITY_ENABLE_HSTS=true
SECURITY_MAX_REQUEST_SIZE_BYTES=2097152
SECURITY_INPUT_SANITIZATION_ENABLED=true
SECURITY_BLOCK_SUSPICIOUS_INPUT=true

CLERK_ISSUER=https://your-clerk-domain.clerk.accounts.dev
CLERK_JWKS_URL=https://your-clerk-domain.clerk.accounts.dev/.well-known/jwks.json
CLERK_AUTHORIZED_PARTIES=https://your-vercel-frontend.vercel.app
CLERK_SECRET_KEY=sk_live_value_from_clerk

ADMIN_EMAILS=admin@your-domain.com
INTERNAL_JWT_SECRET=use-a-long-random-secret
```

Optional AI provider values:

```env
AI_DEFAULT_PROVIDER=mock
AI_ENABLED_PROVIDERS=mock,openai,gemini,claude,groq,deepseek
OPENAI_API_KEY=
GEMINI_API_KEY=
CLAUDE_API_KEY=
GROQ_API_KEY=
DEEPSEEK_API_KEY=
```

Keep provider keys empty until real provider calls are enabled. The frontend should not branch by provider.

## 4. MongoDB Atlas setup

1. Create a MongoDB Atlas project.
2. Create a cluster.
3. Create a database user with a strong password.
4. Add network access for Render.
5. Copy the Atlas connection string.
6. Set `MONGODB_URI` in Render.
7. Set `MONGODB_DB_NAME=pulse_ai`.

For a portfolio deployment, a broad initial network rule can be used temporarily. For production hardening, restrict network access to the backend provider's outbound IP strategy.

## 5. Clerk setup

Pulse AI uses Clerk as the only authentication provider.

Configure Clerk with:

- Frontend application URL.
- Allowed redirect URLs.
- Allowed origin for the deployed Vercel domain.
- JWT verification values for the backend.
- Authorized parties matching the deployed frontend domain.

Set the Clerk publishable key in Vercel and Clerk secret/JWKS values in Render.

## 6. Production validation

Frontend checks:

```bash
npm run typecheck
npm run build
npm run preview
```

Backend checks:

```bash
cd backend
pytest
```

Health checks after deployment:

```bash
curl https://your-render-backend.onrender.com/api/v1/health
curl https://your-render-backend.onrender.com/api/v1/health/ready
```

Expected liveness response:

```json
{
  "status": "ok",
  "service": "Pulse AI API",
  "version": "1.0.0",
  "environment": "production"
}
```

Expected readiness response after MongoDB connects:

```json
{
  "status": "ready",
  "database": "connected"
}
```

## 7. Post-deployment checklist

- Vercel build succeeds.
- Render deployment succeeds.
- `/api/v1/health` returns `200`.
- `/api/v1/health/ready` returns `200` after MongoDB Atlas is connected.
- Clerk login and signup work from the deployed frontend.
- Backend CORS allows only the final frontend domain.
- Clerk authorized parties include the final frontend domain.
- First login creates or syncs the MongoDB user profile.
- API requests include `Authorization: Bearer <Clerk token>`.
- Admin emails are configured.
- Browser console has no CORS, service worker, or route errors.
- Lighthouse validates SEO, accessibility, best practices, and PWA behavior.
- README screenshots render on GitHub.

## 8. Build optimization notes

The frontend already includes:

- Vite production build.
- Static asset caching headers.
- Service worker caching for the app shell.
- Route-level lazy loading.
- SEO metadata manager.
- PWA manifest.
- Responsive app shell.

Recommended next deployment improvement:

- Add GitHub Actions to run `npm run typecheck`, `npm run build`, and `pytest` on pull requests.
- Add Render/Vercel deployment badges after public deployment URLs are finalized.
- Add production screenshots captured from the deployed app.
