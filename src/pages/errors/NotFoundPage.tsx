import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ErrorPageShell } from '@/components/errors';
import { ROUTES } from '@/constants/routes';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <ErrorPageShell
      variant="404"
      eyebrow="404 · Route not found"
      title="This workspace route drifted out of orbit."
      description="The page you requested does not exist, may have moved, or belongs to a workspace you do not have access to. You can go back or return to the Pulse AI home page."
      primaryLabel="Retry route"
      secondaryLabel="Go back"
      onPrimary={() => window.location.reload()}
      onSecondary={() => (window.history.length > 1 ? navigate(-1) : navigate(ROUTES.HOME))}
      onHome={() => navigate(ROUTES.HOME)}
    />
  );
};

export default memo(NotFoundPage);
