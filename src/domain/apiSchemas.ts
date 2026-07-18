import { z } from 'zod';
import type { BackendHealth, DecisionResponse, FeatureSnapshot } from './types';

const fraudVerdictSchema = z.enum(['APPROVE', 'REVIEW', 'DECLINE']);
const featureSourceSchema = z.enum(['REDIS', 'POSTGRESQL', 'FALLBACK', 'ENRICHED']);

const decisionReasonSchema = z.object({
  code: z.string().min(1).max(80),
  message: z.string().min(1).max(500),
  contribution: z.number().min(-100).max(100)
});

export const decisionResponseSchema = z.object({
  decisionId: z.string().min(1).max(120),
  transactionId: z.string().min(1).max(120),
  modelVersion: z.string().min(1).max(120),
  verdict: fraudVerdictSchema,
  score: z.number().min(0).max(100),
  reasons: z.array(decisionReasonSchema).max(25),
  featureSource: featureSourceSchema,
  cacheHit: z.boolean(),
  idempotentReplay: z.boolean(),
  decisionTimeMs: z.number().min(0).max(60_000),
  correlationId: z.string().min(1).max(160),
  createdAt: z.string().datetime({ offset: true })
});

export const featureSnapshotResponseSchema = z.object({
  customerId: z.string().min(1).max(120),
  merchantId: z.string().min(1).max(120),
  averageAmount: z.number().min(0).max(999_999_999),
  chargebackRate: z.number().min(0).max(1),
  highRiskCountry: z.boolean(),
  accountAgeDays: z.number().int().min(0).max(50_000),
  velocity24h: z.number().int().min(0).max(10_000),
  priorDeclines24h: z.number().int().min(0).max(10_000),
  source: featureSourceSchema,
  refreshedAt: z.string().datetime({ offset: true })
});

export const backendHealthSchema = z.object({
  status: z.string().min(1).max(40)
});

/**
 * Validates backend health payloads at runtime before they are trusted by the UI.
 * Runtime validation catches contract drift even when TypeScript cannot see server-side changes.
 */
export function parseBackendHealth(value: unknown): BackendHealth {
  return backendHealthSchema.parse(value);
}

/**
 * Validates fraud decision responses from the backend before showing score and explainability data.
 */
export function parseDecisionResponse(value: unknown): DecisionResponse {
  return decisionResponseSchema.parse(value);
}

/**
 * Validates feature snapshot responses from the backend before rendering operational confirmation data.
 */
export function parseFeatureSnapshotResponse(value: unknown): FeatureSnapshot {
  return featureSnapshotResponseSchema.parse(value);
}
