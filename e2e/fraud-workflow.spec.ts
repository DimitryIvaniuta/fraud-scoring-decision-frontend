import { expect, test } from '@playwright/test';

const decisionResponse = {
  decisionId: 'decision-e2e-1',
  transactionId: 'tx-ui-1001',
  modelVersion: 'rules-2026-07-04',
  verdict: 'REVIEW',
  score: 55,
  reasons: [
    {
      code: 'UNUSUAL_AMOUNT',
      message: 'Amount is above 4.0x historical average for this customer and merchant',
      contribution: 28
    }
  ],
  featureSource: 'REDIS',
  cacheHit: true,
  idempotentReplay: false,
  decisionTimeMs: 8,
  correlationId: 'e2e-correlation',
  createdAt: '2026-07-04T10:00:00Z'
};

test.beforeEach(async ({ page }) => {
  await page.route('**/actuator/health', async (route) => {
    await route.fulfill({ json: { status: 'UP' } });
  });

  await page.route('**/api/v1/fraud/features', async (route) => {
    const payload = route.request().postDataJSON() as Record<string, unknown>;
    await route.fulfill({ json: payload });
  });

  await page.route('**/api/v1/fraud/decisions', async (route) => {
    await route.fulfill({ json: decisionResponse });
  });

  await page.route('**/api/v1/fraud/decisions/*', async (route) => {
    await route.fulfill({ json: { ...decisionResponse, idempotentReplay: true } });
  });
});

test('operator can seed features score a transaction and lookup a recorded decision', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: /real-time decision dashboard/i })).toBeVisible();
  await expect(page.getByText('UP', { exact: true })).toBeVisible();

  await page.getByRole('link', { name: /feature center/i }).click();
  await page.getByRole('button', { name: /seed features/i }).click();
  await expect(page.getByText(/feature snapshot saved/i)).toBeVisible();

  await page.getByRole('link', { name: /decision desk/i }).click();
  await page.getByRole('button', { name: /^score transaction$/i }).click();
  await expect(page.getByRole('heading', { name: /transaction tx-ui-1001/i })).toBeVisible();
  await expect(page.getByText('UNUSUAL_AMOUNT', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: /^lookup$/i }).click();
  await expect(page.getByText(/retry replay/i)).toBeVisible();
  await expect(page.getByRole('cell', { name: 'tx-ui-1001' }).first()).toBeVisible();
});

test('client validation prevents invalid currency before backend request', async ({ page }) => {
  let requestCount = 0;
  await page.route('**/api/v1/fraud/decisions', async (route) => {
    requestCount += 1;
    await route.fulfill({ json: decisionResponse });
  });

  await page.goto('/decisions');
  await page.getByLabel('Currency').fill('P1N');
  await page.getByRole('button', { name: /^score transaction$/i }).click();

  await expect(page.getByText(/currency must be an iso-like/i)).toBeVisible();
  expect(requestCount).toBe(0);
});
