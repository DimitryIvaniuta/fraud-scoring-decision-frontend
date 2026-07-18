import { appConfig } from '../config/appConfig';
import type { ApiProblem } from '../domain/types';
import { createCorrelationId } from '../lib/correlationId';

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  readonly body?: unknown;
  readonly timeoutMs?: number;
}

export class ApiError extends Error {
  readonly correlationId: string | undefined;
  readonly details: readonly string[];
  readonly status: number;

  constructor(status: number, message: string, details: readonly string[] = [], correlationId?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    this.correlationId = correlationId;
  }
}

/**
 * Thin fetch wrapper that centralizes timeout, JSON parsing, correlation id, and safe error extraction.
 * It intentionally avoids logging request bodies because transaction payloads can contain sensitive identifiers.
 */
export async function requestJson<TResponse>(path: string, options: RequestOptions = {}): Promise<TResponse> {
  const { body, timeoutMs, ...requestOptions } = options;
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs ?? appConfig.httpTimeoutMs);
  const url = new URL(path, appConfig.apiBaseUrl);
  const headers = new Headers(requestOptions.headers);
  const correlationId = createCorrelationId();

  headers.set('Accept', 'application/json');
  headers.set('X-Correlation-Id', correlationId);
  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const requestInit: RequestInit = {
      ...requestOptions,
      credentials: requestOptions.credentials ?? 'same-origin',
      headers,
      signal: controller.signal
    };

    if (body !== undefined) {
      requestInit.body = JSON.stringify(body);
    }

    const response = await fetch(url, requestInit);

    if (!response.ok) {
      const problem = await readProblem(response);
      throw new ApiError(
        response.status,
        problem.message ?? problem.error ?? `Request failed with HTTP ${response.status}.`,
        problem.details ?? [],
        problem.correlationId ?? response.headers.get('X-Correlation-Id') ?? correlationId
      );
    }

    if (response.status === 204) {
      return undefined as TResponse;
    }

    if (!isJsonResponse(response)) {
      throw new ApiError(502, 'Backend returned a non-JSON response for a JSON API request.', [], response.headers.get('X-Correlation-Id') ?? correlationId);
    }

    return (await response.json()) as TResponse;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError(408, 'Backend request timed out. Check service health and network latency.', [], correlationId);
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

/** Detects JSON payloads while accepting common structured-syntax suffixes such as application/problem+json. */
function isJsonResponse(response: Response): boolean {
  const contentType = response.headers.get('Content-Type')?.toLowerCase() ?? '';
  return contentType.includes('application/json') || contentType.includes('+json');
}

/** Reads backend problem JSON without exposing parser errors to the UI. */
async function readProblem(response: Response): Promise<ApiProblem> {
  try {
    if (isJsonResponse(response)) {
      return (await response.json()) as ApiProblem;
    }
    return { status: response.status, message: response.statusText };
  } catch {
    return { status: response.status, message: response.statusText };
  }
}
