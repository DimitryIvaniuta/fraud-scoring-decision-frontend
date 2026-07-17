import { NavLink, Outlet } from 'react-router-dom';
import { appConfig } from '../config/appConfig';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: '◆' },
  { to: '/decisions', label: 'Decision Desk', icon: '✓' },
  { to: '/features', label: 'Feature Center', icon: '◈' },
  { to: '/audit', label: 'Audit Trail', icon: '◎' },
  { to: '/settings', label: 'Settings', icon: '⚙' }
] as const;

/** Banking-style layout with persistent header, sidebar, central area, and footer. */
export function AppShell() {
  const isOnline = useNetworkStatus();

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand-card">
          <div className="brand-mark">FS</div>
          <div>
            <strong>FraudShield</strong>
            <span>Decision Console</span>
          </div>
        </div>

        <nav className="side-nav">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-panel">
          <span>Backend</span>
          <strong>{new URL(appConfig.apiBaseUrl).host}</strong>
          <small>Requests use generated correlation IDs.</small>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div>
            <span className="topbar-kicker">Real-time risk operations</span>
            <strong>Banking Fraud Decision Portal</strong>
          </div>
          <div className="topbar-actions" aria-label="Operational indicators" aria-live="polite">
            <span className={isOnline ? 'status-pill online' : 'status-pill offline'}>{isOnline ? 'Browser online' : 'Browser offline'}</span>
            <span>p95 target &lt; 100ms</span>
            <span>Explainable scoring</span>
          </div>
        </header>

        <main id="main-content" className="content-area" tabIndex={-1}>
          <Outlet />
        </main>

        <footer className="footer">
          <span>FraudShield UI · React 19.2 · TypeScript · Vite</span>
          <span>Secure-by-default: CSP, strict typing, no unsafe HTML rendering.</span>
        </footer>
      </div>
    </div>
  );
}
