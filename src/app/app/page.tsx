import { auth } from "@/lib/auth/authOptions";
import { Eye, ShieldCheck, ArrowRight, Sparkles, Activity } from "lucide-react";
import Link from 'next/link';

export default async function AppDashboardPage() {
    const session = await auth();

    return (
        <div className="fade-in pb-12">
            <div style={{ marginBottom: "2.5rem" }}>
                <h1 className="gradient-text" style={{ fontSize: "2.25rem", fontWeight: "800", marginBottom: '0.5rem' }}>
                    ¡Hola, {session?.user?.name?.split(' ')[0]}!
                </h1>
                <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", fontWeight: '500' }}>
                    Bienvenido a tu portal de salud visual. Revisa tus próximos pasos.
                </p>
            </div>

            {/* Tarjetero de Acción Principal */}
            <div className="dash-grid" style={{ marginBottom: "2.5rem" }}>

                <div className="feature-card" style={{
                    padding: "2.5rem",
                    background: 'linear-gradient(135deg, var(--bg-secondary), var(--surface))',
                    border: "1px solid var(--primary-glow)",
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '-40px', right: '-40px', opacity: 0.1, pointerEvents: 'none' }}>
                        <Eye size={200} color="var(--primary)" />
                    </div>
                    <div className="badge" style={{ backgroundColor: 'rgba(109, 93, 252, 0.1)', color: 'var(--primary)', marginBottom: '1rem' }}>
                        <Sparkles size={12} style={{ marginRight: '6px' }} /> Recomendado
                    </div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>Catálogo y Agendamiento 👓</h2>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", fontSize: '1rem', lineHeight: '1.6', maxWidth: '400px' }}>
                        Explora nuestra colección de armazones sociales y agenda tu cita médica para un diagnóstico profesional.
                    </p>
                    <Link href="/app/book-appointment" className="btn btn-primary" style={{ padding: '0.85rem 1.5rem', width: 'fit-content' }}>
                        Ver Catálogo y Agendar <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="feature-card" style={{
                    padding: "2.5rem",
                    background: 'var(--glass-surface)',
                    border: "1px solid var(--glass-border)"
                }}>
                    <div className="card-icon bg-blue-light" style={{ marginBottom: '1.5rem', width: '50px', height: '50px' }}>
                        <Activity size={24} />
                    </div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}>Evaluación Digital</h2>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "2rem", fontSize: '1rem', lineHeight: '1.6' }}>
                        Encuentro virtual rápido con un especialista para dudas o urgencias menores.
                    </p>
                    <button className="btn btn-secondary" style={{ padding: '0.85rem 1.5rem' }}>
                        Solicitar Consulta <ShieldCheck size={18} />
                    </button>
                </div>

            </div>

            <div className="dash-card" style={{ padding: "2.5rem", background: 'rgba(0,0,0,0.2)', borderStyle: 'dashed' }}>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.5rem" }}>Tu Expediente Clínico</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                        Estamos digitalizando tu historial. Pronto podrás ver tus recetas pasadas (Esferas y Cilindros),
                        monitorear tu agudeza visual y descargar resultados de laboratorio directamente aquí.
                    </p>
                </div>
            </div>
        </div>
    );
}
