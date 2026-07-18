const CORRELATION_PREFIX = 'fraud-ui';

/** Creates a non-sensitive correlation id for cross-service troubleshooting. */
export function createCorrelationId(): string {
  if (globalThis.crypto?.randomUUID) {
    return `${CORRELATION_PREFIX}-${globalThis.crypto.randomUUID()}`;
  }

  return `${CORRELATION_PREFIX}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
