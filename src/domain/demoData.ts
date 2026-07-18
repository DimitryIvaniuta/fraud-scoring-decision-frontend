import type { FeatureSnapshot, TransactionRequest } from './types';

const now = new Date().toISOString();

export const sampleTransaction: TransactionRequest = {
  transactionId: 'tx-ui-1001',
  customerId: 'customer-1',
  merchantId: 'merchant-1',
  amount: 425,
  currency: 'PLN',
  country: 'PL',
  channel: 'ECOMMERCE',
  deviceId: 'device-web-1',
  ipAddress: '203.0.113.20',
  occurredAt: now
};

export const sampleFeatureSnapshot: FeatureSnapshot = {
  customerId: 'customer-1',
  merchantId: 'merchant-1',
  averageAmount: 80,
  chargebackRate: 0.015,
  highRiskCountry: false,
  accountAgeDays: 360,
  velocity24h: 3,
  priorDeclines24h: 0,
  source: 'REDIS',
  refreshedAt: now
};
