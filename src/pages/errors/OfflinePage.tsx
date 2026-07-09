import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorPageShell } from '@/components/errors';
import { ROUTES } from '@/constants/routes';

const OfflinePage = () => {
  const navigate = useNavigate();

  return (
    <ErrorPageShell
      variant="offline"
      eyebrow="Offline · Cached experience"
      title="You are offline, but Pulse AI is still ready."
      description="The app shell is cached for a smoother experience. Some live workspace data, AI responses, and account actions will resume when your connection comes back."
      details="Tip: keep this tab open. Pulse AI will reconnect automatically when the network is available again."
      primaryLabel="Check connection"
      secondaryLabel="Back to app"
      onPrimary={() => window.location.reload()}
      onSecondary={() => navigate(-1)}
      onHome={() => navigate(ROUTES.HOME)}
    />
  );
};

export default memo(OfflinePage);
