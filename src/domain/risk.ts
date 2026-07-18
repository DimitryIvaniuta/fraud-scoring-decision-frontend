import type { DecisionResponse, FraudVerdict } from './types';

export interface RiskBand {
  readonly label: string;
  readonly className: string;
  readonly explanation: string;
}

/** Maps backend verdicts to stable visual states used by cards and tables. */
export function riskBandForVerdict(verdict: FraudVerdict): RiskBand {
  switch (verdict) {
    case 'APPROVE':
      return { label: 'Approved', className: 'risk-low', explanation: 'Low risk, transaction can continue.' };
    case 'REVIEW':
      return { label: 'Review', className: 'risk-medium', explanation: 'Manual review recommended.' };
    case 'DECLINE':
      return { label: 'Declined', className: 'risk-high', explanation: 'High risk, transaction should be blocked.' };
  }
}

/** Produces a short operational summary from the decision response. */
export function summarizeDecision(decision: DecisionResponse): string {
  const strongestReason = [...decision.reasons].sort((left, right) => right.contribution - left.contribution)[0];
  if (!strongestReason) {
    return 'Decision was made without additional risk reasons.';
  }
  return `${strongestReason.code}: ${strongestReason.message}`;
}
