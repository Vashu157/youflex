import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq, or } from "drizzle-orm";

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
        identifier: {},
        password: {},
      },

      async authorize(credentials) {
        const identifier =
          credentials?.identifier ?? credentials?.email ?? "";
        const password = credentials?.password ?? "";

        if (!identifier || !password) return null;

        const normalizedIdentifier = identifier.trim().toLowerCase();

        const existingUser = await db.query.users.findFirst({
          where: or(
            eq(users.email, normalizedIdentifier),
            eq(users.username, normalizedIdentifier)
          ),
        });

        if (!existingUser) return null;

        const isPasswordCorrect = await bcrypt.compare(
          password,
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
