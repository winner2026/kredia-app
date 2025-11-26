# Alcance del sistema
- Servicios cubiertos: APIs internas autenticadas (overview, cards, purchases, simulator) y frontend de dashboard autenticado.
- Componentes excluidos: landing pública, métricas internas ad-hoc, herramientas de soporte no productivas.
- Telemetría fuente: `api.profile`, `domain.profile`, `prisma.query[.slow|.error]`, `webvitals.metric`, snapshot periódico (`scripts/perf/snapshot.ts`).

# APIs críticas
- `/api/dashboard/overview`
- `/api/cards/*` (creación, stats, preview)
- `/api/purchases/*` (creación, list, projection)
- `/api/simulator/*` (simple, advanced)

# APIs no críticas
- `/api/users`
- Endpoints administrativos o de métricas internas (p.ej. `/api/_metrics/web-vitals`)

# Frontend relevante (dashboard)
- SSR/CSR para la vista de dashboard autenticada y flujos de registro de compras/tarjeta.

# Qué queda fuera
- Landing pública.
- Métricas internas no expuestas a clientes (telemetría técnica interna, traces de CI).

# Backend — SLIs + SLOs
## Latencia (p95/p99) y error rate por endpoint
- `/api/dashboard/overview`: p95 ≤ 250 ms, p99 ≤ 400 ms, error rate (5xx) < 0.5%.
- `/api/cards/*`: p95 ≤ 220 ms, p99 ≤ 350 ms, error rate (5xx) < 0.5%.
- `/api/purchases/*`: p95 ≤ 220 ms, p99 ≤ 350 ms, error rate (5xx) < 0.5%.
- `/api/simulator/*`: p95 ≤ 300 ms, p99 ≤ 450 ms, error rate (5xx) < 1%.

## Criterios de éxito
- 28 días consecutivos cumpliendo p95/p99 y error rate por endpoint.
- Sin ventanas de 1h con error rate > 2% en APIs críticas.

# Frontend — Web Vitals (dashboard)
- LCP: p75 ≤ 2.5 s (mobile + desktop).
- INP: p75 ≤ 200 ms.
- CLS: p75 ≤ 0.1.
- Cubre sólo usuarios autenticados en dashboard; landing excluida.

# Dominio financiero (SLIs/SLOs)
- `calculateMonthlyProjection`: promedio ≤ 50 ms, p95 ≤ 90 ms, p99 ≤ 150 ms.
- `buildSchedule`: promedio ≤ 30 ms, p95 ≤ 60 ms, p99 ≤ 100 ms.
- `assessRisk` (calculateRisk): promedio ≤ 20 ms, p95 ≤ 40 ms, p99 ≤ 60 ms.

# Base de datos (Prisma)
- Slow query threshold: > 100 ms (registrada como `prisma.query.slow`).
- Límites aceptables: p95 de queries ≤ 80 ms, p99 ≤ 120 ms.
- Acción si p99 supera 120 ms en 3 ventanas consecutivas de 1h: abrir incidente P2, activar plan de tuning (índices, N+1, caching).

# Disponibilidad
- Uptime objetivo: 99.9% mensual para APIs críticas.
- Cuenta como downtime: 5xx sostenidos > 2% durante ≥ 5 minutos o caídas de servicio completas.
- No cuenta como downtime: errores de cliente (4xx), mantenimientos planificados anunciados ≥24h antes y <30 min.

# Error Budget
- Cálculo: 100% - SLO de disponibilidad (99.9%) → budget mensual de 0.1% (~43.2 min).
- Umbrales: consumo ≥50% del budget → congelar lanzamientos de riesgo; consumo ≥80% → detener deploys no urgentes; consumo 100% → freeze total salvo fixes.
- Quemado completo: cualquier excedente de downtime sobre 43.2 min/mes dispara “no-go” hasta remediar y pasar 7 días estables.

# Monitoreo
- Logs de profiling: `api.profile` (latencia por endpoint), `domain.profile` (duración + tamaños), `api.profile.error`.
- Prisma slow query: `prisma.query.slow` y `prisma.query.error` con model/action/duration/query/requestId.
- Web Vitals: `webvitals.metric` (LCP/INP/CLS) con valores crudos, agregación p75/p95 offline.
- Snapshot: `scripts/perf/snapshot.ts` agrega average/p95/p99 por endpoint desde logs recientes; almacenar salida para dashboards y tendencias.
- Agregación: métricas se consolidan cada 24h en dashboards internos (p95/p99, error rate, conteo de slow queries, p75 Web Vitals).

# Revisión periódica y gobernanza
- Cadencia: revisión semanal en performance review; revisión formal de SLOs trimestral.
- Responsables: equipo SRE + backend perf owner; frontend perf owner para Web Vitals.
- Actualización de SLOs: requiere aprobación de SRE lead y PM; documentar cambios en este archivo y comunicar en el canal de incidentes/perf.
