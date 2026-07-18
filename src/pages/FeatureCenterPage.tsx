import { BankCard } from '../components/BankCard';
import { PageHeading } from '../components/PageHeading';
import { FeatureSeedForm } from '../features/features/FeatureSeedForm';

/** Feature operations page for Redis/PostgreSQL test data. */
export function FeatureCenterPage() {
  return (
    <div className="page-stack">
      <PageHeading
        eyebrow="Feature center"
        title="Manage scoring features"
        description="Prepare feature snapshots that the backend will cache in Redis and keep as durable PostgreSQL fallback data."
      />

      <div className="two-column wide-left">
        <FeatureSeedForm />
        <BankCard eyebrow="Production notes" title="Cache and fallback behavior">
          <div className="copy-block">
            <p>The backend hashes Redis keys before storing customer and merchant feature references.</p>
            <p>When Redis data is missing or slow, scoring falls back to PostgreSQL and finally deterministic safe defaults.</p>
            <p>The UI validates numeric ranges locally, but the backend remains the source of truth for business rules.</p>
          </div>
        </BankCard>
      </div>
    </div>
  );
}
