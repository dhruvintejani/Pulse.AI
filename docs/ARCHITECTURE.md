# Architecture

Pulse AI is organized as a production-style AI SaaS application with a React frontend, FastAPI backend, MongoDB database, Clerk authentication, and deployment configuration for Vercel, Render, and MongoDB Atlas.

## System overview

```text
Browser / PWA
  -> React + Vite frontend
  -> Clerk session + JWT
  -> FastAPI API gateway
  -> Service layer
  -> Beanie ODM models
  -> MongoDB Atlas
```

The frontend owns the product experience: landing page, auth screens, dashboard, AI chat, documents, analytics, admin UI, search, settings, notifications, error states, command palette, PWA shell, and design system.

The backend owns API security, Clerk JWT verification, user synchronization, MongoDB persistence, pagination, search, rate limiting, request validation, logging, and provider abstractions for future AI integrations.

## Frontend architecture

```text
src/
├── assets/              Static frontend assets
├── components/          Reusable product and design-system components
│   ├── auth/            Auth guards, auth loading, auth alerts
│   ├── backgrounds/     Visual background systems
│   ├── chat/            Chat bubbles, streaming, code blocks, attachments
│   ├── common/          Error boundary, SEO, route loading, route announcements
│   ├── dashboard/       Dashboard panels and stat primitives
│   ├── data/            Data table components
│   ├── documents/       Document cards, upload, preview, delete dialogs
│   ├── errors/          Professional 404, 500, offline illustrations and shells
│   ├── experience/      Command palette, install prompt, shortcuts, cursor layer
│   ├── layout/          Navigation and dashboard shell pieces
│   ├── profile/         Profile modal and profile surface components
│   ├── search/          Global search UI
│   └── ui/              Design-system primitives
├── config/              Environment configuration
├── constants/           Routes, mock data, query keys, dashboard data
├── contexts/            Providers for theme, sidebar, user, undo, confirmation
├── hooks/               Shared UI and API hooks
├── layouts/             App layout shells
├── lib/                 Motion tokens, query client, error logging, utilities
├── pages/               Route-level pages
├── routes/              Lazy loading, route config, transitions, focus manager
├── services/            API client, chat, documents, notifications, settings
├── styles/              Design system, theme, responsive, polish, animations
├── types/               Shared TypeScript domain types
└── utils/               Class merging, validation, service worker registration
```

### Frontend principles

- Route-level lazy loading keeps the initial bundle focused.
- Design tokens and reusable primitives prevent visual drift.
- Global providers centralize theme, auth, query, sidebar, toast, confirmation, and undo behavior.
- Route transitions and reduced-motion handling keep animations polished without harming accessibility.
- SEO metadata is updated per route while private dashboard pages remain `noindex`.
- PWA registration is production-only, with offline shell caching and install support.

## Backend architecture

```text
backend/
├── app/
│   ├── api/v1/          Versioned API router and endpoint modules
│   ├── core/            Settings, security, rate limiting, logging
│   ├── db/              MongoDB connection and Beanie initialization
│   ├── dependencies/    Auth, admin authorization, pagination dependencies
│   ├── middleware/      Logging, errors, security headers, sanitization, size limits
│   ├── models/          Beanie document models
│   ├── schemas/         Pydantic request/response schemas
│   ├── services/        Business and orchestration layer
│   ├── providers/       AI provider interface and provider adapters
│   └── utils/           Shared backend helpers
├── tests/               Pytest coverage for API contracts
├── Dockerfile           Render-ready API container
├── docker-compose.yml   Local MongoDB + API workflow
└── requirements.txt     Python dependencies
```

### Backend principles

- FastAPI app creation lives in `create_application()` for testability.
- All API routes are mounted under `/api/v1`.
- Clerk is the only authentication provider; the backend verifies Clerk JWTs and syncs user profiles.
- Services keep endpoint functions thin and focused on request/response concerns.
- Beanie models define indexes, timestamps, soft delete fields, and relationships.
- Global middleware handles request logging, rate limiting, security headers, input sanitization, and request size limits.

## Data model relationships

```text
User
  ├── Conversations
  │     └── Messages
  ├── Documents
  │     └── Folders
  ├── Notifications
  ├── Settings
  └── Feedback
```

All user-owned resources should be scoped by the authenticated MongoDB user profile that is synchronized from the Clerk user ID.

## API boundaries

The frontend should not know which AI provider is being used. It calls Pulse AI API routes, and the backend routes messages through a provider abstraction that can support OpenAI, Gemini, Claude, Groq, and DeepSeek without changing frontend contracts.

## Reliability and security

- API versioning supports future breaking changes.
- Rate limiting protects public and authenticated routes.
- CORS is environment-driven.
- Security headers are enabled in production.
- Request validation is handled through Pydantic v2 schemas.
- Input sanitization blocks suspicious payloads before endpoint execution.
- Logs are structured with Loguru and ready for aggregation.
- Error responses are normalized through global exception handlers.

## Deployment topology

```text
Vercel
  hosts the Vite frontend and static PWA assets

Render
  hosts the Dockerized FastAPI backend

MongoDB Atlas
  stores users, chats, messages, documents, folders, notifications, settings, feedback, and logs

Clerk
  manages authentication and issues JWTs for protected API routes
```
