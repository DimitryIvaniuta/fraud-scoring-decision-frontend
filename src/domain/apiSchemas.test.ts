import { describe, expect, it } from 'vitest';
import { sampleFeatureSnapshot } from './demoData';
import { parseBackendHealth, parseDecisionResponse, parseFeatureSnapshotResponse } from './apiSchemas';
import type { DecisionResponse } from './types';

const validDecision: DecisionResponse = {
  decisionId: 'decision-test-1',
  transactionId: 'tx-test-1',
  modelVersion: 'rules-test',
  verdict: 'REVIEW',
  score: 61,
  reasons: [{ code: 'VELOCITY', message: 'Velocity above normal baseline.', contribution: 24 }],
  featureSource: 'REDIS',
  cacheHit: true,
  idempotentReplay: false,
  decisionTimeMs: 12,
  correlationId: 'corr-test-1',
  createdAt: '2026-07-04T10:00:00Z'
};

describe('api response schemas', () => {
  it('accepts valid fraud decision responses', () => {
    expect(parseDecisionResponse(validDecision)).toEqual(validDecision);
  });

  it('rejects malformed fraud decision scores', () => {
    expect(() => parseDecisionResponse({ ...validDecision, score: 1000 })).toThrow();
  });

  it('accepts valid feature snapshot responses', () => {
    expect(parseFeatureSnapshotResponse(sampleFeatureSnapshot)).toEqual(sampleFeatureSnapshot);
  });

  it('rejects unknown health payload shape', () => {
    expect(() => parseBackendHealth({ state: 'UP' })).toThrow();
  });
});
