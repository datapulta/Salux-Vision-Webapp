import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/authOptions";

// El middleware de NextAuth intercepta las peticiones a todas las rutas de la app 
export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const user = req.auth?.user;
    const path = req.nextUrl.pathname;

    // 1. Evitar ciclo infinito: si piden rutas públicas de autenticación
    if (path === "/login" || path === "/register") {
        if (isLoggedIn) {
            // Si ya está logueado, lo mandamos a su panel correspondiente de inmediato
            const dashboard = user?.role === "admin" ? "/admin" : "/app";
            return NextResponse.redirect(new URL(dashboard, req.nextUrl));
        }
        return NextResponse.next();
    }

    // 2. Proteger la ruta /admin (Solo para rol 'admin')
    if (path.startsWith("/admin")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }
        // Si intenta entrar un usuario normal a /admin
        if (user?.role !== "admin") {
            return NextResponse.redirect(new URL("/app", req.nextUrl));
        }
    }

    // 3. Proteger la ruta /app (Dashboard de pacientes/usuarios)
    if (path.startsWith("/app")) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/login", req.nextUrl));
        }
    }

    return NextResponse.next();
});

// Configuración de rutas que pasará por este middleware (omitimos api e imgs estáticas)
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
