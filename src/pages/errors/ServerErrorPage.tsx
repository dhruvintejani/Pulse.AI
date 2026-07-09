import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorPageShell } from '@/components/errors';
import { ROUTES } from '@/constants/routes';

const ServerErrorPage = () => {
  const navigate = useNavigate();

  return (
    <ErrorPageShell
      variant="500"
      eyebrow="500 · Unexpected error"
      title="Pulse AI hit a recoverable system state."
      description="Something interrupted the interface. Your account and workspace data are safe. Retry the view, refresh the app, or return home while the issue is logged for diagnostics."
      details="Logging-ready diagnostics are prepared with source, route, browser, timestamp, and stack information when available."
      primaryLabel="Retry now"
      secondaryLabel="Go back"
      onPrimary={() => window.location.reload()}
      onSecondary={() => (window.history.length > 1 ? navigate(-1) : navigate(ROUTES.HOME))}
      onHome={() => navigate(ROUTES.HOME)}
    />
  );
};

export default memo(ServerErrorPage);
