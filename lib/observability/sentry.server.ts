import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

let sentryInited = false;

const DEFAULT_TRACE_SAMPLE_RATE = process.env.NODE_ENV === "production" ? 0.2 : 1.0;

export function initSentryServer() {
  if (sentryInited || !process.env.SENTRY_DSN) return;

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.SENTRY_ENV || process.env.NODE_ENV || "development",
    release: process.env.GITHUB_SHA || process.env.VERCEL_GIT_COMMIT_SHA,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? DEFAULT_TRACE_SAMPLE_RATE),
    profilesSampleRate: 0, // deshabilitado por defecto
    integrations: [nodeProfilingIntegration()],
    beforeSend(event) {
      // Sanitizar PII
      if (event.user) {
        delete (event.user as any).email;
        delete (event.user as any).name;
      }
      if (event.request?.headers) {
        delete (event.request.headers as any).authorization;
        delete (event.request.headers as any).cookie;
      }
      return event;
    },
  });

  sentryInited = true;
}

export function captureException(error: unknown, metadata?: Record<string, unknown>) {
  if (!sentryInited) return;
  Sentry.captureException(error, (scope) => {
    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => scope.setExtra(key, value));
    }
    return scope;
  });
}

export function addRequestIdToScope(requestId?: string, traceId?: string) {
  if (!sentryInited) return;
  if (requestId) Sentry.setTag("request_id", requestId);
  if (traceId) Sentry.setTag("trace_id", traceId);
}

export function getSentry() {
  return Sentry;
}
