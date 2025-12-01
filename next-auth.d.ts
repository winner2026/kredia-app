import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string;
    premium?: boolean;
    premiumSince?: Date | null;
  }

  interface Session {
    user: {
      id: string;
      role?: string;
      premium?: boolean;
      premiumSince?: Date | null;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: string;
    role?: string;
    premium?: boolean;
    premiumSince?: Date | null;
  }
}
