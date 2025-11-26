import { cache } from "react";

type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const rscCacheStore = new Map<string, CacheEntry<unknown>>();

export async function cacheRSC<T>(key: string, fn: () => Promise<T>, ttlMs = 5 * 60 * 1000): Promise<T> {
  const now = Date.now();
  const entry = rscCacheStore.get(key);
  if (entry && entry.expiresAt > now) {
    return entry.value as T;
  }
  const value = await fn();
  rscCacheStore.set(key, { value, expiresAt: now + ttlMs });
  return value;
}

export function deferClient<T extends (...args: any[]) => Promise<any>>(fn: T) {
  let promise: ReturnType<T> | null = null;
  return (...args: Parameters<T>) => {
    if (!promise) {
      promise = fn(...args);
    }
    return promise;
  };
}

export function profilingBoundary<T>(label: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line no-console
    console.log(`[profiling] ${label}: ${(end - start).toFixed(2)}ms`);
  }
  return result;
}

export async function getBuildMetrics() {
  // Stub para recolección de métricas de build; en entornos reales, se puede leer .next/trace o usar next-analyze.
  return {
    bundleSize: null,
    buildTimeMs: null,
    chunks: [],
  };
}
