-- Índices recomendados
CREATE INDEX IF NOT EXISTS idx_purchase_user_created ON "Purchase"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS idx_purchase_user_card ON "Purchase"("userId", "cardId");
CREATE INDEX IF NOT EXISTS idx_creditcard_user ON "CreditCard"("userId");
CREATE INDEX IF NOT EXISTS idx_risksnapshot_user_month ON "RiskSnapshot"("userId", "year", "month");

-- Ejemplos de EXPLAIN ANALYZE (ajustar parámetros reales)
-- EXPLAIN ANALYZE SELECT * FROM "Purchase" WHERE "userId" = 'USER_ID' ORDER BY "createdAt" DESC LIMIT 20;
-- EXPLAIN ANALYZE SELECT "creditCard"."id", "creditCard"."bank" FROM "CreditCard" AS creditCard WHERE "userId" = 'USER_ID';

-- Notas:
-- 1. Revisa planes para detectar N+1 y considera agregar includes o relaciones en Prisma.
-- 2. Para partición opcional por fecha/usuario, evaluar partitioning en tablas grandes de historial.
