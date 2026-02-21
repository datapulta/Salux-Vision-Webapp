import { auth } from "@/lib/auth/authOptions";
import { Users, Activity, Clock, ShieldCheck, Calendar } from "lucide-react";
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
                    <h1 style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                        Panel General
                    </h1>
                    <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem", fontSize: "1.1rem" }}>
                        Supervisa métricas de la clínica y solicitudes activas en tiempo real.
                    </p>
                </div>

                <div className="dash-grid">
                    <Link href="/admin" className="dash-card" style={{ textDecoration: 'none', cursor: 'pointer', background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>
                        <div className="card-icon bg-purple-light">
                            <Users size={28} />
                        </div>
                        <div className="card-info">
                            <h3 style={{ color: 'var(--text-secondary)' }}>Pacientes Totales</h3>
                            <div className="card-value" style={{ color: 'var(--text-primary)' }}>{totalPacientes}</div>
                        </div>
                    </Link>

                    <Link href="/admin/appointments" className="dash-card" style={{ textDecoration: 'none', cursor: 'pointer', background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>
                        <div className="card-icon bg-pink-light">
                            <Activity size={28} />
                        </div>
                        <div className="card-info">
                            <h3 style={{ color: 'var(--text-secondary)' }}>Consultas Pendientes</h3>
                            <div className="card-value" style={{ color: 'var(--text-primary)' }}>{citasPendientes}</div>
                        </div>
                    </Link>

                    <Link href="/admin/appointments" className="dash-card" style={{ textDecoration: 'none', cursor: 'pointer', background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>
                        <div className="card-icon bg-blue-light">
                            <Clock size={28} />
                        </div>
                        <div className="card-info">
                            <h3 style={{ color: 'var(--text-secondary)' }}>Citas de Hoy</h3>
                            <div className="card-value" style={{ color: 'var(--text-primary)' }}>{citasHoy}</div>
                        </div>
                    </Link>
                </div>

                {/* Resumen de Sistema */}
                <div className="feature-card" style={{ padding: "2rem", marginTop: "2rem", background: 'var(--surface)', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                        <ShieldCheck size={28} color="var(--primary)" />
                        <div>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: 'var(--text-primary)' }}>Sistema Activo</h2>
                            <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                                Cifrado y Conexiones Seguras a base de datos validadas.
                            </p>
                        </div>
                    </div>
                    <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                        Bienvenido nuevamente, Administrador {session?.user?.name}. <br /><br />
                        Los pacientes pueden agendar citas y apartar productos en línea. Todas las reservas llegarán a tu nueva Agenda interactiva en tiempo real.
                    </p>

                    <div style={{ marginTop: "1.5rem", display: 'flex', gap: '1rem' }}>
                        <Link href="/admin/appointments" className="btn btn-primary" style={{ border: "none", textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Calendar size={16} /> Ver Agenda Interactiva
                        </Link>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Dashboard error:", error);
        return <div>Error al cargar el panel general.</div>;
    }
}
