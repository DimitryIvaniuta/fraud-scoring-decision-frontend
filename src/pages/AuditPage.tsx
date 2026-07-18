import { BankCard } from '../components/BankCard';
import { PageHeading } from '../components/PageHeading';

/** Static audit guidance page for operators and QA. */
export function AuditPage() {
  return (
    <div className="page-stack">
      <PageHeading
        eyebrow="Audit trail"
        title="Decision explainability and retry controls"
        description="Understand which backend fields provide auditability for each transaction decision."
      />

      <div className="two-column">
        <BankCard eyebrow="Stored decision" title="Audit fields to verify">
          <ul className="check-list">
            <li><strong>transactionId</strong> proves the retry and lookup key.</li>
            <li><strong>modelVersion</strong> identifies the scoring policy used at decision time.</li>
            <li><strong>reasons</strong> explain every risk contribution.</li>
            <li><strong>requestFingerprint</strong> in the backend guards against changed payload retries.</li>
            <li><strong>correlationId</strong> connects UI, API logs, database row, and Kafka outbox.</li>
          </ul>
        </BankCard>

        <BankCard eyebrow="Outbox" title="Event publication safety">
          <p className="copy-block">
            The backend records decisions and outbox events in the same database transaction. Kafka publishing is retried by an outbox worker so a successful API response does not depend on Kafka latency.
          </p>
        </BankCard>
      </div>
    </div>
  );
}
