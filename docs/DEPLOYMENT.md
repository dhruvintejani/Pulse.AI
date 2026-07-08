# Pulse AI Deployment Guide

This guide prepares Pulse AI for a production-style deployment with:

- Frontend on Vercel
- Backend on Render
- Database on MongoDB Atlas
- Authentication through Clerk
- Production environment variables
- Health checks and deployment validation

## 1. Deployment architecture

```text
User Browser
  -> Vercel Frontend
  -> Render FastAPI Backend
  -> MongoDB Atlas
  -> Clerk JWT Verification
```

Frontend URL example:

```text
https://pulse-ai.vercel.app
```

Backend URL example:

```text
https://pulse-ai-api.onrender.com
```

API root:

```text
https://pulse-ai-api.onrender.com/api/v1
```

Health check:

```text
https://pulse-ai-api.onrender.com/api/v1/health
```

Readiness check:

```text
https://pulse-ai-api.onrender.com/api/v1/health/ready
```

## 2. MongoDB Atlas setup

1. Create a MongoDB Atlas project.
2. Create a cluster.
3. Create a database user with a strong password.
4. Add network access for Render.
   - For easiest initial deployment, use `0.0.0.0/0`.
   - For stricter production hardening, restrict access to your Render outbound IPs when available.
5. Copy the application connection string.
6. Use it for `MONGODB_URI` in Render.

Example:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/pulse_ai?retryWrites=true&w=majority
MONGODB_DB_NAME=pulse_ai
```

## 3. Clerk production setup

Pulse AI uses Clerk as the only authentication provider.

Set these values in Render:

```env
CLERK_ISSUER=https://your-clerk-domain.clerk.accounts.dev
CLERK_JWKS_URL=https://your-clerk-domain.clerk.accounts.dev/.well-known/jwks.json
CLERK_AUTHORIZED_PARTIES=https://pulse-ai.vercel.app
CLERK_SECRET_KEY=your_clerk_secret_key
```

Set this value in Vercel:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

If you use a Clerk JWT template, set the same template name in Vercel:

```env
VITE_CLERK_JWT_TEMPLATE=your_template_name
```

## 4. Deploy backend to Render

The repository includes `render.yaml` for Blueprint deployment.

Render configuration:

```text
Runtime: Docker
Dockerfile: ./backend/Dockerfile
Docker context: ./backend
Health check path: /api/v1/health
```

Production start command is handled inside the Dockerfile:

```bash
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --proxy-headers --forwarded-allow-ips='*'
```

### Required Render environment variables

```env
ENVIRONMENT=production
DEBUG=false
APP_NAME=Pulse AI API
APP_VERSION=1.0.0
API_V1_PREFIX=/api/v1

MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/pulse_ai?retryWrites=true&w=majority
MONGODB_DB_NAME=pulse_ai
MONGODB_SERVER_SELECTION_TIMEOUT_MS=5000

BACKEND_CORS_ORIGINS=https://pulse-ai.vercel.app
BACKEND_CORS_ALLOW_CREDENTIALS=true
BACKEND_CORS_ALLOW_METHODS=GET,POST,PUT,PATCH,DELETE,OPTIONS
BACKEND_CORS_ALLOW_HEADERS=Authorization,Content-Type,X-Request-ID,X-CSRF-Token
BACKEND_CORS_EXPOSE_HEADERS=X-Request-ID,X-Process-Time-Ms

SECURITY_ALLOWED_HOSTS=pulse-ai-api.onrender.com
SECURITY_HEADERS_ENABLED=true
SECURITY_ENABLE_HSTS=true
SECURITY_MAX_REQUEST_SIZE_BYTES=2097152
SECURITY_INPUT_SANITIZATION_ENABLED=true
SECURITY_BLOCK_SUSPICIOUS_INPUT=true

CLERK_ISSUER=https://your-clerk-domain.clerk.accounts.dev
CLERK_JWKS_URL=https://your-clerk-domain.clerk.accounts.dev/.well-known/jwks.json
CLERK_AUTHORIZED_PARTIES=https://pulse-ai.vercel.app
CLERK_SECRET_KEY=your_clerk_secret_key

