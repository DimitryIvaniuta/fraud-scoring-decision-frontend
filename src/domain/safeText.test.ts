import { describe, expect, it } from 'vitest';
import { toSafeDisplayList, toSafeDisplayText } from './safeText';

describe('safe display text utilities', () => {
  it('removes control characters and collapses whitespace', () => {
    expect(toSafeDisplayText('Backend\n\tmessage\u0000  details')).toBe('Backend message details');
  });

  it('caps long messages and detail lists', () => {
    expect(toSafeDisplayText('x'.repeat(20), 5)).toBe('xxxx…');
    expect(toSafeDisplayList(['one', 'two', 'three'], 2)).toEqual(['one', 'two']);
  });
});
