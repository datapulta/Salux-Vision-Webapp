import type { NextAuthConfig } from "next-auth";

// Esta configuración parcial es necesaria porque Middleware se ejecuta en
// un entorno Edge (no Node.js puro) y no soporta 'pg' o 'bcryptjs' directamente.
export const authConfig = {
    pages: {
        signIn: "/login",
    },
    providers: [], // Los providers con BBDD se inyectan en authOptions.ts
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as 'admin' | 'user';
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
