#!/usr/bin/env node
const { performance } = require("node:perf_hooks");

async function loadFetch() {
  if (typeof fetch === "function") return fetch;
  try {
    const mod = await import("node-fetch");
    return mod.default;
  } catch (error) {
    throw new Error("fetch is not available and node-fetch is missing");
  }
}

async function loadAutocannon() {
  try {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const mod = await import("autocannon");
    return mod.default || mod;
  } catch (error) {
    throw new Error("autocannon is missing. Install it to run the load test.");
  }
}

const CONFIG = {
  baseUrl: process.env.BASE_URL ?? "http://localhost:3000",
  userId: process.env.AB_USER_ID,
  cardId: process.env.AB_CARD_ID,
  cookie: process.env.AB_COOKIE,
};

function requireEnv() {
  const missing = Object.entries(CONFIG)
    .filter(([key, value]) => value === undefined || value === "")
    .map(([key]) => key);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  }
}

function jsonDiff(a, b, path = "") {
  const diffs = [];
  if (a === b) return diffs;
  if (typeof a !== typeof b) {
    diffs.push(path || "root");
    return diffs;
  }
  if (a === null || b === null) {
    if (a !== b) diffs.push(path || "root");
    return diffs;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) diffs.push(`${path || "root"}.length`);
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i += 1) {
      const childDiffs = jsonDiff(a[i], b[i], `${path}[${i}]`);
      diffs.push(...childDiffs);
    }
    return diffs;
  }
  if (typeof a === "object" && typeof b === "object") {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    keys.forEach((key) => {
      const childDiffs = jsonDiff(a[key], b[key], path ? `${path}.${key}` : key);
      diffs.push(...childDiffs);
    });
    return diffs;
  }
  if (a !== b) diffs.push(path || "root");
  return diffs;
}

async function invalidateAll(fetchFn) {
  const endpoints = [
    "/api/cache/invalidate",
    "/api/cache/invalidate-all",
    "/api/debug/cache/invalidate",
  ];

  for (const route of endpoints) {
    try {
      const res = await fetchFn(`${CONFIG.baseUrl}${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: CONFIG.cookie,
        },
        body: JSON.stringify({
          userId: CONFIG.userId,
          cardId: CONFIG.cardId,
        }),
      });
      if (res.ok) return true;
    } catch (error) {
      // continue trying other routes
    }
  }
  return false;
}

async function measureLatency(fetchFn, endpoint) {
  const start = performance.now();
  const res = await fetchFn(`${CONFIG.baseUrl}${endpoint}`, {
    headers: { Cookie: CONFIG.cookie, Accept: "application/json" },
  });
  const dur = performance.now() - start;
  let json;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { dur, status: res.status, ok: res.ok, json };
}

function formatMs(value) {
  return `${value.toFixed(2)} ms`;
}

async function runAB(fetchFn, endpoint) {
  await invalidateAll(fetchFn);
  const cold = await measureLatency(fetchFn, endpoint);
  const warm = await measureLatency(fetchFn, endpoint);
  const diff = jsonDiff(cold.json, warm.json);
  const improvement = cold.dur - warm.dur;
  return {
    endpoint,
    cold,
    warm,
    consistent: diff.length === 0,
    diff,
    improvement,
  };
}

async function runLoadTest(fetchFn, autocannonFn, endpoint) {
  return new Promise((resolve, reject) => {
    const instance = autocannonFn(
      {
        url: `${CONFIG.baseUrl}${endpoint}`,
        method: "GET",
        duration: 10,
        connections: 10,
        headers: { Cookie: CONFIG.cookie, Accept: "application/json" },
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      },
    );
    instance.on("reqError", () => {});
  });
}

function printABReport(result) {
  const improvementPercent = result.cold.dur > 0
    ? ((result.improvement / result.cold.dur) * 100)
    : 0;
  console.log("== A/B Performance Report ==");
  console.log(`endpoint: ${result.endpoint}`);
  console.log(`cold: ${formatMs(result.cold.dur)}`);
  console.log(`warm: ${formatMs(result.warm.dur)}`);
  console.log(
    `improvement: ${formatMs(result.improvement)} (${improvementPercent.toFixed(2)}%)`,
  );
  console.log(`consistent: ${result.consistent}`);
  console.log("");
}

function printLoadReport(result) {
  console.log("== Load Test Summary ==");
  console.log(`rps: ${result.requests.average.toFixed(2)}`);
  console.log(`latency_p95: ${result.latency.p95.toFixed(2)}`);
  console.log(`latency_p99: ${result.latency.p99.toFixed(2)}`);
  console.log("");
}

async function main() {
  requireEnv();
  const fetchFn = await loadFetch();
  const autocannonFn = await loadAutocannon();

  const endpoints = [
    "/api/dashboard/overview",
    `/api/cards/stats?cardId=${encodeURIComponent(CONFIG.cardId)}`,
    `/api/purchases/projection?cardId=${encodeURIComponent(CONFIG.cardId)}`,
  ];

  const abResults = [];
  for (const endpoint of endpoints) {
    const result = await runAB(fetchFn, endpoint);
    abResults.push(result);
    printABReport(result);
  }

  const loadResult = await runLoadTest(fetchFn, autocannonFn, "/api/dashboard/overview");
  printLoadReport(loadResult);

  return { abResults, loadResult };
}

main().catch((error) => {
  console.error("AB test failed:", error);
  process.exit(1);
});
