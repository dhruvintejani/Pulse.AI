import { memo, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Pulse AI — The AI workspace built for flow',
  '/login': 'Login — Pulse AI',
  '/signup': 'Create account — Pulse AI',
  '/forgot-password': 'Forgot password — Pulse AI',
  '/reset-password': 'Reset password — Pulse AI',
  '/verify': 'Verify email — Pulse AI',
  '/offline': 'Offline — Pulse AI',
  '/500': 'System error — Pulse AI',
  '/dashboard': 'Dashboard — Pulse AI',
  '/dashboard/chat': 'AI Chat — Pulse AI',
  '/dashboard/documents': 'Documents — Pulse AI',
  '/dashboard/analytics': 'Analytics — Pulse AI',
  '/dashboard/workspace': 'Workspace — Pulse AI',
  '/dashboard/models': 'AI Models — Pulse AI',
  '/dashboard/notifications': 'Notifications — Pulse AI',
  '/dashboard/settings': 'Settings — Pulse AI',
  '/dashboard/billing': 'Billing — Pulse AI',
  '/dashboard/profile': 'Profile — Pulse AI',
  '/dashboard/team': 'Team — Pulse AI',
  '/dashboard/admin': 'Admin — Pulse AI',
};

const formatPathname = (pathname: string) => {
  if (pathname === '/') return 'Home';
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] ?? 'Dashboard';
  return lastSegment
    .split('-')
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ');
};

const RouteFocusManager = () => {
  const location = useLocation();
  const pageLabel = useMemo(() => formatPathname(location.pathname), [location.pathname]);

  useEffect(() => {
    document.title = PAGE_TITLES[location.pathname] ?? `${pageLabel} — Pulse AI`;
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    window.requestAnimationFrame(() => {
      const main = document.getElementById('main-content');
      main?.focus({ preventScroll: true });
    });
  }, [location.pathname, pageLabel]);

  return (
    <span className="sr-only" aria-live="polite" aria-atomic="true">
      {pageLabel} page loaded
    </span>
  );
};

export default memo(RouteFocusManager);
