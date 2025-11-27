import { NextRequest } from "next/server";

export function getRequestId(req: Request | NextRequest): string {
  const headerId = req.headers.get("x-request-id");
  if (headerId && headerId.trim().length > 0) return headerId;
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
