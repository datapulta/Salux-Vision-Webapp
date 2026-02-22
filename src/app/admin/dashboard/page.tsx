import { auth } from "@/lib/auth/authOptions";
import { Users, Activity, Clock, ShieldCheck, Calendar, ArrowRight } from "lucide-react";
import Link from 'next/link';
import { query } from "@/lib/db";
import { redirect } from 'next/navigation';

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
        redirect('/app');
    }

    try {
        const totalPacientesReq = await query('SELECT COUNT(*) FROM users WHERE role = $1', ['user']);
        const citasPendientesReq = await query('SELECT COUNT(*) FROM appointments WHERE status = $1', ['pending']);
        const citasHoyReq = await query("SELECT COUNT(*) FROM appointments WHERE appointment_date::date = CURRENT_DATE");

        const totalPacientes = totalPacientesReq.rows[0].count;
        const citasPendientes = citasPendientesReq.rows[0].count;
        const citasHoy = citasHoyReq.rows[0].count;

        return (
            <div className="fade-in pb-12">
                <div style={{ marginBottom: "2.5rem" }}>
                    <h1 className="gradient-text" style={{ fontSize: "2.25rem", fontWeight: "800", marginBottom: '0.5rem' }}>
                        Panel General
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", fontWeight: '500' }}>
                        Métricas operativas y supervisión clínica en tiempo real.
                    </p>
                </div>

                <div className="dash-grid">
                    <Link href="/admin" className="dash-card">
                        <div className="card-icon bg-purple-light">
                            <Users size={24} strokeWidth={2.5} />
                        </div>
                        <div className="card-info">
                            <h3>Pacientes Totales</h3>
                            <div className="card-value">{totalPacientes}</div>
                        </div>
                    </Link>

                    <Link href="/admin/appointments" className="dash-card">
                        <div className="card-icon bg-pink-light">
                            <Activity size={24} strokeWidth={2.5} />
                        </div>
                        <div className="card-info">
                            <h3>Pendientes</h3>
                            <div className="card-value">{citasPendientes}</div>
                        </div>
                    </Link>

                    <Link href="/admin/appointments" className="dash-card">
                        <div className="card-icon bg-blue-light">
                            <Clock size={24} strokeWidth={2.5} />
                        </div>
                        <div className="card-info">
                            <h3>Citas de Hoy</h3>
                            <div className="card-value">{citasHoy}</div>
                        </div>
                    </Link>
                </div>

                {/* Resumen de Sistema UI mejorada */}
                <div className="feature-card" style={{
                    padding: "2.5rem",
                    marginTop: "2rem",
                    background: 'linear-gradient(135deg, var(--bg-secondary), var(--surface))',
                    border: '1px solid var(--glass-border)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative Background Icon */}
                    <ShieldCheck size={200} color="var(--primary)" style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.05 }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div style={{ background: 'var(--primary-glow)', padding: '12px', borderRadius: '14px' }}>
                                <ShieldCheck size={32} color="var(--primary)" />
                            </div>
                            <div>
                                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", color: 'var(--text-primary)' }}>Integridad del Sistema</h2>
                                <span className="status-badge status-completed">Estado: Óptimo</span>
                            </div>
                        </div>

                        <p style={{ color: "var(--text-secondary)", lineHeight: "1.8", fontSize: '1.1rem', maxWidth: '700px', marginBottom: '2rem' }}>
                            Hola, <strong style={{ color: 'var(--text-primary)' }}>{session?.user?.name}</strong>. El motor de Salux Vision se encuentra sincronizado con la base de datos central.
                            Las citas agendadas por pacientes se reflejan instantáneamente en la agenda global.
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <Link href="/admin/appointments" className="btn btn-primary" style={{ padding: '1rem 2rem' }}>
                                <Calendar size={18} /> Gestionar Agenda <ArrowRight size={18} />
                            </Link>
                            <Link href="/admin/inventory" className="btn btn-secondary" style={{ padding: '1rem 2rem' }}>
                                Revisar Inventario
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Dashboard error:", error);
        return <div>Error al cargar el panel general.</div>;
    }
}
