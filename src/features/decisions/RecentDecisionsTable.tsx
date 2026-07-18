import { Badge } from '../../components/Badge';
import { formatDateTime } from '../../domain/formatting';
import { riskBandForVerdict } from '../../domain/risk';
import type { RecentDecisionRecord } from '../../domain/types';

interface RecentDecisionsTableProps {
  readonly records: readonly RecentDecisionRecord[];
}

/** Local audit table for decisions captured during the current UI session. */
export function RecentDecisionsTable({ records }: RecentDecisionsTableProps) {
  if (records.length === 0) {
    return <p className="muted">No local decision history yet. Score or lookup a transaction to populate this table.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Verdict</th>
            <th>Score</th>
            <th>Source</th>
            <th>Replay</th>
            <th>Captured</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => {
            const risk = riskBandForVerdict(record.verdict);
            return (
              <tr key={`${record.decisionId}-${record.capturedAt}`}>
                <td>{record.transactionId}</td>
                <td>
                  <Badge tone={record.verdict === 'APPROVE' ? 'success' : record.verdict === 'REVIEW' ? 'warning' : 'danger'}>
                    {risk.label}
                  </Badge>
                </td>
                <td>{record.score}</td>
                <td>{record.featureSource}</td>
                <td>{record.idempotentReplay ? 'Yes' : 'No'}</td>
                <td>{formatDateTime(record.capturedAt)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
