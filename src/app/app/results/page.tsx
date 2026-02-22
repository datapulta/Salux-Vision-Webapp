import DashboardLayout from "@/components/DashboardLayout";
import { auth } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Mis Resultados | Salux Vision",
};

export default async function ResultsPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <DashboardLayout userRole={session.user.role} userName={session.user.name || "Paciente"}>
            <div className="fade-in">
                <header className="page-header" style={{ marginBottom: "2rem" }}>
                    <h1 className="page-title">Historial de Resultados</h1>
                    <p className="page-subtitle">Visualiza tus métricas visuales y recetas oftalmológicas</p>
                </header>

                <div style={{ background: "var(--glass-surface)", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-lg)", padding: "3rem", textAlign: "center", color: "var(--text-secondary)" }}>
                    Aún no tienes resultados clínicos históricos asociados a esta cuenta.
                </div>
            </div>
        </DashboardLayout>
    );
}
