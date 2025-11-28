import { describe, it, expect, vi, beforeEach } from 'vitest'
import { assertCardOwnership, assertPurchaseOwnership, requireUser, requireAdmin } from './rbac'
import { prisma } from '@/lib/server/prisma'

describe('RBAC Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('assertCardOwnership', () => {
    it('should return card if user owns it', async () => {
      const mockCard = {
        id: 'card-123',
        userId: 'user-123',
        bank: 'Test Bank',
      }

      vi.mocked(prisma.creditCard.findUnique).mockResolvedValue(mockCard as any)

      const result = await assertCardOwnership('card-123', 'user-123')

      expect(result).toEqual(mockCard)
      expect(prisma.creditCard.findUnique).toHaveBeenCalledWith({
        where: { id: 'card-123' },
      })
    })

    it('should throw error if card not found', async () => {
      vi.mocked(prisma.creditCard.findUnique).mockResolvedValue(null)

      await expect(assertCardOwnership('card-123', 'user-123')).rejects.toThrow('Tarjeta no encontrada')
    })

    it('should throw error if user does not own card', async () => {
      const mockCard = {
        id: 'card-123',
        userId: 'different-user',
        bank: 'Test Bank',
      }

      vi.mocked(prisma.creditCard.findUnique).mockResolvedValue(mockCard as any)

      await expect(assertCardOwnership('card-123', 'user-123')).rejects.toThrow('No tienes permiso')
    })
  })

  describe('assertPurchaseOwnership', () => {
    it('should return purchase if user owns it', async () => {
      const mockPurchase = {
        id: 'purchase-123',
        userId: 'user-123',
        description: 'Test Purchase',
      }

      vi.mocked(prisma.purchase.findUnique).mockResolvedValue(mockPurchase as any)

      const result = await assertPurchaseOwnership('purchase-123', 'user-123')

      expect(result).toEqual(mockPurchase)
    })

    it('should throw error if purchase not found', async () => {
      vi.mocked(prisma.purchase.findUnique).mockResolvedValue(null)

      await expect(assertPurchaseOwnership('purchase-123', 'user-123')).rejects.toThrow('Compra no encontrada')
    })

    it('should throw error if user does not own purchase', async () => {
      const mockPurchase = {
        id: 'purchase-123',
        userId: 'different-user',
        description: 'Test Purchase',
      }

      vi.mocked(prisma.purchase.findUnique).mockResolvedValue(mockPurchase as any)

      await expect(assertPurchaseOwnership('purchase-123', 'user-123')).rejects.toThrow('No tienes permiso')
    })
  })

  describe('requireUser', () => {
    it('should not throw if user is valid', () => {
      const user = { id: 'user-123', email: 'test@example.com', name: 'Test', role: 'USER' as const }

      expect(() => requireUser(user)).not.toThrow()
    })

    it('should throw if user is null', () => {
      expect(() => requireUser(null)).toThrow('Unauthorized')
    })

    it('should throw if user has no id', () => {
      const user = { id: '', email: 'test@example.com', name: 'Test', role: 'USER' as const }

      expect(() => requireUser(user)).toThrow('Unauthorized')
    })
  })

  describe('requireAdmin', () => {
    it('should not throw if user is admin', () => {
      const user = { id: 'user-123', email: 'admin@example.com', name: 'Admin', role: 'ADMIN' as const }

      expect(() => requireAdmin(user)).not.toThrow()
    })

    it('should throw if user is not admin', () => {
      const user = { id: 'user-123', email: 'test@example.com', name: 'Test', role: 'USER' as const }

      expect(() => requireAdmin(user)).toThrow('Forbidden')
    })

    it('should throw if user is null', () => {
      expect(() => requireAdmin(null)).toThrow('Unauthorized')
    })
  })
})
