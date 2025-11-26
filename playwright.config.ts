import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  retries: 1,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    trace: "on-first-retry",
    video: "on-first-retry",
  },
});
