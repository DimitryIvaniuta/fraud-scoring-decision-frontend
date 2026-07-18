export type FraudVerdict = 'APPROVE' | 'REVIEW' | 'DECLINE';
export type FeatureSource = 'REDIS' | 'POSTGRESQL' | 'FALLBACK' | 'ENRICHED';

export interface DecisionReason {
  readonly code: string;
  readonly message: string;
  readonly contribution: number;
}

export interface TransactionRequest {
  readonly transactionId: string;
  readonly customerId: string;
  readonly merchantId: string;
  readonly amount: number;
  readonly currency: string;
  readonly country: string;
  readonly channel: string;
  readonly deviceId: string;
  readonly ipAddress: string;
  readonly occurredAt: string;
}

export interface DecisionResponse {
  readonly decisionId: string;
  readonly transactionId: string;
  readonly modelVersion: string;
  readonly verdict: FraudVerdict;
  readonly score: number;
  readonly reasons: readonly DecisionReason[];
  readonly featureSource: FeatureSource;
  readonly cacheHit: boolean;
  readonly idempotentReplay: boolean;
  readonly decisionTimeMs: number;
  readonly correlationId: string;
  readonly createdAt: string;
}

export interface FeatureSnapshot {
  readonly customerId: string;
  readonly merchantId: string;
  readonly averageAmount: number;
  readonly chargebackRate: number;
  readonly highRiskCountry: boolean;
  readonly accountAgeDays: number;
  readonly velocity24h: number;
  readonly priorDeclines24h: number;
  readonly source: FeatureSource;
  readonly refreshedAt: string;
}

export interface BackendHealth {
  readonly status: string;
}

export interface ApiProblem {
  readonly status?: number;
  readonly error?: string;
  readonly message?: string;
  readonly path?: string;
  readonly correlationId?: string;
  readonly details?: readonly string[];
}

export interface RecentDecisionRecord extends DecisionResponse {
  readonly capturedAt: string;
}
