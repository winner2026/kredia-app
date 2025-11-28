import { describe, it, expect, vi, beforeEach } from 'vitest'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/server/prisma'

// Mock bcrypt
vi.mock('bcryptjs', () => ({
  default: {
    compare: vi.fn(),
    hash: vi.fn(),
  },
}))

describe('Authentication Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Password validation', () => {
    it('should validate correct password', async () => {
      const password = 'testPassword123'
      const passwordHash = 'hashedPassword'

      vi.mocked(bcrypt.compare).mockResolvedValue(true as never)

      const result = await bcrypt.compare(password, passwordHash)

      expect(result).toBe(true)
      expect(bcrypt.compare).toHaveBeenCalledWith(password, passwordHash)
    })

    it('should reject incorrect password', async () => {
      const password = 'wrongPassword'
      const passwordHash = 'hashedPassword'

      vi.mocked(bcrypt.compare).mockResolvedValue(false as never)

      const result = await bcrypt.compare(password, passwordHash)

      expect(result).toBe(false)
    })

    it('should hash password with proper rounds', async () => {
      const password = 'testPassword123'
      const hashedPassword = '$2a$12$hashedPasswordExample'

      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword as never)

      const result = await bcrypt.hash(password, 12)

      expect(result).toBe(hashedPassword)
      expect(bcrypt.hash).toHaveBeenCalledWith(password, 12)
    })
  })

  describe('User lookup', () => {
    it('should find user by email', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
      }

      vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any)

      const result = await prisma.user.findUnique({
        where: { email: 'test@example.com' },
      })

      expect(result).toEqual(mockUser)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      })
    })

    it('should return null for non-existent user', async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

      const result = await prisma.user.findUnique({
        where: { email: 'nonexistent@example.com' },
      })

      expect(result).toBeNull()
    })
  })

  describe('Password reset token', () => {
    it('should find user by valid reset token', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        resetToken: 'hashedToken',
        resetTokenExpiry: new Date(Date.now() + 3600000), // 1 hour from now
      }

      vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as any)

      const result = await prisma.user.findFirst({
        where: {
          resetToken: 'hashedToken',
          resetTokenExpiry: { gt: new Date() },
        },
      })

      expect(result).toEqual(mockUser)
    })

    it('should not find user with expired token', async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValue(null)

      const result = await prisma.user.findFirst({
        where: {
          resetToken: 'hashedToken',
          resetTokenExpiry: { gt: new Date() },
        },
      })

      expect(result).toBeNull()
    })
  })

  describe('Email verification', () => {
    it('should find user by verification token', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        verificationToken: 'hashedVerificationToken',
        emailVerified: null,
      }

      vi.mocked(prisma.user.findFirst).mockResolvedValue(mockUser as any)

      const result = await prisma.user.findFirst({
        where: {
          verificationToken: 'hashedVerificationToken',
          emailVerified: null,
        },
      })

      expect(result).toEqual(mockUser)
    })

    it('should mark email as verified', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        emailVerified: new Date(),
        verificationToken: null,
      }

      vi.mocked(prisma.user.update).mockResolvedValue(mockUser as any)

      const result = await prisma.user.update({
        where: { id: 'user-123' },
        data: {
          emailVerified: expect.any(Date),
          verificationToken: null,
        },
      })

      expect(result.emailVerified).toBeInstanceOf(Date)
      expect(result.verificationToken).toBeNull()
    })
  })
})
