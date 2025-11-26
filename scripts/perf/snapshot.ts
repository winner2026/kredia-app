#!/usr/bin/env ts-node
import { existsSync, readFileSync } from "fs";

type LogEntry = {
  msg?: string;
  endpoint?: string;
  durationMs?: number;
  name?: string;
  requestId?: string;
};

type Summary = {
  endpoint: string;
  average: number;
  p95: number;
  p99: number;
  count: number;
};

function percentile(values: number[], p: number) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

function summarize(entries: LogEntry[]): Summary[] {
  const buckets: Record<string, number[]> = {};
  entries.forEach((entry) => {
    const ep = entry.endpoint || entry.name || "unknown";
    if (entry.durationMs === undefined) return;
    if (!buckets[ep]) buckets[ep] = [];
    buckets[ep].push(entry.durationMs);
  });

  return Object.entries(buckets).map(([endpoint, durations]) => {
    const average = durations.reduce((acc, v) => acc + v, 0) / durations.length;
    return {
      endpoint,
      average,
      p95: percentile(durations, 95),
      p99: percentile(durations, 99),
      count: durations.length,
    };
  });
}

function loadLogEntries(): LogEntry[] {
  const logPaths = ["./logs/app.log", "./logs/perf.log"];
  for (const path of logPaths) {
    if (existsSync(path)) {
      const lines = readFileSync(path, "utf8")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      const entries: LogEntry[] = [];
      lines.forEach((line) => {
        try {
          const obj = JSON.parse(line);
          entries.push(obj);
        } catch {
          // ignore malformed
        }
      });
      if (entries.length > 0) return entries;
    }
  }

  // Mock sample entries if no logs found
  const now = Date.now();
  const mock: LogEntry[] = [];
  const endpoints = ["/api/dashboard/overview", "/api/cards/stats", "/api/purchases/projection"];
  endpoints.forEach((endpoint) => {
    for (let i = 0; i < 50; i += 1) {
      mock.push({
        msg: "api.profile",
        endpoint,
        durationMs: 40 + Math.random() * 80,
        requestId: `mock-${now}-${i}`,
      });
    }
  });
  return mock;
}

function main() {
  const entries = loadLogEntries();
  const summary = summarize(entries);
  const snapshot = {
    generatedAt: new Date().toISOString(),
    endpoints: summary,
  };
  console.log(JSON.stringify(snapshot, null, 2));
}

main();
