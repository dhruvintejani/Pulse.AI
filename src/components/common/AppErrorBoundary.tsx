import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    hasError: false,
    message: '',
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'Something went wrong.',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('[Pulse AI ErrorBoundary]', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <main className="min-h-dvh bg-[#F8F4EC] px-4 py-8 text-[#1F1F1F] flex items-center justify-center" role="alert" aria-live="assertive">
        <div className="glass-card w-full max-w-lg rounded-3xl border border-[rgba(0,0,0,0.06)] bg-[#FFFDF8] p-6 text-center shadow-float sm:p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertTriangle size={24} aria-hidden="true" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-[#1F1F1F]">Pulse AI needs a quick refresh</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#666]">
            The interface hit an unexpected state. Your session is safe, and you can retry without losing your account.
          </p>
          {this.state.message && (
            <p className="mt-4 rounded-2xl border border-[rgba(0,0,0,0.05)] bg-[rgba(0,0,0,0.03)] px-3 py-2 text-xs text-[#999]">
              {this.state.message}
            </p>
          )}
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={this.handleReset}
              className="inline-flex items-center justify-center rounded-xl border border-[rgba(0,0,0,0.08)] bg-[#FFFDF8] px-4 py-2.5 text-sm font-bold text-[#666] transition-all hover:border-[rgba(233,162,76,0.35)] hover:text-[#E9A24C] focus-ring"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={this.handleReload}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#E9A24C] to-[#D4853A] px-4 py-2.5 text-sm font-bold text-white shadow-premium transition-all hover:-translate-y-0.5 hover:shadow-premium-lg focus-ring"
            >
              <RefreshCw size={15} aria-hidden="true" /> Refresh app
            </button>
          </div>
        </div>
      </main>
    );
  }
}

export default AppErrorBoundary;
