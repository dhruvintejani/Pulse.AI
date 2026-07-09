import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorPageShell } from '@/components/errors';
import { getFriendlyErrorMessage, reportApplicationError } from '@/lib/errorLogger';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  message: string;
  friendlyMessage: string;
}

class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
    message: '',
    friendlyMessage: 'Pulse AI hit an unexpected state. Your workspace is safe, and you can retry.',
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Unexpected application error',
      friendlyMessage: getFriendlyErrorMessage(error),
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    reportApplicationError({
      error,
      source: 'react.error-boundary',
      severity: 'fatal',
      componentStack: errorInfo.componentStack ?? undefined,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      message: '',
      friendlyMessage: 'Pulse AI hit an unexpected state. Your workspace is safe, and you can retry.',
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <ErrorPageShell
        variant="500"
        eyebrow="500 · Application recovery"
        title="Pulse AI needs a quick recovery pass."
        description={this.state.friendlyMessage}
        details={this.state.message ? `Diagnostic message: ${this.state.message}` : 'The issue is ready to be logged with browser, route, timestamp, and component stack information.'}
        primaryLabel="Try again"
        secondaryLabel="Refresh app"
        onPrimary={this.handleReset}
        onSecondary={this.handleReload}
        onHome={this.handleReload}
      />
    );
  }
}

export default AppErrorBoundary;
