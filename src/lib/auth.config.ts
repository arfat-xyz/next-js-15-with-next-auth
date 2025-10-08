import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import { env } from "@/lib/envs";

// THIS FILE MUST NOT IMPORT PRISMA OR ANY DATABASE CODE
// It's used by middleware which runs in Edge Runtime

export default {
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // Note: Credentials provider is NOT here - it will be added in auth.ts
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
} satisfies NextAuthConfig;
