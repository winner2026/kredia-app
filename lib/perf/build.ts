export async function analyzeBundle() {
  // Stub para análisis de bundle; integrar con next-bundle-analyzer si se requiere
  return { totalSize: null, chunks: [] };
}

export function findUnusedImports(_code: string) {
  // Stub: usar herramientas como ts-prune o custom AST
  return [];
}

export async function measureBuildTime<T>(label: string, fn: () => Promise<T>): Promise<{ result: T; timeMs: number }> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  return { result, timeMs: end - start };
}
