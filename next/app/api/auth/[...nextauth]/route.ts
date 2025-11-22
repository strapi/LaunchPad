import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

// NextAuth v5-beta returns a handler object
export const { GET, POST } = handler.handlers;
