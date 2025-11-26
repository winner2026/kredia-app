export function buildCsp() {
  // Ajustable según despliegue; baseline para Next.js
  return [
    "default-src 'self'",
    "img-src 'self' blob: data:",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
  ].join("; ");
}
