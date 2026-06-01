import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";
import { users, accounts, sessions, verificationTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        // Fetch role from DB
        const dbUser = await db
          .select({ role: users.role })
          .from(users)
          .where(eq(users.id, user.id))
          .limit(1);
        (session.user as any).role = dbUser[0]?.role ?? "user";
      }
      return session;
    },
    async signIn({ user, account }) {
      // Allow all Google sign-ins
      if (account?.provider === "google") {
        return true;
      }
      return false;
    },
  },
  pages: {
    signIn: "/Mainl7/login",
    error: "/Mainl7/login",
  },
});
