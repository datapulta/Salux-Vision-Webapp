import { auth } from "@/lib/auth/authOptions";
import { Eye, Calendar, ShieldCheck, ArrowRight } from "lucide-react";

export default async function AppDashboardPage() {
    const session = await auth();

    return (
        <>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", fontFamily: "var(--font-heading)" }}>
                    ¡Hola de nuevo, {session?.user?.name?.split(' ')[0]}!
                </h1>
                <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                    Aquí tienes un resumen de tu salud visual y próximos pasos.
                </p>
            </div>

            {/* Tarjetas de Métricas Rápidas */}
            <div className="dash-grid">
                <div className="dash-card">
                    <div className="card-icon bg-purple-light">
                        <Eye size={28} />
                    </div>
                    <div className="card-info">
                        <h3>Última Medición</h3>
                        <div className="card-value">-1.50 OD</div>
                    </div>
                </div>

                <div className="dash-card">
                    <div className="card-icon bg-pink-light">
                        <Calendar size={28} />
                    </div>
                    <div className="card-info">
                        <h3>Próxima Cita</h3>
                        <div className="card-value">Por agendar</div>
                    </div>
                </div>

                <div className="dash-card">
                    <div className="card-icon bg-blue-light">
                        <ShieldCheck size={28} />
                    </div>
                    <div className="card-info">
                        <h3>Estado Clínico</h3>
                        <div className="card-value">Estable</div>
                    </div>
                </div>
            </div>

            {/* Acciones principales */}
            <div className="feature-card" style={{ padding: "2rem", marginTop: "2rem", border: "1px solid rgba(209, 163, 224, 0.2)" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.75rem" }}>Acciones Rápidas</h2>
                <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                    Inicia tu triaje digital u obten asesoría óptica con un oftalmólogo certificado de nuestra red de impacto social.
                </p>
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <button className="btn btn-primary" style={{ border: "none" }}>
                        Solicitar Triaje Visual
                    </button>
                    <button className="btn btn-secondary">
                        Agendar Cita Medica <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </>
    );
}
