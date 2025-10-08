import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/lib/auth.config";
import { getUserById } from "@/data/user";
import { getAccountByUserId } from "@/data/account";
import { generateVerificationToken } from "@/lib/token";
import { sendEmailViaNodemailer } from "@/lib/mail";
import { generateVerificationEmail } from "@/lib/email-template-generator";
import { env } from "@/lib/envs";

export const {
  auth,
  handlers: { GET, POST },
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        return true;
      }
      if (!user.id) return false;
      const existingUser = await getUserById(user.id);
      if (!existingUser?.email) return false;
      if (!existingUser?.emailVerified) {
        // Generate Verification Token
        const verificationToken = await generateVerificationToken(
          existingUser?.email
        );
        sendEmailViaNodemailer({
          template: generateVerificationEmail(
            `${env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verificationToken.token}`
          ),
          subject: "Verify your email",
          to: verificationToken?.email,
        });
        return false;
      }

      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
      const existingAccount = await getAccountByUserId(existingUser?.id);

      token.isOauth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;
      return token;
    },
    async session({ token, session }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          isOauth: token.isOauth,
        },
      };
    },
  },
});
