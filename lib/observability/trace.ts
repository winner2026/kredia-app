import { randomUUID } from "crypto";
import { logger } from "@/lib/logging/logger";

export type Trace = {
  id: string;
  name: string;
  data: Record<string, unknown>;
  requestId?: string;
  add: (key: string, value: unknown) => void;
  end: () => void;
};

export function startTrace(name: string, requestId?: string): Trace {
  const id = randomUUID();
  const data: Record<string, unknown> = {};

  return {
    id,
    name,
    data,
    requestId,
    add: (key, value) => {
      data[key] = value;
    },
    end: () => {
      logger.info({ msg: "trace.end", traceId: id, name, requestId, ...data });
    },
  };
}

export async function withTrace<T>(
  name: string,
  req: Request,
  fn: (trace: Trace) => Promise<T>,
): Promise<T> {
  const trace = startTrace(name, req.headers.get("x-request-id") ?? undefined);
  trace.add("route", (req as any).nextUrl?.pathname ?? "");
  try {
    const result = await fn(trace);
    trace.end();
    return result;
  } catch (error) {
    trace.add("error", error instanceof Error ? error.message : String(error));
    trace.end();
    throw error;
  }
}
