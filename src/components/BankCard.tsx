import type { ReactNode } from 'react';

interface BankCardProps {
  readonly actions?: ReactNode;
  readonly children: ReactNode;
  readonly eyebrow?: string;
  readonly title: string;
}

/** Reusable card following the banking dashboard visual system. */
export function BankCard({ actions, children, eyebrow, title }: BankCardProps) {
  return (
    <section className="bank-card">
      <div className="bank-card-header">
        <div>
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <h2>{title}</h2>
        </div>
        {actions ? <div className="bank-card-actions">{actions}</div> : null}
      </div>
      {children}
    </section>
  );
}
