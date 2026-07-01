import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  // ── No database adapter — JWT sessions only ──────────────────
  // User data is stored in a short-lived signed cookie only.
  // Nothing is persisted anywhere on the server.
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // 1 hour — just enough for the study session
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          // Request minimal scopes — only what we actually need
          scope: "openid email profile",
          prompt: "select_account", // always show account picker
        },
      },
    }),
  ],

  callbacks: {
    // Keep JWT minimal — only store what the UI needs to display
    async jwt({ token, account }) {
      if (account) {
        token.provider = account.provider;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).provider = token.provider;
      }
      return session;
    },
  },

  pages: {
    signIn: "/",         // redirect to home if not signed in
    error: "/auth/error",
  },
};
