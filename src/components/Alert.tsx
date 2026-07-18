interface AlertProps {
  readonly details?: readonly string[];
  readonly message: string;
  readonly tone?: 'error' | 'success' | 'warning' | 'info';
}

/** Accessible status alert used for API and validation feedback. */
export function Alert({ details = [], message, tone = 'info' }: AlertProps) {
  return (
    <div className={`alert alert-${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <strong>{message}</strong>
      {details.length > 0 ? (
        <ul>
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
