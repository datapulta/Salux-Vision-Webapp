import DashboardLayout from "@/components/DashboardLayout";
import { auth } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Ajustes de Cuenta | Salux Vision",
};

export default async function SettingsPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <DashboardLayout userRole={session.user.role} userName={session.user.name || "Paciente"}>
            <div className="fade-in">
                <header className="page-header" style={{ marginBottom: "2rem" }}>
                    <h1 className="page-title">Ajustes de Perfil</h1>
                    <p className="page-subtitle">Gestiona tu información de contacto y preferencias</p>
                </header>

                <div style={{ background: "var(--glass-surface)", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-lg)", padding: "2rem" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1.5rem" }}>Información Personal</h3>

                    <div style={{ display: "grid", gap: "1.5rem", maxWidth: "600px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Nombre Completo</label>
                            <p style={{ fontWeight: 500, padding: "0.75rem", background: "rgba(0,0,0,0.03)", borderRadius: "8px", border: "1px solid var(--glass-border)" }}>{session.user.name || "No definido"}</p>
                        </div>
                        <div>
                            <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.5rem" }}>Correo Electrónico Verificado</label>
                            <p style={{ fontWeight: 500, padding: "0.75rem", background: "rgba(0,0,0,0.03)", borderRadius: "8px", border: "1px solid var(--glass-border)", color: "var(--primary)" }}>{session.user.email}</p>
                        </div>

                        {/* Integration Info */}
                        <div style={{ marginTop: "1rem", paddingTop: "1.5rem", borderTop: "1px solid var(--glass-border)" }}>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                                Si te registrarte mediante Google, los ajustes de seguridad como tu contraseña se gestionan directamente a través de tu cuenta en accounts.google.com.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
