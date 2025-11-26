export function reportWebVitals(metric: unknown) {
  fetch("/api/_metrics/web-vitals", {
    method: "POST",
    body: JSON.stringify(metric),
  });
}
