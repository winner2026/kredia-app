import { handlers } from "@/lib/auth";
import { ensureRateLimit } from "@/lib/security/rateLimit";
import { NextResponse } from "next/server";
import { getRequestId } from "@/lib/observability/request";
import { profileApi } from "@/lib/perf/apiProfiler";

export async function GET(req: Request, ctx: unknown) {
  const requestId = getRequestId(req);
  return profileApi("auth.GET", requestId, async () => {
    const rate = await ensureRateLimit(req, { max: 20, windowMs: 60_000 });
    if (!rate.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    // @ts-expect-error NextAuth handler signature passthrough
    return handlers.GET(req, ctx);
  });
}

export async function POST(req: Request, ctx: unknown) {
  const requestId = getRequestId(req);
  return profileApi("auth.POST", requestId, async () => {
    const rate = await ensureRateLimit(req, { max: 20, windowMs: 60_000 });
    if (!rate.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    // @ts-expect-error NextAuth handler signature passthrough
    return handlers.POST(req, ctx);
  });
}
