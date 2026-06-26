import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        });

        if (!existingUser) return null;

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          existingUser.passwordHash
        );

        if (!isPasswordCorrect) return null;

        return {
          id: String(existingUser.id),
          email: existingUser.email,
          name: existingUser.fullName,
          username: existingUser.username,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
  },
  
  pages: {
    signIn: "/login",
  },
});