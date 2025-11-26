import { Role } from "@prisma/client";
import { type AuthUser } from "@/lib/auth";

export type CurrentUser = AuthUser & { role?: Role };

export function requireUser(user: CurrentUser | null): asserts user is CurrentUser {
  if (!user?.id) {
    throw new Error("Unauthorized");
  }
}

export function requireAdmin(user: CurrentUser | null): asserts user is CurrentUser & { role: Role.ADMIN } {
  requireUser(user);
  if (user.role !== Role.ADMIN) {
    throw new Error("Forbidden");
  }
}

export function assertOwnership(userId: string, resourceUserId: string): void {
  if (userId !== resourceUserId) {
    throw new Error("Forbidden");
  }
}
