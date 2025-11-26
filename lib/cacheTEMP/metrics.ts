let hits = 0;
let misses = 0;

export function registerHit() {
  hits += 1;
}

export function registerMiss() {
  misses += 1;
}

export function getCacheStats() {
  return { hits, misses };
}
