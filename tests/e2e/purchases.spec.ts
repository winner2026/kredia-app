import { test, expect } from "@playwright/test";
import { expectHasRequestId, expectHealthy, login, waitForApi } from "./helpers";

test.setTimeout(20_000);

test("create purchase updates projections and freedom date", async ({ page }) => {
  const email = `purchases+${Date.now()}@example.com`;
  const cardName = `Card ${Date.now()}`;
  const purchaseName = `Compra Playwright ${Date.now()}`;

  await login(page, email, "Purchases User");
  await page.goto("/dashboard");
  await page.waitForLoadState("networkidle");

  await page.getByLabel("Nombre de la tarjeta").fill(cardName);
  await page.getByLabel("Límite de la tarjeta").fill("15000");
  await page.getByLabel("Día de cierre (1-31)").fill("8");
  await page.getByLabel("Día de vencimiento (1-31)").fill("15");
  await page.getByLabel("Nombre de la compra").fill(purchaseName);
  await page.getByLabel("Cantidad de cuotas").fill("6");
  await page.getByLabel("Monto de cada cuota").fill("1500");
  await page.getByLabel("Cuotas pagadas").fill("0");

  const purchaseResponsePromise = waitForApi(page, {
    urlRegex: /\/api\/purchases/,
    method: "POST",
    status: 200,
  });

  await page.getByRole("button", { name: /Registrar compra/i }).click();

  const purchaseResponse = await purchaseResponsePromise;
  await expectHealthy(purchaseResponse);
  await expectHasRequestId(purchaseResponse);

  await expect(page.getByText(purchaseName, { exact: false })).toBeVisible();
  await expect(page.getByText(/Proyección a 12 meses/i)).toBeVisible();

  const overviewResponse = await waitForApi(page, {
    urlRegex: /\/api\/dashboard\/overview/,
    status: 200,
  });
  await expectHealthy(overviewResponse);
  await expectHasRequestId(overviewResponse);
});
