import { z } from 'zod';
import type { BackendHealth, DecisionResponse, FeatureSnapshot, TransactionRequest } from '../domain/types';
import { parseBackendHealth, parseDecisionResponse, parseFeatureSnapshotResponse } from '../domain/apiSchemas';
import { ApiError, requestJson } from './httpClient';

function parseContract<TResponse>(operation: string, parser: (value: unknown) => TResponse, value: unknown): TResponse {
  try {
    return parser(value);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(502, `${operation} response did not match the expected API contract.`, error.issues.map((issue) => `${issue.path.join('.') || 'response'}: ${issue.message}`));
    }
    throw error;
  }
}

export const fraudApi = {
  /** Calls the synchronous fraud decision endpoint and validates the response contract at runtime. */
  async scoreTransaction(request: TransactionRequest): Promise<DecisionResponse> {
    const response = await requestJson<unknown>('/api/v1/fraud/decisions', {
      method: 'POST',
      body: request
    });
    return parseContract('Fraud decision', parseDecisionResponse, response);
  },

  /** Loads an already-recorded decision by transaction id and validates the durable read payload. */
  async getDecision(transactionId: string): Promise<DecisionResponse> {
    const response = await requestJson<unknown>(`/api/v1/fraud/decisions/${encodeURIComponent(transactionId)}`);
    return parseContract('Recorded decision', parseDecisionResponse, response);
  },

  /** Seeds feature data for local testing and operational troubleshooting. */
  async seedFeatures(snapshot: FeatureSnapshot): Promise<FeatureSnapshot> {
    const response = await requestJson<unknown>('/api/v1/fraud/features', {
      method: 'PUT',
      body: snapshot
    });
    return parseContract('Feature snapshot', parseFeatureSnapshotResponse, response);
  },

  /** Checks backend liveness through Spring Actuator and validates the health shape. */
  async getHealth(): Promise<BackendHealth> {
    const response = await requestJson<unknown>('/actuator/health', { timeoutMs: 2_500 });
    return parseContract('Backend health', parseBackendHealth, response);
  }
};
