import { memo, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const humanizePath = (pathname: string) => {
  if (pathname === '/') return 'Home page loaded';
  const label = pathname
    .split('/')
    .filter(Boolean)
    .map((part) => part.replace(/-/g, ' '))
    .join(', ');
  return `${label} page loaded`;
};

const RouteAnnouncer = () => {
  const location = useLocation();
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setAnnouncement(humanizePath(location.pathname));
    }, 120);

    return () => window.clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {announcement}
    </div>
  );
};

export default memo(RouteAnnouncer);
