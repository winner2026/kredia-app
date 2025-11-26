import { NextRequest } from "next/server";
import { randomUUID } from "crypto";

export function getRequestId(req: Request | NextRequest): string {
  const headerId = req.headers.get("x-request-id");
  return headerId && headerId.trim().length > 0 ? headerId : randomUUID();
}
