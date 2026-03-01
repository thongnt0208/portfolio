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
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
          background: 'var(--wn-bg)',
          fontFamily: 'var(--wn-font)',
          color: 'var(--wn-text-primary)',
          textAlign: 'center',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'var(--wn-card-yellow)',
            boxShadow: 'var(--wn-shadow-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 24,
            fontSize: 32,
          }}
        >
          ⚠️
        </div>

        <h2 style={{ fontSize: 'var(--wn-text-xl)', fontWeight: 700, marginBottom: 8 }}>
          Something went wrong
        </h2>

        <p
          style={{
            fontSize: 'var(--wn-text-base)',
            color: 'var(--wn-text-secondary)',
            lineHeight: 1.6,
            marginBottom: 24,
            maxWidth: 300,
          }}
        >
          An unexpected error occurred. You can retry or go back to the home screen.
        </p>

        {/* Error detail (dev only) */}
        {import.meta.env.DEV && this.state.error && (
          <div
            style={{
              width: '100%',
              maxWidth: 360,
              marginBottom: 24,
              padding: 12,
              borderRadius: 'var(--wn-radius-md)',
              background: 'var(--wn-bg-light)',
              boxShadow: 'var(--wn-shadow-inset)',
              border: '1px solid var(--wn-border)',
              textAlign: 'left',
              fontSize: 'var(--wn-text-xs)',
              color: 'var(--wn-text-danger)',
              fontFamily: 'monospace',
              wordBreak: 'break-word',
              maxHeight: 120,
              overflow: 'auto',
            }}
          >
            {this.state.error.message}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={this.handleRetry}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: 'var(--wn-radius-md)',
              background: 'var(--wn-accent-green)',
              color: 'white',
              border: 'none',
              fontSize: 'var(--wn-text-base)',
              fontWeight: 600,
              fontFamily: 'var(--wn-font)',
              cursor: 'pointer',
              boxShadow: 'var(--wn-shadow-btn)',
            }}
          >
            <RefreshCw size={16} />
            Retry
          </button>

          <button
            onClick={this.handleGoHome}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 20px',
              borderRadius: 'var(--wn-radius-md)',
              background: 'var(--wn-bg-light)',
              color: 'var(--wn-text-primary)',
              border: '1px solid var(--wn-border)',
              fontSize: 'var(--wn-text-base)',
              fontWeight: 600,
              fontFamily: 'var(--wn-font)',
              cursor: 'pointer',
              boxShadow: 'var(--wn-shadow-btn)',
            }}
          >
            <Home size={16} />
            Home
          </button>
        </div>
      </div>
    );
  }
}
