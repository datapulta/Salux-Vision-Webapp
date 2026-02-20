import { auth } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminPage() {
    const session = await auth();

    // Medida extra de seguridad en el servidor (aunque el middleware ya lo cubre)
    if (session?.user?.role !== "admin") {
        redirect("/app");
    }

    return (
        <div style={{ minHeight: "100vh", padding: "4rem 2rem", background: "var(--bg-color)" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>

                {/* Encabezado */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--glass-border)", paddingBottom: "1.5rem", marginBottom: "3rem", paddingTop: "2rem" }}>
                    <div>
                        <h1 style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "var(--font-heading)" }}>Panel de Administración</h1>
                        <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>Supervisa todas las clínicas y pacientes.</p>
                    </div>
                    <LogoutButton />
                </div>

                {/* Contenido Principal */}
                <div className="feature-card" style={{ padding: "2rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>¡Hola, Administrador {session.user.name}!</h2>
                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                        El sistema de autenticación seguro basado en roles y base de datos funciona perfectamente.
                        Como tu rol es '<b>admin</b>', tienes acceso a este panel exclusivo e inaccesible para los pacientes estándar. <br /><br />
                        Aquí a futuro estarán las estadísticas principales, administración de oftalmólogos y logs de las consultas gratuitas.
                    </p>
                </div>

            </div>
        </div>
    );
}
