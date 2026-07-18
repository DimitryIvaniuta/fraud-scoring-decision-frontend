import { describe, expect, it } from 'vitest';
import { sampleFeatureSnapshot, sampleTransaction } from './demoData';
import { featureSnapshotSchema, transactionRequestSchema } from './validators';

describe('transactionRequestSchema', () => {
  it('accepts a valid transaction payload', () => {
    const parsed = transactionRequestSchema.safeParse(sampleTransaction);

    expect(parsed.success).toBe(true);
  });

  it('rejects lowercase currency and invalid country code', () => {
    const parsed = transactionRequestSchema.safeParse({
      ...sampleTransaction,
      currency: 'pln',
      country: 'POL'
    });

    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues.map((issue) => issue.path.join('.'))).toEqual(expect.arrayContaining(['currency', 'country']));
    }
  });

  it('rejects amount values with more than two decimal places', () => {
    const parsed = transactionRequestSchema.safeParse({
      ...sampleTransaction,
      amount: 10.123
    });

    expect(parsed.success).toBe(false);
  });
});

describe('featureSnapshotSchema', () => {
  it('accepts feature snapshots in the backend-supported range', () => {
    expect(featureSnapshotSchema.safeParse(sampleFeatureSnapshot).success).toBe(true);
  });

  it('rejects impossible feature values', () => {
    const parsed = featureSnapshotSchema.safeParse({
      ...sampleFeatureSnapshot,
      chargebackRate: 4,
      velocity24h: -1
    });

    expect(parsed.success).toBe(false);
  });
});
