import { auth } from "@/lib/auth/authOptions";
import { Eye, ShieldCheck, ArrowRight, UserPlus } from "lucide-react";
import Link from 'next/link';

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

            {/* Tarjetero de Acción Principal - NUEVO */}
            <div className="dash-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", marginBottom: "2rem" }}>

                <div className="feature-card" style={{ padding: "2rem", border: "1px solid rgba(209, 163, 224, 0.2)", position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05, pointerEvents: 'none' }}>
                        <Eye size={150} />
                    </div>
                    <h2 style={{ position: 'relative', zIndex: 2, fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.75rem", color: 'var(--primary)' }}>Tienda y Citas 👓</h2>
                    <p style={{ position: 'relative', zIndex: 2, color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: '0.9rem', lineHeight: '1.5' }}>
                        Explora nuestro catálogo de armazones, personaliza tus micas y agenda una cita médica para probártelos en persona.
                    </p>
                    <Link href="/app/book-appointment" className="btn btn-primary" style={{ position: 'relative', zIndex: 2, border: "none", width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                        Ver Catálogo y Agendar <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="feature-card" style={{ padding: "2rem", border: "1px solid rgba(255, 255, 255, 0.1)", background: 'rgba(255,255,255,0.02)' }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "0.75rem" }}>Evaluación Visual en Línea</h2>
                    <p style={{ color: "var(--text-secondary)", marginBottom: "1.5rem", fontSize: '0.9rem', lineHeight: '1.5' }}>
                        ¿Tienes alguna urgencia, dolor o molestia en los ojos? Inicia una consulta digital rápida con un especialista de guardia.
                    </p>
                    <button className="btn btn-secondary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        Solicitar Evaluación Digital <ShieldCheck size={16} />
                    </button>
                </div>

            </div>

            <div style={{ padding: "2rem", backgroundColor: 'rgba(15,15,20,0.5)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "1rem" }}>Tu Estado Clínico (Próximamente)</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    En esta sección podrás ver tu Historial Vísual, tus recetas pasadas (Esferas y Cilindros OD/OI) y descargar resultados de laboratorio.
                </p>
            </div>
        </>
    );
}
