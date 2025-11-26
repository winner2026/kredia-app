import { test, expect } from "@playwright/test";
import { expectHasRequestId, expectHealthy, login, waitForApi } from "./helpers";

test.setTimeout(20_000);

test("dashboard overview loads after login and shows projection info", async ({ page }) => {
  const email = `dashboard+${Date.now()}@example.com`;
  await login(page, email, "Dashboard User");

  await page.goto("/dashboard");
  await page.waitForLoadState("networkidle");
  await expect(page.getByRole("heading", { name: /Dashboard de compras/i })).toBeVisible();
  await expect(page.getByText(/Proyección a 12 meses/i)).toBeVisible();

  const overviewResponse = await waitForApi(page, {
    urlRegex: /\/api\/dashboard\/overview/,
    status: 200,
  });
  await expectHealthy(overviewResponse);
  await expectHasRequestId(overviewResponse);

  await expect(page.getByText(/SIN DEUDAS/i)).toBeVisible();
  await expect(page.getByText(/Proyección a 12 meses/i)).toBeVisible();
});
