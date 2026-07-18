import { useCallback, useState } from 'react';
import { ApiError } from '../api/httpClient';
import { toSafeDisplayList, toSafeDisplayText } from '../domain/safeText';

export interface AsyncActionState<TData> {
  readonly data: TData | null;
  readonly error: string | null;
  readonly details: readonly string[];
  readonly isLoading: boolean;
  readonly run: (action: () => Promise<TData>) => Promise<TData | null>;
  readonly reset: () => void;
}

/** Shared hook for form submissions with safe user-facing error messages. */
export function useAsyncAction<TData>(): AsyncActionState<TData> {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<readonly string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const run = useCallback(async (action: () => Promise<TData>): Promise<TData | null> => {
    setIsLoading(true);
    setError(null);
    setDetails([]);

    try {
      const result = await action();
      setData(result);
      return result;
    } catch (caught) {
      if (caught instanceof ApiError) {
        setError(`${toSafeDisplayText(caught.message)}${caught.correlationId ? ` (correlation: ${toSafeDisplayText(caught.correlationId, 120)})` : ''}`);
        setDetails(toSafeDisplayList(caught.details));
      } else if (caught instanceof Error) {
        setError(toSafeDisplayText(caught.message));
      } else {
        setError('Unexpected frontend error.');
      }
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setDetails([]);
    setIsLoading(false);
  }, []);

  return { data, error, details, isLoading, run, reset };
}
