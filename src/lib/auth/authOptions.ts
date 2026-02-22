import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
                url: "https://accounts.google.com/o/oauth2/v2/auth",
                params: { prompt: "consent", access_type: "offline", response_type: "code" }
            },
            token: "https://oauth2.googleapis.com/token",
            userinfo: "https://openidconnect.googleapis.com/v1/userinfo",
        }),
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

                    // Usuarios importados por Google podrían no tener password
                    if (!user.password_hash) {
                        return null;
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
        ...authConfig.callbacks,
        async signIn({ user, account, profile }) {
            // Interceptamos inicio de sesión de Google
            if (account?.provider === "google") {
                try {
                    // 1. Verificamos si ya existe el usuario
                    const result = await query("SELECT * FROM users WHERE email = $1", [user.email]);
                    let dbUser = result.rows[0];

                    // 2. Si no existe, lo creamos de forma silenciosa
                    if (!dbUser) {
                        try {
                            const insertResult = await query(
                                `INSERT INTO users (name, email, role) 
                                 VALUES ($1, $2, 'user') RETURNING *`,
                                [user.name, user.email]
                            );
                            dbUser = insertResult.rows[0];
                        } catch (insertError) {
                            console.error("❌ Fallo crítico al INSERTAR paciente Google a la BD de Dokploy:", insertError);
                            // Si la BD falla insertando, NO bloqueamos a Google, solo le damos valores por defecto temporales
                            dbUser = { role: 'user', id: `temp-${Date.now()}` };
                        }
                    }

                    // 3. Pasamos los datos recolectados
                    user.role = dbUser.role;
                    user.id = dbUser.id;

                    return true;
                } catch (error) {
                    console.error("❌ Error General en BDD al verificar usuario de Google:", error);
                    // IMPORTANTE: Retornamos true siempre para no desviar a /api/auth/error?error=AccessDenied
                    user.role = 'user';
                    return true;
                }
            }

            return true; // Permitir signIn para credenciales clásicas
        }
    }
});
