import * as Sentry from "@sentry/nextjs";
import type { ReactNode } from "react";

let sentryInited = false;

export function initSentryClient() {
  if (sentryInited || !process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.SENTRY_ENV || process.env.NODE_ENV || "development",
    tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 1.0),
    beforeSend(event) {
      // Sanitizar PII en cliente también
      if (event.user) {
        delete (event.user as any).email;
        delete (event.user as any).name;
      }
      return event;
    },
  });
  sentryInited = true;
}

export function SentryErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <Sentry.ErrorBoundary fallback={<h1>Algo salió mal.</h1>}>
      {children}
    </Sentry.ErrorBoundary>
  );
}

export { Sentry };
