# Pulse AI Frontend

<p align="center">
  <img src="public/pwa-icon.svg" alt="Pulse AI logo" width="92" height="92" />
</p>

<p align="center">
  <strong>Production-style React frontend for the Pulse AI SaaS workspace.</strong>
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=fff" />
  <img alt="Clerk" src="https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk&logoColor=fff" />
  <img alt="PWA" src="https://img.shields.io/badge/PWA-Offline_ready-5A0FC8?logo=pwa&logoColor=fff" />
  <img alt="License" src="https://img.shields.io/badge/License-MIT-111111" />
</p>

Pulse AI frontend is a polished AI SaaS interface with landing page, Clerk authentication, dashboard, AI chat UI, documents UI, analytics, global search, notifications, settings, profile, admin UI, PWA support, SEO metadata, accessibility patterns, and premium animations.

The backend is kept in a separate repository:

```text
https://github.com/dhruvintejani/Pulse.AI_backend
```

## Screenshots

![Pulse AI dashboard preview](docs/assets/dashboard-preview.svg)

![Pulse AI chat and documents preview](docs/assets/chat-documents-preview.svg)

## Frontend stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Clerk React
- TanStack Query
- Axios
- Framer Motion
- Recharts
- Lucide React
- ESLint
- Prettier
- Vitest
- PWA service worker

## Folder structure

```text
Pulse.AI/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── deploy.yml
│   ├── dependabot.yml
│   └── pull_request_template.md
├── docs/
├── public/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── layouts/
│   ├── lib/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── styles/
│   ├── test/
│   ├── types/
│   └── utils/
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── eslint.config.js
├── vercel.json
└── vitest.config.ts
```

## Quick start

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:5173
```

## Environment variables

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
VITE_SITE_URL=http://localhost:5173
VITE_ERROR_LOG_ENDPOINT=
```

## Commands

```bash
npm run dev
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run ci
```

## CI/CD

GitHub Actions runs frontend formatting checks, ESLint, TypeScript type checking, Vitest, and production build verification.

- CI workflow: `.github/workflows/ci.yml`
- Deployment workflow: `.github/workflows/deploy.yml`
- Dependency updates: `.github/dependabot.yml`

## Deployment

Frontend deployment is configured for Vercel with `vercel.json`.

Vercel settings:

```text
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

## Quality checklist

Before sharing the project:

- `npm run ci` passes.
- Auth pages render correctly.
- Dashboard routes are responsive.
- Unknown routes show the 404 page.
- Offline and 500 pages render correctly.
- Console is clear during core navigation.
- Environment files contain no real secrets.
- README screenshots load on GitHub.

## Documentation

- [Documentation index](docs/README.md)
- [Frontend guide](docs/FRONTEND_GUIDE.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Accessibility audit](docs/ACCESSIBILITY_AUDIT.md)
- [PWA, SEO, and UX guide](docs/PWA_SEO_UX.md)
- [Portfolio review](docs/PORTFOLIO_REVIEW.md)
- [Professional commit plan](docs/COMMIT_PLAN.md)
- [Contributing guide](CONTRIBUTING.md)

## License

Pulse AI frontend is released under the [MIT License](LICENSE).
