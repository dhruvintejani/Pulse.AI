import { memo, useEffect } from 'react';
import { useToast } from '@/components/ui/Toast';
import { getFriendlyErrorMessage, reportApplicationError } from '@/lib/errorLogger';

const GlobalErrorHandlers = () => {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const error = event.error ?? event.message;
      reportApplicationError({
        error,
        source: 'window.error',
        severity: 'error',
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });

      toast({
        title: 'Something needs attention',
        description: getFriendlyErrorMessage(error),
        variant: 'error',
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      reportApplicationError({
        error: event.reason,
        source: 'window.unhandledrejection',
        severity: 'error',
      });

      toast({
        title: 'Request did not complete',
        description: getFriendlyErrorMessage(event.reason),
        variant: 'warning',
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [toast]);

  return null;
};

export default memo(GlobalErrorHandlers);
