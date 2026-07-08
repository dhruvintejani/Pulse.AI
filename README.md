# Pulse AI

Pulse AI is a production-ready AI SaaS portfolio application with a Vite React frontend and a FastAPI backend.

## Stack

Frontend:

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Clerk
- TanStack Query
- Axios
- Framer Motion
- Recharts
- Reusable design system primitives
- WCAG-oriented accessibility patterns

Backend:

- Python 3.13
- FastAPI
- Uvicorn
- Pydantic v2
- MongoDB Atlas
- Motor
- Beanie ODM
- Clerk JWT verification
- SlowAPI rate limiting
- Loguru logging
- Docker

Deployment:

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Quick start

Frontend:

```bash
npm install
cp .env.example .env.local
npm run dev
```

Backend:

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Windows backend:

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

## Design system

Reusable UI primitives live in `src/components/ui`, and design tokens live in `src/styles/design-system.css`.

Core primitives include Button, Input, Card, Dialog, Dropdown, Badge, Avatar, Alert, Toast, Table, Tabs, Accordion, Tooltip, Progress, Skeleton, EmptyState, IconButton, VisuallyHidden, and OptimizedImage.

Read the full design system guide:

```text
docs/DESIGN_SYSTEM.md
```

Read the accessibility audit checklist:

```text
docs/ACCESSIBILITY_AUDIT.md
```

## Frontend environment variables

Use `.env.example` for local development and `.env.production.example` for Vercel.

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CLERK_JWT_TEMPLATE=
VITE_API_BASE_URL=http://localhost:8000
VITE_API_VERSION=v1
VITE_API_PREFIX=/api/v1
VITE_API_TIMEOUT_MS=30000
VITE_API_RETRY_COUNT=1
VITE_API_WITH_CREDENTIALS=false
VITE_ADMIN_EMAILS=admin@example.com
VITE_APP_ENV=development
VITE_ENABLE_SOURCEMAPS=false
```

## Backend environment variables

Use `backend/.env.example` for local development and `backend/.env.production.example` for Render.

Required production values:

```env
ENVIRONMENT=production
DEBUG=false
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/pulse_ai?retryWrites=true&w=majority
BACKEND_CORS_ORIGINS=https://your-vercel-domain.vercel.app
SECURITY_ALLOWED_HOSTS=your-render-domain.onrender.com
CLERK_ISSUER=https://your-clerk-domain.clerk.accounts.dev
CLERK_JWKS_URL=https://your-clerk-domain.clerk.accounts.dev/.well-known/jwks.json
CLERK_AUTHORIZED_PARTIES=https://your-vercel-domain.vercel.app
CLERK_SECRET_KEY=your_clerk_secret_key
INTERNAL_JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAILS=admin@example.com
```

## Deployment

This repository is prepared for deployment with:

- `vercel.json` for the frontend.
- `render.yaml` for the backend.
- `backend/Dockerfile` for Render Docker deployment.
- `backend/.env.production.example` for backend production configuration.
- `.env.production.example` for frontend production configuration.
- `docs/DEPLOYMENT.md` for the complete deployment guide.

### Vercel frontend

Vercel settings:

```text
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

Set production environment variables from `.env.production.example`.

### Render backend

Render settings:

```text
Runtime: Docker
Dockerfile Path: ./backend/Dockerfile
Docker Context: ./backend
Health Check Path: /api/v1/health
```

Set production environment variables from `backend/.env.production.example` or use the included `render.yaml` blueprint.

### MongoDB Atlas

Create an Atlas cluster, database user, and network access rule. Add the MongoDB Atlas connection string to Render as `MONGODB_URI`.

## Health checks

Backend health:

```bash
curl https://your-render-domain.onrender.com/api/v1/health
```

Backend readiness:

```bash
curl https://your-render-domain.onrender.com/api/v1/health/ready
```

Local backend health:

```bash
curl http://localhost:8000/api/v1/health
```

## Production build

Frontend:

```bash
npm run build
```

Backend Docker:

```bash
cd backend
docker build -t pulse-ai-api .
docker run --env-file .env -p 8000:8000 pulse-ai-api
```

## Tests

Backend:

```bash
cd backend
pytest
```

Frontend type check:

```bash
npm run typecheck
```

## Production features

Frontend:

- Design system tokens and reusable primitives.
- Accessible dialogs, dropdowns, tabs, accordions, forms, toasts, progress bars, and tables.
- SPA routing configured for Vercel.
- Static asset caching for hashed files.
- Vendor chunk splitting.
- CSS code splitting.
- Production minification.
- Optional source maps.

Backend:

- Rate limiting.
- CORS configuration.
- Security headers.
- Trusted host protection.
- Request size limits.
- Input sanitization.
- Clerk JWT API protection.
- MongoDB Atlas support.
- Health and readiness endpoints.
- Loguru production logging.
- Docker-ready Render deployment.

## Important files

```text
vercel.json
render.yaml
.env.example
.env.production.example
backend/.env.example
backend/.env.production.example
backend/Dockerfile
backend/docker-compose.yml
docs/DEPLOYMENT.md
docs/DESIGN_SYSTEM.md
docs/ACCESSIBILITY_AUDIT.md
```
