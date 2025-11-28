import { vi } from 'vitest'

// Mock environment variables for tests
process.env.AUTH_SECRET = 'test-secret-key-for-testing-only-32chars'
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db'

// Mock server-only package
vi.mock('server-only', () => ({}))

// Mock Prisma Client
vi.mock('@/lib/server/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    creditCard: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    purchase: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback({
      purchase: {
        updateMany: vi.fn(),
      },
      creditCard: {
        update: vi.fn(),
      },
    })),
  },
}))
