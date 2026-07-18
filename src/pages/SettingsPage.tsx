import { BankCard } from '../components/BankCard';
import { PageHeading } from '../components/PageHeading';
import { appConfig } from '../config/appConfig';

/** Settings and security posture page. */
export function SettingsPage() {
  return (
    <div className="page-stack">
      <PageHeading
        eyebrow="Settings"
        title="Runtime configuration"
        description="Review frontend runtime values and hardening choices without exposing sensitive backend data."
      />

      <div className="two-column">
        <BankCard eyebrow="Environment" title="API connection">
          <dl className="definition-grid single-column">
            <div>
              <dt>API base URL</dt>
              <dd>{appConfig.apiBaseUrl}</dd>
            </div>
            <div>
              <dt>HTTP timeout</dt>
              <dd>{appConfig.httpTimeoutMs} ms</dd>
            </div>
          </dl>
        </BankCard>

        <BankCard eyebrow="Security" title="Frontend safeguards">
          <ul className="check-list">
            <li>No <code>dangerouslySetInnerHTML</code> usage.</li>
            <li>No transaction payload logging.</li>
            <li>Build-time API origin validation.</li>
            <li>Content Security Policy in <code>index.html</code> and Nginx config.</li>
            <li>Strict TypeScript and Zod validation before API calls.</li>
          </ul>
        </BankCard>
      </div>
    </div>
  );
}
