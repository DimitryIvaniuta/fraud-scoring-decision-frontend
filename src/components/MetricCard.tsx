interface MetricCardProps {
  readonly label: string;
  readonly trend?: string;
  readonly value: string;
}

/** Compact metric tile for the dashboard overview. */
export function MetricCard({ label, trend, value }: MetricCardProps) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {trend ? <small>{trend}</small> : null}
    </article>
  );
}
