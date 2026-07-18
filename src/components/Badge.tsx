interface BadgeProps {
  readonly children: string;
  readonly tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
}

/** Small semantic label for statuses and verdicts. */
export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}
