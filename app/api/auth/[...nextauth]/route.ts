import NextAuth, { NextAuthOptions } from "next-auth";
import { Account, User as AuthUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/utils/db";
import { nanoid } from "nanoid";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const user = await prisma.user.findFirst({
            where: {
              email: credentials.email,
            },
          });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password!
            );
            if (isPasswordCorrect) {
              return {
                id: user.id,
                email: user.email,
                role: user.role || "user",
              } as any;
            }
          }
        } catch (err: any) {
          throw new Error(err);
        }
        return null;
      },
    }),
    // Uncomment and configure these providers as needed
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID!,
    //   clientSecret: process.env.GITHUB_SECRET!,
    // }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: AuthUser; account: Account }) {
      if (account?.provider === "credentials") {
        return true;
      }
      
      // Handle OAuth providers
      if (account?.provider === "github" || account?.provider === "google") {
        try {
          // Check if user exists in database
          const existingUser = await prisma.user.findFirst({
            where: {
              email: user.email!,
            },
          });

          if (!existingUser) {
            // Create new user for OAuth providers
            await prisma.user.create({
              data: {
                id: nanoid(),
                email: user.email!,
                role: "user",
                // OAuth users don't have passwords
                password: null,
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      
      return true;
    },
    async jwt({ token, user }) {
      // Set role and id on initial login
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id;
        token.iat = Math.floor(Date.now() / 1000); // Issued at time
      } else if (token.id) {
        // On subsequent calls, refetch user from database to get latest role
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { role: true }
          });
          if (dbUser) {
            token.role = dbUser.role;
          }
        } catch (error) {
          console.error("Error fetching user role in JWT callback:", error);
        }
      }

      // Ensure a unique sessionId exists for every session
      if (!token.sessionId) {
        token.sessionId = nanoid();
      }

      // Check if token is expired (15 minutes)
      if (token.iat) {
        const now = Math.floor(Date.now() / 1000);
        const tokenAge = now - (token.iat as number);
        const maxAge = 15 * 60; // 15 minutes
        if (tokenAge > maxAge) {
          // Token expired, return empty object to force re-authentication
          return {};
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }

      // Expose sessionId to the client
      // Prefer token.sessionId (authenticated session); fallback to cookie-based guestSessionId
      let effectiveSessionId: string | null = (token as any)?.sessionId ?? null;

      if (!effectiveSessionId) {
        try {
          const cookieStore = cookies();
          let guestSessionId = cookieStore.get("guestSessionId")?.value ?? null;

          if (!guestSessionId) {
            guestSessionId = nanoid();
            // set cookie for 30 days
            cookieStore.set({
              name: "guestSessionId",
              value: guestSessionId,
              path: "/",
              maxAge: 60 * 60 * 24 * 30,
            } as any);
          }

          effectiveSessionId = guestSessionId;
        } catch (err) {
          // If cookie APIs unavailable for any reason, leave effectiveSessionId as null
          effectiveSessionId = null;
        }
      }

      (session as any).sessionId = effectiveSessionId;
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on auth errors
  },
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // 15 minutes in seconds
    updateAge: 5 * 60, // Update session every 5 minutes
  },
  jwt: {
    maxAge: 15 * 60, // 15 minutes in seconds
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
