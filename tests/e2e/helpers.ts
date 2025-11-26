import { expect, Page, APIResponse, Response } from "@playwright/test";

export async function login(page: Page, email: string, name = "Playwright User") {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  const nameInput = page.getByLabel("Nombre (opcional)");
  if (await nameInput.count()) {
    await nameInput.fill(name);
  }
  await page.getByRole("button", { name: /entrar/i }).click();
  await page.waitForURL(/\/dashboard/);
}

export async function expectHasRequestId(response: APIResponse | Response) {
  const header = await response.headerValue("x-request-id");
  expect(header).toBeDefined();
  expect(String(header || "")).not.toHaveLength(0);
}

export async function expectHealthy(response: APIResponse | Response) {
  const status = response.status();
  expect(status, "unexpected auth failure").not.toBe(401);
  expect(status, "rate limited").not.toBe(429);
  expect(status, "server error").toBeLessThan(500);
}

type WaitForApiOptions = {
  urlRegex: RegExp;
  method?: string;
  status?: number;
};

export async function waitForApi(page: Page, options: WaitForApiOptions) {
  const resp = await page.waitForResponse((res) => {
    const urlOk = options.urlRegex.test(res.url());
    const methodOk = options.method ? res.request().method() === options.method : true;
    const statusOk = options.status ? res.status() === options.status : res.status() < 500;
    return urlOk && methodOk && statusOk;
  });
  await expectHealthy(resp);
  await expectHasRequestId(resp);
  return resp;
}
