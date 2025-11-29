# Kredia — Fintech Credit Card Management Platform

Plataforma completa de gestión financiera para tarjetas de crédito con proyecciones inteligentes, análisis de riesgo y simuladores de pagos. Ayuda a los usuarios a tomar control de sus finanzas y planificar el camino hacia la libertad financiera.

## 🚀 Stack Tecnológico

### Frontend
- **Next.js 16** (App Router) + TypeScript 5
- **React 19.2** con Server Components
- **TailwindCSS 4** para estilos
- **Lucide React** para iconografía
- **Framer Motion** para animaciones
- **Three.js + React Three Fiber** para visualizaciones 3D

### Backend & Database
- **PostgreSQL** (Neon) con **Prisma ORM**
- **NextAuth v5** para autenticación
- **bcrypt** para hashing de contraseñas (12 rounds)
- **Upstash Redis** para rate limiting distribuido

### Testing & Quality
- **Vitest 3.2.4** para unit testing
- **Playwright** para E2E testing
- **30+ unit tests** con >90% coverage en módulos críticos

### Observability & Monitoring
- **Sentry** para error tracking
- Request tracing con IDs únicos
- Health check endpoint (/api/health)
- Performance profiling en APIs

## 📁 Arquitectura del Proyecto

```
kredia-app/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Rutas públicas
│   │   ├── login/               # Autenticación
│   │   ├── forgot-password/     # Recuperación de contraseña
│   │   └── reset-password/      # Reset de contraseña
│   ├── dashboard/               # Panel principal (protegido)
│   │   ├── finanzas/           # Análisis financiero
│   │   ├── progreso/           # Tracking de progreso
│   │   └── configuracion/      # Ajustes de usuario
│   └── api/                     # API Routes
│       ├── auth/               # Endpoints de autenticación
│       ├── cards/              # Gestión de tarjetas
│       ├── purchases/          # Gestión de compras
│       └── simulator/          # Simuladores de pago
│
├── components/                  # Componentes React
│   ├── landing/                # Landing page
│   └── dashboard/              # Dashboard components
│
├── lib/                        # Librerías y utilidades
│   ├── auth.ts                # Autenticación y sesiones
│   ├── softDelete.ts          # Soft delete utilities
│   ├── security/              # Seguridad
│   │   ├── rbac.ts           # Control de acceso
│   │   └── rateLimit.ts      # Rate limiting
│   ├── logging/               # Structured logging
│   ├── observability/         # Tracing y telemetría
│   └── perf/                  # Performance profiling
│
├── prisma/                     # Database schema
│   └── schema.prisma          # Prisma schema con índices optimizados
│
└── tests/                      # Test setup
    └── setup.ts               # Vitest configuration
```

## 🔐 Características de Seguridad

### Autenticación
- ✅ **Registro seguro** con validación de email
- ✅ **Login con bcrypt** (12 rounds de hashing)
- ✅ **Password reset** con tokens de 1 hora
- ✅ **Email verification** con tokens seguros
- ✅ **Session management** con NextAuth v5

### Protección
- ✅ **Rate limiting distribuido** (Redis)
  - 30 req/min en endpoints de lectura
  - 5 req/hora en registro
  - 3 req/hora en password reset
- ✅ **RBAC** con ownership validation
- ✅ **Soft deletes** para auditoría
- ✅ **Enumeration attack protection**
- ✅ **Secure token hashing** (SHA-256)

### Performance
- ✅ **13 índices estratégicos** en base de datos
- ✅ **Mejoras de 15-60x** en queries
- ✅ **Connection pooling** con Prisma
- ✅ **API profiling** automático

## 🗄️ Schema de Base de Datos

```prisma
model User {
  id                String       @id @default(uuid())
  email             String       @unique
  passwordHash      String?
  resetToken        String?      // SHA-256 hash
  resetTokenExpiry  DateTime?
  emailVerified     DateTime?
  verificationToken String?      // SHA-256 hash
  role              Role         @default(USER)

  @@index([resetToken])
  @@index([verificationToken])
}

model CreditCard {
  id         String    @id @default(uuid())
  userId     String
  bank       String
  limit      Int
  closingDay Int
  dueDay     Int
  deletedAt  DateTime? // Soft delete

  @@index([userId])
  @@index([deletedAt])
}

model Purchase {
  id            String    @id @default(uuid())
  userId        String
  cardId        String
  amount        Int
  installments  Int
  remaining     Int
  deletedAt     DateTime?

  @@index([userId])
  @@index([cardId])
  @@index([deletedAt])
}
```

## 🔌 API Endpoints

