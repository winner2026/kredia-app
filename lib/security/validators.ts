import { randomUUID } from "crypto";

export function validateUUID(id: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

export function validateTimestamp(ts: string | number, toleranceMs = 5 * 60 * 1000) {
  const num = typeof ts === "string" ? Number(ts) : ts;
  if (!Number.isFinite(num)) return false;
  const now = Date.now();
  return Math.abs(now - num) <= toleranceMs;
}

export function validateNonce(nonce: string) {
  return typeof nonce === "string" && nonce.length >= 8 && nonce.length <= 64;
}

export function newNonce() {
  return randomUUID().replace(/-/g, "");
}
