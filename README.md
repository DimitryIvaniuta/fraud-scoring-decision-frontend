# fraud-scoring-decision-frontend

Production-grade banking-style frontend for the `fraud-scoring-decision-service` backend.

## GitHub repository metadata

- Repository name: `fraud-scoring-decision-frontend`
- Description: `React 19.2 and TypeScript banking-style operations console for real-time fraud scoring, decision explainability, feature seeding, durable lookup, backend health monitoring, and frontend contract validation.`
- Main branch: `main`
- Suggested topics: `react-19`, `typescript`, `vite`, `playwright`, `fraud-detection`, `banking-ui`, `web-security`, `frontend`, `zod`

## Technology choices

- React 19.2.7 and React DOM 19.2.7 for the requested React 19.2 runtime line.
- Vite 8.1.3 for fast development and optimized production builds.
- TypeScript 6.0.3 with strict compiler options.
- React Router DOM 7.18.1 for client-side routing.
- Zod 4.4.3 for request and response schema validation that mirrors backend contracts.
- Playwright 1.61.1 for essential E2E workflow tests.
- ESLint 10 with type-aware TypeScript rules, React Hooks checks, and React compiler-oriented safety rules.

## Implemented frontend scope

| Backend capability | Frontend implementation |
| --- | --- |
| `POST /api/v1/fraud/decisions` | Decision Desk scoring form with validation and result panel. |
| `GET /api/v1/fraud/decisions/{transactionId}` | Durable decision lookup form. |
| `PUT /api/v1/fraud/features` | Feature Center seeding form for Redis/PostgreSQL feature data. |
| `/actuator/health` | Dashboard backend health tile with manual refresh and polling. |
| Explainability | Reason list, score gauge, model version, feature source, cache hit, and replay metadata. |
| Consistent retries | Local session audit shows idempotent replay responses from the backend. |
| Banking layout | Persistent header, sidebar, central workspace, footer, cards, metric tiles, and audit/settings pages. |

## Production-grade updates in this version

- Runtime validation for backend decision, feature, and health responses before rendering.
- Friendly API contract-drift error if backend JSON no longer matches the frontend schema.
- Safe display-text helpers to cap backend error details and strip control characters.
- Application error boundary to avoid a blank console after unexpected rendering errors.
- Browser online/offline indicator in the top bar.
- Polling backend health hook with manual refresh and last-checked timestamp.
- More accessible form controls through `aria-describedby` and stable generated IDs.
- Accessible SVG score gauge title.
- Skip-to-content link for keyboard users.
- Stronger Nginx deployment headers, including cross-origin isolation-related headers and `server_tokens off`.
- CI now includes `npm audit --omit=dev`.
- Additional unit tests for runtime API schemas and safe error text normalization.

## Security hardening

- No `dangerouslySetInnerHTML` usage.
- No transaction payload logging in the browser.
- Generated non-sensitive `X-Correlation-Id` for every API request.
- Build-time API URL validation accepts only `http` and `https` protocols.
- Request timeout through `AbortController`.
- JSON content-type verification before successful API payload parsing.
- Strict TypeScript settings: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, and unused checks.
- Zod validation before API calls and after API responses.
- CSP in `index.html` and `nginx.conf`.
- Nginx security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, `X-Permitted-Cross-Domain-Policies`.
- No authentication token storage because the current backend has no auth endpoint; add short-lived HTTP-only cookie or gateway session flow when backend auth is introduced.

## Local development

```bash
npm ci
cp .env.example .env
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

Expected backend URL:

```text
http://localhost:8080
```

Start the backend stack from the Java service project first:

```bash
docker compose up --build
```

## Validation commands

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run audit:prod
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run e2e
```

Or run the combined non-browser validation:

```bash
npm run validate
```

## Production build

```bash
npm run build
npm run preview
```

## Docker build

```bash
docker build -t fraud-scoring-decision-frontend:latest .
docker run --rm -p 8081:8080 fraud-scoring-decision-frontend:latest
```

## Pages

- Dashboard: backend health, latency target, explainability and retry overview.
- Decision Desk: score transaction, lookup decision, inspect response, local session audit table.
- Feature Center: seed feature snapshots used by Redis/PostgreSQL fallback.
- Audit Trail: guide to model version, request fingerprint, correlation ID, and outbox auditability.
- Settings: runtime configuration and frontend safeguards.

## E2E tests

E2E tests mock backend responses with Playwright routes, so the tests verify the frontend workflow without requiring PostgreSQL, Redis, Kafka, or the Java service to run.
