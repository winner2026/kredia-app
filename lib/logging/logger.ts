type LogLevel = "info" | "warn" | "error";

type LogContext = Record<string, unknown>;

function format(level: LogLevel, message: string, context?: LogContext) {
  const timestamp = new Date().toISOString();
  const base = { level, timestamp, message, ...context };
  return JSON.stringify(base);
}

export const logger = {
  info(payload: LogContext & { msg: string; requestId?: string }) {
    const { msg, ...ctx } = payload;
    console.info(format("info", msg, ctx));
  },
  warn(payload: LogContext & { msg: string; requestId?: string }) {
    const { msg, ...ctx } = payload;
    console.warn(format("warn", msg, ctx));
  },
  error(payload: LogContext & { msg: string; err?: unknown; requestId?: string }) {
    const { msg, err, ...ctx } = payload;
    const serializedError =
      err instanceof Error
        ? { name: err.name, message: err.message, stack: err.stack }
        : err;
    console.error(format("error", msg, { ...ctx, err: serializedError }));
  },
};
