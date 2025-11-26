import { test, expect } from "@playwright/test";
import { expectHasRequestId, expectHealthy, waitForApi } from "./helpers";

test.setTimeout(20_000);

test("login via credentials redirects dashboard and sets X-Request-ID", async ({ page }) => {
  const email = `test+${Date.now()}@example.com`;

  // Ir directo al dashboard debe redirigir a login
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);

  // Completar login
  await page.getByLabel("Email").fill(email);
  const nameInput = page.getByLabel("Nombre (opcional)");
  if (await nameInput.count()) {
    await nameInput.fill("Playwright Auth");
  }
  await page.getByRole("button", { name: /entrar/i }).click();

  await page.waitForURL(/\/dashboard/);
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { name: /Dashboard de compras/i })).toBeVisible();

  const overviewResponse = await waitForApi(page, {
    urlRegex: /\/api\/dashboard\/overview/,
    status: 200,
  });
  await expectHealthy(overviewResponse);
  await expectHasRequestId(overviewResponse);
});
