import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/server/prisma";
import bcrypt from "bcryptjs";

export const getBaseUrl = () => {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

const authSecret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;

export type AuthUser = {
  id: string;
  email: string | null;
  name: string | null;
  role: Role;
};

export const authConfig: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  secret: authSecret,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const rawEmail = credentials?.email;
        const email = typeof rawEmail === "string" ? rawEmail.toLowerCase().trim() : "";
        const password = credentials?.password as string | undefined;

        console.log("LOGIN ATTEMPT:", {
          rawEmail: credentials?.email,
          normalizedEmail: email,
          enteredPassword: password,
        });

        if (!email || !password) {
          return null;
        }

        // Buscar usuario por email
        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            passwordHash: true,
            emailVerified: true,
          },
        });

        if (!user) {
          return null;
        }

        // Si no tiene password hash (usuarios legacy), rechazar login
        if (!user.passwordHash) {
          return null;
        }

        // Verificar contraseña
        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        // Verificar que el email esté verificado
        if (!user.emailVerified) {
          console.log("LOGIN DENIED: Email not verified for", email);
          return null;
        }

        console.log("AUTHORIZED USER:", user);

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

      // Cargar flags de premium desde DB
      const dbUser = await prisma.user.findUnique({
        where: { id: token.id as string },
        select: { premium: true, premiumSince: true },
      });

      if (dbUser) {
        token.premium = dbUser.premium;
        token.premiumSince = dbUser.premiumSince;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.name = (token.name as string | null) ?? null;
      session.user.role = token.role as Role;
      session.user.premium = token.premium as boolean;
      session.user.premiumSince = token.premiumSince as Date | null;
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
