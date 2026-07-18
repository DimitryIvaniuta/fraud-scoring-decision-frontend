import { useCallback, useEffect, useState } from 'react';
import { fraudApi } from '../api/fraudApi';

export type BackendHealthState = 'checking' | 'up' | 'degraded' | 'down';

export interface BackendHealthSnapshot {
  readonly checkedAt: string | null;
  readonly refresh: () => Promise<void>;
  readonly state: BackendHealthState;
}

const DEFAULT_POLL_INTERVAL_MS = 30_000;

/**
 * Polls Spring Actuator health with cleanup-safe React effects.
 * The dashboard and shell can share this lightweight status without blocking user workflows.
 */
export function useBackendHealth(pollIntervalMs = DEFAULT_POLL_INTERVAL_MS): BackendHealthSnapshot {
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [state, setState] = useState<BackendHealthState>('checking');

  const refresh = useCallback(async () => {
    try {
      const health = await fraudApi.getHealth();
      const normalizedStatus = health.status.toUpperCase();
      setState(normalizedStatus === 'UP' ? 'up' : normalizedStatus === 'OUT_OF_SERVICE' ? 'down' : 'degraded');
    } catch {
      setState('down');
    } finally {
      setCheckedAt(new Date().toISOString());
    }
  }, []);

  useEffect(() => {
    const immediateId = window.setTimeout(() => {
      void refresh();
    }, 0);
    const intervalId = window.setInterval(() => {
      void refresh();
    }, pollIntervalMs);

    return () => {
      window.clearTimeout(immediateId);
      window.clearInterval(intervalId);
    };
  }, [pollIntervalMs, refresh]);

  return { checkedAt, refresh, state };
}
