import { useMemo, useState } from 'react';
import { BankCard } from '../components/BankCard';
import { PageHeading } from '../components/PageHeading';
import { DecisionForm } from '../features/decisions/DecisionForm';
import { DecisionLookup } from '../features/decisions/DecisionLookup';
import { DecisionResultPanel } from '../features/decisions/DecisionResultPanel';
import { RecentDecisionsTable } from '../features/decisions/RecentDecisionsTable';
import type { DecisionResponse, RecentDecisionRecord } from '../domain/types';

/** Main screen for scoring and reading fraud decisions. */
export function DecisionDeskPage() {
  const [latestDecision, setLatestDecision] = useState<DecisionResponse | null>(null);
  const [records, setRecords] = useState<readonly RecentDecisionRecord[]>([]);

  const captureDecision = (decision: DecisionResponse) => {
    setLatestDecision(decision);
    setRecords((current) => [
      { ...decision, capturedAt: new Date().toISOString() },
      ...current
    ].slice(0, 12));
  };

  const replayCount = useMemo(() => records.filter((record) => record.idempotentReplay).length, [records]);

  return (
    <div className="page-stack">
      <PageHeading
        eyebrow="Decision desk"
        title="Score and review transactions"
        description="Submit synchronous scoring requests, verify recorded decisions, and inspect explainability from the backend response."
      />

      <div className="decision-layout">
        <div className="page-stack">
          <DecisionForm onDecision={captureDecision} />
          <DecisionLookup onDecision={captureDecision} />
        </div>
        <DecisionResultPanel decision={latestDecision} />
      </div>

      <BankCard eyebrow="Local session audit" title="Recent decisions" actions={<span className="pill">Idempotent replays: {replayCount}</span>}>
        <RecentDecisionsTable records={records} />
      </BankCard>
    </div>
  );
}
