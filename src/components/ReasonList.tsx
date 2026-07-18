import type { DecisionReason } from '../domain/types';

interface ReasonListProps {
  readonly reasons: readonly DecisionReason[];
}

/** Explainability list rendered from backend reason codes. */
export function ReasonList({ reasons }: ReasonListProps) {
  if (reasons.length === 0) {
    return <p className="muted">No decision reasons were returned.</p>;
  }

  return (
    <ol className="reason-list">
      {reasons.map((reason) => (
        <li key={`${reason.code}-${reason.contribution}`}>
          <div>
            <strong>{reason.code}</strong>
            <span>{reason.message}</span>
          </div>
          <b>+{reason.contribution}</b>
        </li>
      ))}
    </ol>
  );
}
