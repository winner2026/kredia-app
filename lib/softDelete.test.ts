import { describe, it, expect, vi, beforeEach } from 'vitest'
import { softDeletePurchase, softDeleteCard, restorePurchase, restoreCard, notDeleted } from './softDelete'
import { prisma } from '@/lib/server/prisma'

describe('Soft Delete Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('softDeletePurchase', () => {
    it('should soft delete a purchase owned by the user', async () => {
      const mockPurchase = {
        id: 'purchase-123',
        userId: 'user-123',
        deletedAt: null,
      }

      vi.mocked(prisma.purchase.findUnique).mockResolvedValue(mockPurchase as any)
      vi.mocked(prisma.purchase.update).mockResolvedValue({ ...mockPurchase, deletedAt: new Date() } as any)

      const result = await softDeletePurchase('purchase-123', 'user-123')

      expect(prisma.purchase.findUnique).toHaveBeenCalledWith({
        where: { id: 'purchase-123' },
      })
      expect(prisma.purchase.update).toHaveBeenCalled()
      expect(result.deletedAt).toBeInstanceOf(Date)
    })

    it('should throw error if purchase not found', async () => {
      vi.mocked(prisma.purchase.findUnique).mockResolvedValue(null)

      await expect(softDeletePurchase('purchase-123', 'user-123')).rejects.toThrow('Compra no encontrada')
    })

    it('should throw error if user does not own purchase', async () => {
      const mockPurchase = {
        id: 'purchase-123',
        userId: 'different-user',
        deletedAt: null,
      }

      vi.mocked(prisma.purchase.findUnique).mockResolvedValue(mockPurchase as any)

      await expect(softDeletePurchase('purchase-123', 'user-123')).rejects.toThrow('No tienes permiso')
    })

    it('should throw error if purchase already deleted', async () => {
      const mockPurchase = {
        id: 'purchase-123',
        userId: 'user-123',
        deletedAt: new Date(),
      }

      vi.mocked(prisma.purchase.findUnique).mockResolvedValue(mockPurchase as any)

      await expect(softDeletePurchase('purchase-123', 'user-123')).rejects.toThrow('ya está eliminada')
    })
  })

  describe('softDeleteCard', () => {
    it('should soft delete a card and its purchases', async () => {
      const mockCard = {
        id: 'card-123',
        userId: 'user-123',
        deletedAt: null,
      }

      vi.mocked(prisma.creditCard.findUnique).mockResolvedValue(mockCard as any)

      const mockTransaction = vi.fn(async (callback) => {
        const tx = {
          purchase: {
            updateMany: vi.fn().mockResolvedValue({ count: 2 }),
          },
          creditCard: {
            update: vi.fn().mockResolvedValue({ ...mockCard, deletedAt: new Date() }),
          },
        }
        return callback(tx)
      })

      vi.mocked(prisma.$transaction).mockImplementation(mockTransaction as any)

      const result = await softDeleteCard('card-123', 'user-123')

      expect(prisma.creditCard.findUnique).toHaveBeenCalledWith({
        where: { id: 'card-123' },
      })
      expect(prisma.$transaction).toHaveBeenCalled()
      expect(result.deletedAt).toBeInstanceOf(Date)
    })

    it('should throw error if card not found', async () => {
      vi.mocked(prisma.creditCard.findUnique).mockResolvedValue(null)

      await expect(softDeleteCard('card-123', 'user-123')).rejects.toThrow('Tarjeta no encontrada')
    })
  })

  describe('restorePurchase', () => {
    it('should restore a soft-deleted purchase', async () => {
      const mockPurchase = {
        id: 'purchase-123',
        userId: 'user-123',
        deletedAt: new Date(),
      }

      vi.mocked(prisma.purchase.findUnique).mockResolvedValue(mockPurchase as any)
      vi.mocked(prisma.purchase.update).mockResolvedValue({ ...mockPurchase, deletedAt: null } as any)

      const result = await restorePurchase('purchase-123', 'user-123')

      expect(result.deletedAt).toBeNull()
    })

    it('should throw error if purchase is not deleted', async () => {
      const mockPurchase = {
        id: 'purchase-123',
        userId: 'user-123',
        deletedAt: null,
      }

      vi.mocked(prisma.purchase.findUnique).mockResolvedValue(mockPurchase as any)

      await expect(restorePurchase('purchase-123', 'user-123')).rejects.toThrow('no está eliminada')
    })
  })

  describe('notDeleted helper', () => {
    it('should return deletedAt: null filter', () => {
      expect(notDeleted).toEqual({ deletedAt: null })
    })
  })
})
