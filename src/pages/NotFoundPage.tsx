import { Link } from 'react-router-dom';
import { BankCard } from '../components/BankCard';

/** Fallback route for unknown locations. */
export function NotFoundPage() {
  return (
    <BankCard eyebrow="404" title="Page not found">
      <p>The requested console page does not exist.</p>
      <Link className="button primary" to="/dashboard">Return to dashboard</Link>
    </BankCard>
  );
}
