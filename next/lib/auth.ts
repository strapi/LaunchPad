import NextAuth, { type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username?: string;
      role?: string;
    };
  }

  interface JWT {
    strapiToken?: string;
    userId?: string;
    userRole?: string;
  }
}

export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "coach@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Call Strapi authentication endpoint
          const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            const error = await res.json();
            throw new Error(error.message?.message || "Invalid credentials");
          }

          const data = await res.json();

          return {
            id: data.user.id.toString(),
            email: data.user.email,
            name: data.user.username || data.user.email,
            strapiToken: data.jwt,
            role: data.user.role?.type || "user",
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error(
            error instanceof Error ? error.message : "Authentication failed"
          );
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.strapiToken = (user as any).strapiToken;
        token.userRole = (user as any).role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.userRole as string;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after login
      if (url.startsWith(baseUrl)) return url;
      return baseUrl + "/dashboard";
    },
  },

  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User ${user?.email} signed in`);
    },
    async signOut() {
      console.log("User signed out");
    },
  },

  debug: process.env.NODE_ENV === "development",
};
