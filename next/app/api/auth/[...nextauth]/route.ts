import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// NextAuth v5-beta returns { handlers, auth, signIn, signOut }
const { handlers } = NextAuth(authOptions);

export const { GET, POST } = handlers;
