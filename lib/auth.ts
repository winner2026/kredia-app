import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";

export const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

export type AuthUser = {
  id: string;
  email: string | null;
  name: string | null;
  role: Role;
};

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  secret: authSecret,
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Nombre", type: "text" },
      },
      async authorize(credentials) {
        const rawEmail = credentials?.email;
        const email = typeof rawEmail === "string" ? rawEmail.toLowerCase().trim() : "";
        if (!email) return null;

        const rawName = credentials?.name;
        const name = typeof rawName === "string" ? rawName.trim() || null : null;

        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: { email, name, role: Role.USER },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? null,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name ?? null;
        token.role = (user as { role?: Role }).role ?? Role.USER;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = (token.name as string | null) ?? null;
      session.user.role = token.role as Role;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

/**
 * Obtiene el usuario actual desde la sesión JWT
 * Los datos ya están en el token, no necesita query a DB
 * Para datos frescos desde DB, usar getCurrentUserFromDB()
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  return {
    id: session.user.id,
    email: session.user.email ?? null,
    name: session.user.name ?? null,
    role: session.user.role,
  };
}

/**
 * Obtiene el usuario actual con datos frescos desde la base de datos
 * Usar solo cuando necesites datos actualizados (ej: cambio de role)
 */
export async function getCurrentUserFromDB(): Promise<AuthUser | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, name: true, role: true },
  });

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
