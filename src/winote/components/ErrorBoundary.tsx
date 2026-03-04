import React from 'react';
import { RefreshCw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class WiNoteErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[WiNote] Uncaught error:', error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/winote';
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-[100dvh] flex flex-col items-center justify-center p-8 bg-wn-bg font-wn text-wn-text-primary text-center">
        {/* Icon */}
        <div className="w-[72px] h-[72px] rounded-full bg-wn-card-yellow shadow-wn-card flex items-center justify-center mb-6 text-[32px]">
          ⚠️
        </div>

        <h2 className="text-wn-xl font-bold mb-2">
          Something went wrong
        </h2>

        <p className="text-wn-base text-wn-text-secondary leading-relaxed mb-6 max-w-[300px]">
          An unexpected error occurred. You can retry or go back to the home screen.
        </p>

        {/* Error detail (dev only) */}
        {import.meta.env.DEV && this.state.error && (
          <div className="w-full max-w-[360px] mb-6 p-3 rounded-wn-md bg-wn-bg-light shadow-wn-inset border border-wn-border text-left text-wn-xs text-wn-text-danger font-mono break-words max-h-[120px] overflow-auto">
            {this.state.error.message}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 py-3 px-5 rounded-wn-xl bg-wn-cta-bg text-wn-white border-none text-wn-base font-semibold font-wn cursor-pointer shadow-wn-btn"
          >
            <RefreshCw size={16} />
            Retry
          </button>

          <button
            onClick={this.handleGoHome}
            className="flex items-center gap-2 py-3 px-5 rounded-wn-xl bg-wn-bg shadow-wn-card-sm text-wn-text-primary border-none text-wn-base font-semibold font-wn cursor-pointer"
          >
            <Home size={16} />
            Home
          </button>
        </div>
      </div>
    );
  }
}
