import { describe, expect, it } from 'vitest';
import { resolveApiBaseUrl, resolveHttpTimeoutMs } from './appConfig';

describe('appConfig', () => {
  it('accepts http and https API origins', () => {
    expect(resolveApiBaseUrl('https://api.example.test/')).toBe('https://api.example.test');
  });

  it('rejects unsafe URL protocols', () => {
    expect(() => resolveApiBaseUrl('javascript:alert(1)')).toThrow(/http or https/);
  });

  it('bounds invalid timeouts to the default', () => {
    expect(resolveHttpTimeoutMs('100')).toBe(5000);
    expect(resolveHttpTimeoutMs('9000')).toBe(9000);
  });
});
