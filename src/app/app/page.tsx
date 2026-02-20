import { auth } from "@/lib/auth/authOptions";
import LogoutButton from "@/components/LogoutButton";

export default async function AppDashboardPage() {
    const session = await auth();

    return (
        <div style={{ minHeight: "100vh", padding: "4rem 2rem", background: "var(--bg-color)" }}>
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>

                {/* Encabezado */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--glass-border)", paddingBottom: "1.5rem", marginBottom: "3rem", paddingTop: "2rem" }}>
                    <div>
                        <h1 style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "var(--font-heading)" }}>Panel de Paciente</h1>
                        <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>Tu salud visual protegida</p>
                    </div>
                    <LogoutButton />
                </div>

                {/* Contenido Principal */}
                <div className="feature-card" style={{ padding: "2rem" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>¡Bienvenid@, {session?.user?.name}!</h2>
                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                        Este es tu panel privado y protegido, al que solo entras porque tu rol estándar en Salux es '<b>{session?.user?.role}</b>'. <br /><br />
                        Intenta acceder manualmente a la URL '/admin' y verás que el sistema ahora te bloquea y te redirige de vuelta aquí automáticamente.<br /><br />
                        Tus datos de salud estarán protegidos detrás de estos muros criptográficos.
                    </p>
                </div>

            </div>
        </div>
    );
}
