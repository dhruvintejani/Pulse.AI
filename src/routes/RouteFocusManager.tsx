import { memo, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const formatPathname = (pathname: string) => {
  if (pathname === '/') return 'Home';
  const lastSegment = pathname.split('/').filter(Boolean).at(-1) ?? 'Dashboard';
  return lastSegment
    .split('-')
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ');
};

const RouteFocusManager = () => {
  const location = useLocation();
  const pageLabel = useMemo(() => formatPathname(location.pathname), [location.pathname]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    window.requestAnimationFrame(() => {
      const main = document.getElementById('main-content');
      main?.focus({ preventScroll: true });
    });
  }, [location.pathname]);

  return (
    <span className="sr-only" aria-live="polite" aria-atomic="true">
      {pageLabel} page loaded
    </span>
  );
};

export default memo(RouteFocusManager);