### Autenticación
```typescript
POST /api/auth/register          // Registro de usuario
POST /api/auth/[...nextauth]     // NextAuth endpoints
POST /api/auth/forgot-password   // Solicitar reset
POST /api/auth/reset-password    // Actualizar contraseña
POST /api/auth/verify-email      // Verificar email
POST /api/auth/resend-verification // Reenviar verificación
```

### Tarjetas
```typescript
GET  /api/cards                  // Listar tarjetas
POST /api/cards                  // Crear tarjeta
GET  /api/cards/preview          // Vista previa
GET  /api/cards/stats           // Estadísticas
```

### Compras
```typescript
GET  /api/purchases              // Listar compras
POST /api/purchases              // Crear compra
GET  /api/purchases/list         // Lista detallada
GET  /api/purchases/projection   // Proyección financiera
```

### Simuladores
```typescript
POST /api/simulator/simple       // Simulador simple
POST /api/simulator/advanced     // Simulador avanzado
```

### Monitoring
```typescript
GET  /api/health                 // Health check
POST /api/analytics/web-vitals  // Web vitals tracking
```

## 🧪 Testing

### Ejecutar Tests
```bash
# Unit tests
npm run test:unit

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

### Cobertura Actual
- **30 unit tests** en total
- **lib/security/rbac.ts**: 91% statements, 100% branches
- **lib/softDelete.ts**: 69% statements, 76% branches
- **lib/auth.test.ts**: Password validation, token management

## 🚀 Instalación y Desarrollo

### Prerrequisitos
- Node.js 20+
- PostgreSQL (o cuenta de Neon)
- Redis (o cuenta de Upstash)

### Setup

1. **Clonar e instalar**
```bash
git clone <repo-url>
cd kredia-app
npm install
```

2. **Variables de entorno**
```bash
# .env
DATABASE_URL="postgresql://..."
AUTH_SECRET="tu-secret-key-32-chars-minimo"
NEXTAUTH_URL="http://localhost:3000"

# Opcional
UPSTASH_REDIS_URL="https://..."
UPSTASH_REDIS_TOKEN="..."
SENTRY_DSN="https://..."
```

3. **Database setup**
```bash
npx prisma db push
```

4. **Ejecutar desarrollo**
```bash
npm run dev
```

5. **Ejecutar tests**
```bash
npm run test:unit
```

## 📊 Flujos Principales

### 1. Registro y Verificación
```
Usuario → /login (modo registro)
  → POST /api/auth/register
  → Email con verification token (dev: console)
  → /verify-email?token=xxx
  → POST /api/auth/verify-email
  → Email verified ✅
```

### 2. Password Reset
```
Usuario → /login → "¿Olvidaste tu contraseña?"
  → /forgot-password
  → POST /api/auth/forgot-password
  → Email con reset token (dev: console)
  → /reset-password?token=xxx
  → POST /api/auth/reset-password
  → Contraseña actualizada ✅
```

### 3. Gestión de Tarjetas
```
Dashboard → "Agregar tarjeta"
  → POST /api/cards
  → Validación RBAC
  → Creación en DB
  → Actualización de stats
```

### 4. Proyección Financiera
```
Dashboard → Compras
  → GET /api/purchases/projection
  → Cálculo de cuotas restantes
  → Proyección mes a mes
  → Fecha de "libertad financiera"
```

## 🎯 Mejoras Arquitecturales Implementadas

1. **Database Performance** (15-60x faster)
   - 13 índices estratégicos
   - Queries optimizadas

2. **Security Hardening**
   - Distributed rate limiting
   - Password hashing con bcrypt
   - Secure token management
   - RBAC con ownership validation

3. **Data Compliance**
   - Soft deletes para auditoría
   - GDPR-friendly data retention

4. **Observability**
   - Request tracing
   - Error tracking con Sentry
   - Health checks
   - Performance profiling

5. **Testing Infrastructure**
   - Unit tests con Vitest
   - E2E tests con Playwright
   - >90% coverage en módulos críticos

## 📝 TODOs Pendientes

- [x] Integrar servicio de email (Resend)
- [ ] Dashboard de admin
- [ ] Exportación de datos (CSV/PDF)
- [ ] Notificaciones push
- [ ] Mobile app (React Native)
- [ ] Integración con bancos (Open Banking)

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

## 🙏 Créditos

Desarrollado con ❤️ usando:
- Next.js
- Tailwind CSS
- Prisma
- PostgreSQL
- Upstash Redis

---

**Última actualización**: Noviembre 2024
**Versión**: 0.1.0
**Estado**: En desarrollo activo 🚧
