# CI/CD Guide

Pulse AI uses GitHub Actions for frontend quality gates, backend quality gates, production build verification, deployment triggers, and dependency update automation.

## Workflows

```text
.github/workflows/ci.yml
.github/workflows/deploy.yml
.github/dependabot.yml
.github/pull_request_template.md
```

## CI workflow

The CI workflow runs on every pull request to `main` and every push to `main`.

Frontend quality gate:

```bash
npm install
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build:production
```

Backend quality gate:

```bash
cd backend
python -m pip install --upgrade pip
pip install -r requirements.txt
python -m ruff check .
pytest
```

The frontend production build is uploaded as a short-lived GitHub Actions artifact named `pulse-ai-frontend-dist`.

## Deployment workflow

The deployment workflow can run in two ways:

- Automatically after the `CI` workflow succeeds on `main`.
- Manually through `workflow_dispatch` from the GitHub Actions tab.

The workflow verifies a production frontend build before deployment. It deploys the frontend to Vercel when Vercel secrets are configured and triggers a Render backend deploy when the Render deploy hook secret is configured.

## Required GitHub secrets

### Vercel deployment

```text
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

### Render deployment

```text
RENDER_DEPLOY_HOOK_URL
```

### Frontend production environment

```text
VITE_CLERK_PUBLISHABLE_KEY
VITE_CLERK_JWT_TEMPLATE
VITE_API_BASE_URL
VITE_ADMIN_EMAILS
VITE_SITE_URL
VITE_ERROR_LOG_ENDPOINT
```

Only `VITE_CLERK_PUBLISHABLE_KEY`, `VITE_API_BASE_URL`, and `VITE_SITE_URL` are normally required for production. The other values can stay empty unless the project uses those features.

## Backend production environment

Backend production variables should be configured in Render, not GitHub Actions, unless a future workflow directly deploys a container image.

Important Render variables:

```text
ENVIRONMENT
DEBUG
MONGODB_URI
MONGODB_DB_NAME
BACKEND_CORS_ORIGINS
SECURITY_ALLOWED_HOSTS
CLERK_ISSUER
CLERK_JWKS_URL
CLERK_AUTHORIZED_PARTIES
CLERK_SECRET_KEY
ADMIN_EMAILS
INTERNAL_JWT_SECRET
```

## Dependency automation

Dependabot is configured for:

- npm dependencies at the repository root.
- pip dependencies inside `backend`.
- GitHub Actions versions.

It opens weekly pull requests with dependency updates so CI can verify the project still builds and tests correctly.

## Local commands matching CI

Frontend:

```bash
npm install
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build:production
```

Backend:

```bash
cd backend
pip install -r requirements.txt
python -m ruff check .
pytest
```

## Release checklist

Before merging to `main`:

- CI passes.
- Pull request checklist is complete.
- Environment values are configured in Vercel and Render.
- Clerk authorized parties include the production frontend domain.
- Render health check path is `/api/v1/health`.
- MongoDB Atlas readiness check passes after deployment.
- Browser console is clear on the deployed frontend.
