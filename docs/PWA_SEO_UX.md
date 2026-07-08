# Pulse AI PWA, SEO, and Premium UX Layer

## Premium UX added

Pulse AI now includes production-style interaction primitives and application behaviors:

- Undo action provider with animated undo cards.
- Global confirmation dialog provider.
- Optimistic notification actions with local undo.
- Context menu primitive for right-click actions.
- Command palette with keyboard navigation and route actions.
- Global keyboard shortcuts for quick route navigation.
- Drag-and-drop document upload and reorderable upload queue.
- Progress indicators for uploads and undo timers.
- Offline banner and install prompt.
- Better empty, loading, and error states through shared primitives.

## Keyboard shortcuts

- `Cmd/Ctrl + K`: Open command palette.
- `Cmd/Ctrl + J`: Toggle light/dark theme.
- `?`: Open command palette/help surface.
- `G` then `D`: Dashboard.
- `G` then `C`: Chat.
- `G` then `F`: Documents.
- `G` then `A`: Analytics.
- `G` then `N`: Notifications.
- `G` then `S`: Settings.
- `G` then `P`: Profile.

## PWA files

- `public/manifest.webmanifest`
- `public/sw.js`
- `public/offline.html`
- `public/pwa-icon.svg`
- `public/maskable-icon.svg`
- `public/og-image.svg`

## PWA behavior

The service worker uses:

- Cache-first for static assets.
- Network-first for navigations.
- Offline fallback for unavailable navigation requests.
- API requests are intentionally not intercepted so authenticated FastAPI calls remain fresh and secure.

The install prompt uses the browser `beforeinstallprompt` event and only appears when the browser determines the app is installable.

## SEO behavior

Dynamic SEO metadata is managed by:

```text
src/components/common/Seo.tsx
```

It updates:

- Page title.
- Meta description.
- Canonical URL.
- Robots meta.
- Open Graph tags.
- Twitter card tags.
- Schema.org structured data.

Public static SEO files:

- `public/robots.txt`
- `public/sitemap.xml`

Set this environment variable in production:

```env
VITE_SITE_URL=https://pulse-ai.vercel.app
```

## Lighthouse checklist

Before final deployment:

1. Run `npm run build`.
2. Deploy to Vercel.
3. Open the production URL in Chrome Lighthouse.
4. Test Performance, Accessibility, Best Practices, SEO, and PWA.
5. Confirm manifest is valid.
6. Confirm service worker is active.
7. Confirm canonical URL and Open Graph image use the final production domain.
8. Confirm dashboard/auth pages are `noindex` while marketing pages are indexable.
