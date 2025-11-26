import { test, expect } from "@playwright/test";
import { expectHasRequestId, expectHealthy, login, waitForApi } from "./helpers";

test.setTimeout(20_000);

test("create card via dashboard flow and stats respond", async ({ page }) => {
  const email = `cards+${Date.now()}@example.com`;
  const cardName = `Visa Test ${Date.now()}`;

  await login(page, email, "Cards User");
  await page.goto("/dashboard");
  await page.waitForLoadState("networkidle");

  await page.getByLabel("Nombre de la tarjeta").fill(cardName);
  await page.getByLabel("Límite de la tarjeta").fill("10000");
  await page.getByLabel("Día de cierre (1-31)").fill("5");
  await page.getByLabel("Día de vencimiento (1-31)").fill("10");
  await page.getByLabel("Nombre de la compra").fill("Compra tarjeta test");
  await page.getByLabel("Cantidad de cuotas").fill("1");
  await page.getByLabel("Monto de cada cuota").fill("100");
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

  await expect(page.getByText(cardName, { exact: false })).toBeVisible();

  const statsResponse = await waitForApi(page, {
    urlRegex: /\/api\/cards\/stats/,
    status: 200,
  });
  await expectHealthy(statsResponse);
  await expectHasRequestId(statsResponse);
});
