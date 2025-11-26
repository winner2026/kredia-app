import { NextResponse } from "next/server";
import { logger } from "@/lib/logging/logger";
import { getRequestId } from "@/lib/observability/request";
import { profileApi } from "@/lib/perf/apiProfiler";

export async function POST(req: Request) {
  const requestId = getRequestId(req);
  return profileApi("metrics.webVitals", requestId, async () => {
    const metric = await req.json();
    logger.info({
      msg: "webvitals.metric",
      metric,
      value: (metric as { value?: number })?.value,
      requestId,
    });
    return NextResponse.json({ success: true });
  });
}
