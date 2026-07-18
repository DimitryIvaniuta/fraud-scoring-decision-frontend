import { describe, expect, it } from 'vitest';
import { riskBandForVerdict, summarizeDecision } from './risk';
import type { DecisionResponse } from './types';

describe('riskBandForVerdict', () => {
  it('maps backend verdicts to user-facing risk bands', () => {
    expect(riskBandForVerdict('APPROVE').label).toBe('Approved');
    expect(riskBandForVerdict('REVIEW').className).toBe('risk-medium');
    expect(riskBandForVerdict('DECLINE').explanation).toContain('blocked');
  });
});

describe('summarizeDecision', () => {
  it('chooses the strongest explainability reason', () => {
    const decision: DecisionResponse = {
      decisionId: 'decision-1',
      transactionId: 'tx-1',
      modelVersion: 'rules-test',
      verdict: 'REVIEW',
      score: 55,
      reasons: [
        { code: 'LOW_SIGNAL', message: 'Small signal', contribution: 5 },
        { code: 'HIGH_SIGNAL', message: 'Large signal', contribution: 30 }
      ],
      featureSource: 'REDIS',
      cacheHit: true,
      idempotentReplay: false,
      decisionTimeMs: 9,
      correlationId: 'corr-1',
      createdAt: '2026-07-04T10:00:00Z'
    };

    expect(summarizeDecision(decision)).toContain('HIGH_SIGNAL');
  });
});
