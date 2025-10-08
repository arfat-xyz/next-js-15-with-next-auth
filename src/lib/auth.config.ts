import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "@/zod-schemas/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedData = LoginSchema.safeParse(credentials);
        if (!validatedData.success) return null;
        const { email, password } = validatedData.data;
        const user = await db.user.findFirst({
          where: {
            email,
          },
        });
        if (!user?.id || !user.password || !user.email) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(password, user?.password);
        if (passwordMatch) return user;
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
