import { z } from 'zod';
import type { FeatureSnapshot, TransactionRequest } from './types';

const decimalAmount = z
  .number()
  .positive('Amount must be positive.')
  .max(999_999_999, 'Amount is too large for the scoring API.')
  .refine((value) => Math.abs(value * 100 - Math.round(value * 100)) < Number.EPSILON * 100, 'Amount can have at most two decimal places.');

export const transactionRequestSchema = z.object({
  transactionId: z.string().trim().min(3).max(80).regex(/^[A-Za-z0-9._:-]+$/, 'Use only letters, digits, dot, underscore, colon, or dash.'),
  customerId: z.string().trim().min(2).max(80),
  merchantId: z.string().trim().min(2).max(80),
  amount: decimalAmount,
  currency: z.string().trim().length(3).regex(/^[A-Z]{3}$/, 'Currency must be an ISO-like 3-letter uppercase code.'),
  country: z.string().trim().length(2).regex(/^[A-Z]{2}$/, 'Country must be an ISO-like 2-letter uppercase code.'),
  channel: z.string().trim().min(2).max(40).regex(/^[A-Z_]+$/, 'Channel should use uppercase words and underscores.'),
  deviceId: z.string().trim().min(2).max(120),
  ipAddress: z.string().trim().regex(/^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/, 'IPv4 address is invalid.'),
  occurredAt: z.string().datetime({ offset: true })
});

export const featureSnapshotSchema = z.object({
  customerId: z.string().trim().min(2).max(80),
  merchantId: z.string().trim().min(2).max(80),
  averageAmount: decimalAmount,
  chargebackRate: z.number().min(0).max(1),
  highRiskCountry: z.boolean(),
  accountAgeDays: z.number().int().min(0).max(50_000),
  velocity24h: z.number().int().min(0).max(10_000),
  priorDeclines24h: z.number().int().min(0).max(10_000),
  source: z.enum(['REDIS', 'POSTGRESQL', 'FALLBACK', 'ENRICHED']),
  refreshedAt: z.string().datetime({ offset: true })
});

/** Converts Zod validation issues into field-level messages for the forms. */
export function flattenZodErrors(error: z.ZodError): Record<string, string> {
  return error.issues.reduce<Record<string, string>>((accumulator, issue) => {
    const key = issue.path.join('.') || 'form';
    accumulator[key] = issue.message;
    return accumulator;
  }, {});
}

/** Validates a transaction payload before it is sent to the backend. */
export function validateTransactionRequest(value: unknown): TransactionRequest {
  return transactionRequestSchema.parse(value);
}

/** Validates a feature payload before it is sent to the backend. */
export function validateFeatureSnapshot(value: unknown): FeatureSnapshot {
  return featureSnapshotSchema.parse(value);
}
