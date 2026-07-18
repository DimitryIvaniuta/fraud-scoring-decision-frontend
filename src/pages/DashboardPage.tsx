import { Badge } from '../components/Badge';
import { BankCard } from '../components/BankCard';
import { MetricCard } from '../components/MetricCard';
import { PageHeading } from '../components/PageHeading';
import { appConfig } from '../config/appConfig';
import { formatDateTime } from '../domain/formatting';
import { useBackendHealth } from '../hooks/useBackendHealth';

function healthTone(state: ReturnType<typeof useBackendHealth>['state']): 'success' | 'warning' | 'danger' {
  if (state === 'up') {
    return 'success';
  }
  return state === 'checking' || state === 'degraded' ? 'warning' : 'danger';
}

/** Executive overview for fraud operations and backend connectivity. */
export function DashboardPage() {
  const health = useBackendHealth();

  return (
    <div className="page-stack">
      <PageHeading
        eyebrow="Fraud operations"
        title="Real-time decision dashboard"
        description="Monitor the synchronous decision path, feature cache readiness, idempotent retry behavior, and backend availability from one banking-style console."
      />

      <div className="metrics-grid">
        <MetricCard label="Latency objective" value="p95 < 100ms" trend="Kafka publishing is outbox-based and off the request path." />
        <MetricCard label="Decision durability" value="Always recorded" trend="UI calls the API only after PostgreSQL commit." />
        <MetricCard label="Explainability" value="Reason codes" trend="Model version and contribution values are visible." />
        <MetricCard label="Retry safety" value="Idempotent" trend="Same transaction returns the stored decision." />
      </div>

      <div className="two-column">
        <BankCard eyebrow="Connectivity" title="Backend health">
          <div className="health-card">
            <div className="health-row">
              <Badge tone={healthTone(health.state)}>{health.state.toUpperCase()}</Badge>
              <button className="button ghost compact" type="button" onClick={() => { void health.refresh(); }}>
                Refresh
              </button>
            </div>
            <p>Configured API base URL: <strong>{appConfig.apiBaseUrl}</strong></p>
            <p>Last checked: <strong>{health.checkedAt ? formatDateTime(health.checkedAt) : 'not checked yet'}</strong></p>
            <p className="muted">Health check uses <code>/actuator/health</code> with polling and a short timeout so the UI stays responsive.</p>
          </div>
        </BankCard>

        <BankCard eyebrow="Workflow" title="Recommended operator path">
          <ol className="workflow-list">
            <li>Seed a feature snapshot for customer and merchant testing.</li>
            <li>Score a transaction from the Decision Desk.</li>
            <li>Retry the same transaction ID to verify deterministic replay.</li>
            <li>Lookup the recorded decision and inspect reason contributions.</li>
          </ol>
        </BankCard>
      </div>
    </div>
  );
}