ADMIN_EMAILS=admin@example.com
INTERNAL_JWT_SECRET=replace-with-a-long-random-secret
```

Optional provider keys can stay empty until real AI providers are enabled:

```env
AI_DEFAULT_PROVIDER=mock
AI_ENABLED_PROVIDERS=mock,openai,gemini,claude,groq,deepseek
OPENAI_API_KEY=
GEMINI_API_KEY=
CLAUDE_API_KEY=
GROQ_API_KEY=
DEEPSEEK_API_KEY=
```

## 5. Deploy frontend to Vercel

The repository includes `vercel.json` for Vite deployment.

Vercel settings:

```text
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

Required Vercel environment variables:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CLERK_JWT_TEMPLATE=
VITE_API_BASE_URL=https://pulse-ai-api.onrender.com
VITE_API_VERSION=v1
VITE_API_PREFIX=/api/v1
VITE_API_TIMEOUT_MS=30000
VITE_API_RETRY_COUNT=1
VITE_API_WITH_CREDENTIALS=false
VITE_ADMIN_EMAILS=admin@example.com
VITE_APP_ENV=production
VITE_ENABLE_SOURCEMAPS=false
```

After Vercel gives you the final production domain, update Render:

```env
BACKEND_CORS_ORIGINS=https://your-final-vercel-domain.vercel.app
CLERK_AUTHORIZED_PARTIES=https://your-final-vercel-domain.vercel.app
```

If Render gives you a custom backend domain, update Vercel:

```env
VITE_API_BASE_URL=https://your-final-render-domain.onrender.com
```

## 6. Health checks

Frontend smoke check:

```text
Open the Vercel URL and verify the landing page loads.
```

Backend health check:

```bash
curl https://pulse-ai-api.onrender.com/api/v1/health
```

Backend database readiness check:

```bash
curl https://pulse-ai-api.onrender.com/api/v1/health/ready
```

Expected health response:

```json
{
  "status": "ok",
  "service": "Pulse AI API",
  "version": "1.0.0",
  "environment": "production"
}
```

Expected readiness response after MongoDB Atlas is connected:

```json
{
  "status": "ready",
  "database": "connected"
}
```

## 7. Production verification checklist

Before sharing the portfolio link:

- Vercel build succeeds.
- Render deploy succeeds.
- `/api/v1/health` returns `200`.
- `/api/v1/health/ready` returns `200` after MongoDB Atlas is connected.
- Clerk login/signup works from the Vercel domain.
- Render CORS allows the final Vercel domain.
- Clerk authorized parties include the final Vercel domain.
- MongoDB Atlas contains created user profiles after login.
- Browser console has no CORS errors.
- API requests include `Authorization: Bearer <Clerk token>`.
- Admin emails are configured for admin panel access.

## 8. Build optimization notes

Frontend deployment is optimized with:

- Vite production build
- Manual vendor chunk splitting
- CSS code splitting
- Esbuild minification
- Console/debugger removal in production
- Immutable caching for hashed assets through Vercel headers
- SPA rewrites for React Router routes
- Optional source maps through `VITE_ENABLE_SOURCEMAPS`

Backend deployment is optimized with:

- Python 3.13 slim Docker image
- Non-root container user
- Render `$PORT` support
- Proxy header support
- Production docs disabled
- Loguru JSON logging support
- Request size limit
- Security headers
- Rate limiting
- Strict CORS environment configuration

## 9. Common deployment fixes

### CORS error in browser

Update Render:

```env
BACKEND_CORS_ORIGINS=https://your-vercel-domain.vercel.app
CLERK_AUTHORIZED_PARTIES=https://your-vercel-domain.vercel.app
```

Redeploy backend.

### Backend health works but readiness fails

Check:

```env
MONGODB_URI
MONGODB_DB_NAME
```

Also verify MongoDB Atlas network access and database user credentials.

### Clerk token rejected

Check:

```env
CLERK_ISSUER
CLERK_JWKS_URL
CLERK_AUTHORIZED_PARTIES
VITE_CLERK_PUBLISHABLE_KEY
VITE_CLERK_JWT_TEMPLATE
```

### Render deploy starts but app is unreachable

Verify the Dockerfile command uses Render's dynamic `$PORT`:

```bash
--port ${PORT:-8000}
```

## 10. Local production test

Frontend:

```bash
npm install
npm run build
npm run preview
```

Backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.production.example .env
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Docker backend:

```bash
cd backend
docker build -t pulse-ai-api .
docker run --env-file .env -p 8000:8000 pulse-ai-api
```
