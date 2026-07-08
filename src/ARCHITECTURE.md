# Pulse AI Frontend Architecture

The frontend is organized around stable production boundaries. UI remains in `components`, page-level screens remain in `pages`, application shells live in `layouts`, shared state lives in `contexts` and `hooks`, backend-ready integrations live in `services`, and cross-cutting primitives live in `constants`, `types`, `utils`, and `assets`.

## Folder responsibilities

- `components`: reusable UI, auth, data, layout, background, and chat primitives.
- `pages`: route-level screens only.
- `layouts`: persistent application shells and navigation layouts.
- `routes`: route configuration, route transitions, and lazy page loading.
- `hooks`: reusable state and data-access hooks.
- `contexts`: provider implementations and app-level context state.
- `services`: API, auth, chat, notification, and user service boundaries.
- `constants`: route paths, query keys, mock data, and feature constants.
- `types`: shared TypeScript contracts.
- `utils`: framework-neutral helpers.
- `assets`: static asset entrypoint for future images, icons, and media.

## Route architecture

Routes are defined in `routes/routeConfig.tsx`, lazy imports are centralized in `routes/lazyPages.ts`, and the route transition wrapper is isolated in `routes/RouteTransition.tsx`. This keeps `AppRouter` small and keeps page code split by route.

## Import conventions

Prefer barrel exports for public folder APIs. Use direct file imports when it protects route-level code splitting or avoids pulling heavy feature modules into an initial chunk.
