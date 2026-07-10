# Frontend Guide

The Pulse AI frontend is a Vite + React + TypeScript application designed to look and feel like a polished AI SaaS product. It includes a reusable design system, route-level code splitting, dark mode, responsive layouts, premium motion, PWA support, SEO metadata, accessibility patterns, and frontend-only product interactions that can be wired to the FastAPI backend.

## Requirements

- Node.js 22+
- npm 10+
- Clerk publishable key
- Backend API URL for connected API flows

## Install and run

```bash
npm install
cp .env.example .env.local
npm run dev
```

The local frontend runs on:

```text
http://localhost:5173
```

## Environment variables

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_or_pk_live_value
VITE_CLERK_JWT_TEMPLATE=
VITE_API_BASE_URL=http://localhost:8000
VITE_API_VERSION=v1
VITE_API_PREFIX=/api/v1
VITE_API_TIMEOUT_MS=30000
VITE_API_RETRY_COUNT=1
VITE_API_WITH_CREDENTIALS=false
VITE_ADMIN_EMAILS=admin@your-domain.com
VITE_APP_ENV=development
VITE_ENABLE_SOURCEMAPS=false
VITE_SITE_URL=http://localhost:5173
VITE_ERROR_LOG_ENDPOINT=
```

Use `.env.production.example` as the production reference for Vercel.

## Important scripts

```bash
npm run dev
npm run typecheck
npm run build
npm run preview
```

## Routing

Routes are defined in `src/routes/routeConfig.tsx` and lazy-loaded from `src/routes/lazyPages.ts`.

Public routes:

- `/`
- `/login`
- `/signup`
- `/forgot-password`
- `/reset-password`
- `/verify`
- `/offline`
- `/500`

Protected dashboard routes:

- `/dashboard`
- `/dashboard/chat`
- `/dashboard/documents`
- `/dashboard/analytics`
- `/dashboard/workspace`
- `/dashboard/models`
- `/dashboard/notifications`
- `/dashboard/settings`
- `/dashboard/billing`
- `/dashboard/profile`
- `/dashboard/team`
- `/dashboard/admin`

Unknown routes render the professional 404 page.

## Design system

Core primitives live in `src/components/ui`.

Implemented primitives include:

- Button
- Input
- Card
- Dialog
- Dropdown
- ContextMenu
- DropZone
- Badge
- Avatar
- Alert
- Toast
- Table
- Tabs
- Accordion
- Tooltip
- Progress
- Skeleton
- EmptyState
- IconButton
- VisuallyHidden
- OptimizedImage

Design tokens live in:

```text
src/styles/design-system.css
src/styles/theme.css
src/styles/polish.css
src/styles/product-polish.css
src/styles/animation-system.css
src/styles/responsive.css
```

## Product experience systems

Global experience components are mounted in `src/App.tsx`:

- SEO metadata manager
- Global error handlers
- Route announcer
- Keyboard shortcuts
- Command palette
- Offline banner
- Install prompt
- Premium cursor layer
- Route app shell

## State and data patterns

- TanStack Query handles API cache orchestration.
- Clerk provides authenticated user session data.
- Context providers handle theme, sidebar, current user, confirmation dialogs, undo actions, and toasts.
- Domain services live in `src/services` and should be the only place where API transport details are handled.

## Accessibility standards

The frontend uses:

- Focus rings through design tokens
- Keyboard-accessible dialogs and menus
- Route focus management
- Screen reader route announcements
- Reduced-motion support
- Accessible empty states
- Semantic buttons and labels
- `aria-busy`, `aria-live`, `aria-modal`, and `aria-expanded` where appropriate

Run keyboard-only checks before sharing the portfolio:

```text
Tab through every primary flow.
Open and close modals with Escape.
Use Enter and Space on interactive cards and buttons.
Use Cmd/Ctrl + K for command palette navigation.
Verify reduced motion in OS accessibility settings.
```

## PWA behavior

The service worker is registered only in production builds. Static assets use cache-first behavior, navigation uses network-first behavior, and API calls are not intercepted so authenticated data stays fresh.

Files:

```text
public/manifest.webmanifest
public/sw.js
public/offline.html
public/pwa-icon.svg
public/maskable-icon.svg
```

## SEO behavior

Dynamic metadata is handled by `src/components/common/Seo.tsx`.

It updates:

- Title
- Description
- Canonical URL
- Robots meta
- Open Graph tags
- Twitter card tags
- Schema.org structured data

Dashboard and auth pages are `noindex`.

## Frontend quality checklist

Before a portfolio review:

- `npm run typecheck` passes.
- `npm run build` passes.
- No console errors during login, navigation, dashboard, chat, documents, and settings flows.
- Landing page has no fake customer claims or inactive footer actions.
- All empty states explain what to do next.
- Mobile dashboard does not horizontally overflow.
- Command palette works with keyboard navigation.
- Error pages render for unknown routes and recovery states.
- PWA manifest and service worker validate in Lighthouse.
