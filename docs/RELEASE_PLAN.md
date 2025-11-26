# Introducción

## Propósito del documento
Definir el plan de lanzamiento de la v1 con criterios claros de calidad, seguridad y performance, asegurando trazabilidad y acciones ante contingencias.

## Alcance
- Backend: APIs críticas (overview, cards, purchases, simulator), dominio financiero, base de datos, caching, observabilidad.
- Frontend: dashboard autenticado, Web Vitals, integración con APIs.
- Infraestructura: CI/CD, entornos preview/staging/producción, Redis (si aplica), Sentry, logging.
- Seguridad: auth/RBAC, rate limiting, replay protection, auditoría.

# Prerrequisitos técnicos
- CI verde (lint, typecheck, unit, e2e).
- Variables de entorno correctas en el entorno destino.
- Migraciones aplicadas y verificadas.
- Redis disponible y reachable (si aplica).
- Sentry activo y capturando eventos.
- Logs operativos con requestId.

# Validación funcional (QA)
- Login exitoso y manejo de sesión.
- Dashboard: carga de overview sin errores.
- Creación de tarjetas: flujo completo y persistencia.
- Creación de compras: flujo completo y persistencia.
- Proyección: cálculo y render de proyecciones coherentes.
- Simuladores (simple/advanced): cálculo y respuesta consistente.
- Errores esperados: inputs inválidos devuelven 4xx y mensajes claros.

# Validación de seguridad
- Auth y RBAC activos; acceso restringido a usuarios autenticados/autorizados.
- Rate limiting efectivo en APIs públicas/internas.
- Replay protection en endpoints sensibles.
- Auditoría activa para acciones críticas.
- Roles aplicados donde corresponda.
- Endpoints críticos protegidos (overview, cards, purchases, simulator).
- Sin exposición de datos sensibles en respuestas ni logs.

# Validación de performance (basado en SLO/SLI)
- p95/p99 API overview dentro de objetivos.
- p95 cards dentro de objetivos.
- p95 purchases dentro de objetivos.
- Dominio projection time dentro de objetivos.
- Slow queries Prisma bajo umbral; sin p99 > 120 ms sostenido.
- Web Vitals LCP/INP dentro de SLO (p75).
- Snapshot perf-snapshot-vN.json generado y revisado.
- Criterios go/no-go: se lanza sólo si todos los SLO/SLIs anteriores cumplen; cualquier brecha → no-go hasta remediar.

# Plan de despliegue (rollout)
1. Crear release branch.
2. Deploy en preview/staging.
3. Ejecutar validación QA + performance en staging.
4. Obtener aprobación (Eng Lead + SRE + PM).
5. Merge a main.
6. Deploy a producción.
7. Smoke test post-deploy (API críticas + dashboard).
8. Monitoreo inicial 30 min (errores, latencias, slow queries, Web Vitals early).

# Plan de rollback
- Condiciones: error rate > 2% sostenido, p99 fuera de SLO, incidentes de seguridad, corrupción de datos, fallas críticas funcionales.
- Pasos: detener tráfico nuevo si aplica, revertir deploy a versión previa estable, aplicar rollback de migraciones si corresponde, limpiar cache si es necesario.
- Validación post-rollback: smoke tests básicos en prod, verificación de métricas de error/latencia, integridad de datos.
- Comunicación interna: notificar en canal de incidentes y de release, documentar causa y acciones.

# Checklist final de lanzamiento
- [ ] CI ok (lint/typecheck/unit/e2e).
- [ ] Pruebas manuales QA ok.
- [ ] Logs con requestId operativos.
- [ ] Web Vitals dentro de SLO.
- [ ] Snapshot perf generado y revisado.
- [ ] SLO dentro de rango (latencia/error/Web Vitals/slow queries).
- [ ] Documentación actualizada.
- [ ] Plan de rollback listo y verificado.

# Responsables
- Engineering lead: __________________
- Backend owner: __________________
- Frontend owner: __________________
- SRE: __________________
- PM: __________________

# Comunicación
- Aviso al equipo: mensaje en canal de releases + email interno con ventana y estado.
- Canal de incidentes: canal dedicado de incident response (pager/chat) activo durante rollout.
- Canal de release notes: canal de producto/tech con resumen de cambios, riesgos y puntos de prueba.
