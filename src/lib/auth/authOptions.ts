import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    // Busca el usuario por correo electrónico en Postgres
                    const result = await query("SELECT * FROM users WHERE email = $1", [credentials.email as string]);
                    const user = result.rows[0];

                    if (!user) {
                        return null; // Si no existe el usuario, autorizacion fallida
                    }

                    // Verificamos si la contraseña tipeada coincide con el hash en la DB
                    const isPasswordValid = await bcrypt.compare(credentials.password as string, user.password_hash);

                    if (!isPasswordValid) {
                        return null; // Contraseña incorrecta
                    }

                    // Si pasamos, devolvemos el usuario con su ROL guardado
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role // importantísimo retornar el rol 
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        // 1. Modificamos el JWT token para que dentro contenga a 'role' e 'id' además de la info basica (email)
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role; // anexamos el rol (vino del return del authorize superior)
                token.id = user.id;
            }
            return token;
        },
        // 2. Modificamos el objeto SESSION para que desde el front-end podamos leer session.user.role
        async session({ session, token }) {
            if (token && session.user) {
                session.user.role = token.role as 'admin' | 'user';
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt" // Usaremos JSON Web Tokens HTTP-Only. Más sencillo que sesiones persistentes
    },
    secret: process.env.AUTH_SECRET,
});
