import { Component, type PropsWithChildren, type ReactNode } from 'react';
import { toSafeDisplayText } from '../domain/safeText';

interface AppErrorBoundaryState {
  readonly message: string;
}

/**
 * Last-resort UI boundary that prevents a rendering error from producing a blank banking console.
 * Operational users receive a safe recovery screen while details remain bounded and non-sensitive.
 */
export class AppErrorBoundary extends Component<PropsWithChildren, AppErrorBoundaryState> {
  override state: AppErrorBoundaryState = { message: '' };

  static getDerivedStateFromError(error: unknown): AppErrorBoundaryState {
    return {
      message: error instanceof Error ? toSafeDisplayText(error.message) : 'Unexpected frontend rendering error.'
    };
  }

  override componentDidCatch(): void {
    // Hook production telemetry here, but never log transaction payloads from form state.
  }

  override render(): ReactNode {
    if (!this.state.message) {
      return this.props.children;
    }

    return (
      <main className="fatal-error" role="alert">
        <section>
          <span className="eyebrow">Frontend safeguard</span>
          <h1>Fraud console recovered from an unexpected error</h1>
          <p>{this.state.message}</p>
          <button className="button primary" type="button" onClick={() => window.location.assign('/dashboard')}>
            Reload dashboard
          </button>
        </section>
      </main>
    );
  }
}
