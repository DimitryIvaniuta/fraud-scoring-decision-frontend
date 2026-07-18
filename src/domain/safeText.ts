const WHITESPACE_PATTERN = /\s+/g;

function stripControlCharacters(value: string): string {
  return [...value]
    .map((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return codePoint <= 31 || codePoint === 127 ? ' ' : character;
    })
    .join('');
}

/**
 * Normalizes backend-provided text before displaying it in the browser.
 * React escapes text by default; this helper additionally caps length and removes control characters.
 */
export function toSafeDisplayText(value: string, maxLength = 260): string {
  const normalized = stripControlCharacters(value).replace(WHITESPACE_PATTERN, ' ').trim();
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1)}…` : normalized;
}

/** Converts backend detail arrays into a bounded list so error pages cannot flood the UI. */
export function toSafeDisplayList(values: readonly string[], maxItems = 6): readonly string[] {
  return values.slice(0, maxItems).map((value) => toSafeDisplayText(value, 220));
}
