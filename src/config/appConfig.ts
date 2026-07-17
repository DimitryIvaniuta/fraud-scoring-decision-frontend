/** Runtime configuration consumed by the frontend. */
export interface AppConfig {
  readonly apiBaseUrl: string;
  readonly httpTimeoutMs: number;
}

const DEFAULT_TIMEOUT_MS = 5_000;

/**
 * Validates API origin before using it in fetch calls.
 * This prevents accidental javascript: or data: URLs from being injected through build-time configuration.
 */
export function resolveApiBaseUrl(rawValue: string | undefined): string {
  const compiledDefault = typeof __API_BASE_URL__ === 'string' ? __API_BASE_URL__ : 'http://localhost:8080';
  const candidate = rawValue?.trim() || compiledDefault;
  const parsed = new URL(candidate);

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('VITE_API_BASE_URL must use http or https protocol.');
  }

  parsed.pathname = parsed.pathname.replace(/\/$/, '');
  return parsed.toString().replace(/\/$/, '');
}

/** Parses and bounds the API timeout used by AbortController. */
export function resolveHttpTimeoutMs(rawValue: string | undefined): number {
  const parsed = Number(rawValue ?? DEFAULT_TIMEOUT_MS);
  if (!Number.isFinite(parsed) || parsed < 500 || parsed > 30_000) {
    return DEFAULT_TIMEOUT_MS;
  }
  return parsed;
}

export const appConfig: AppConfig = {
  apiBaseUrl: resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
  httpTimeoutMs: resolveHttpTimeoutMs(import.meta.env.VITE_HTTP_TIMEOUT_MS)
};
