/** Formats a numeric amount with a currency code without using unsafe HTML. */
export function formatMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(amount);
}

/** Formats an ISO date for compact operations screens. */
export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'medium'
  }).format(new Date(value));
}
