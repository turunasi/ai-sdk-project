// types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      // Add other properties from your Prisma User model if needed
      // name?: string | null;
      // email?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
  }
}
