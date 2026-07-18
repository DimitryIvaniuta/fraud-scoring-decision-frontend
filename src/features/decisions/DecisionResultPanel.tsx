import { Badge } from '../../components/Badge';
import { BankCard } from '../../components/BankCard';
import { ReasonList } from '../../components/ReasonList';
import { ScoreGauge } from '../../components/ScoreGauge';
import { formatDateTime } from '../../domain/formatting';
import { riskBandForVerdict, summarizeDecision } from '../../domain/risk';
import type { DecisionResponse } from '../../domain/types';

interface DecisionResultPanelProps {
  readonly decision: DecisionResponse | null;
}

/** Displays the latest backend decision with score, verdict, model, and reason explainability. */
export function DecisionResultPanel({ decision }: DecisionResultPanelProps) {
  if (!decision) {
    return (
      <BankCard eyebrow="Decision result" title="Waiting for scoring">
        <div className="empty-state">
          <strong>No transaction scored yet</strong>
          <p>Submit a transaction to display its deterministic fraud score and decision reasons.</p>
        </div>
      </BankCard>
    );
  }

  const riskBand = riskBandForVerdict(decision.verdict);

  return (
    <BankCard eyebrow="Decision result" title={`Transaction ${decision.transactionId}`}>
      <div className="result-grid">
        <ScoreGauge score={decision.score} />
        <div className="decision-summary">
          <Badge tone={decision.verdict === 'APPROVE' ? 'success' : decision.verdict === 'REVIEW' ? 'warning' : 'danger'}>
            {riskBand.label}
          </Badge>
          <h3>{riskBand.explanation}</h3>
          <p>{summarizeDecision(decision)}</p>
          <dl className="definition-grid">
            <div>
              <dt>Model</dt>
              <dd>{decision.modelVersion}</dd>
            </div>
            <div>
              <dt>Feature Source</dt>
              <dd>{decision.featureSource}</dd>
            </div>
            <div>
              <dt>Cache Hit</dt>
              <dd>{decision.cacheHit ? 'Yes' : 'No'}</dd>
            </div>
            <div>
              <dt>Retry Replay</dt>
              <dd>{decision.idempotentReplay ? 'Yes' : 'No'}</dd>
            </div>
            <div>
              <dt>Latency</dt>
              <dd>{decision.decisionTimeMs} ms</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{formatDateTime(decision.createdAt)}</dd>
            </div>
          </dl>
        </div>
      </div>
      <ReasonList reasons={decision.reasons} />
    </BankCard>
  );
}
