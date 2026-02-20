import { auth } from "@/lib/auth/authOptions";
import { Users, Activity, Clock, ShieldCheck, ArrowRight } from "lucide-react";

export default async function AdminPage() {
    const session = await auth();

    return (
        <>
            <div style={{ marginBottom: "2rem" }}>
                <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", fontFamily: "var(--font-heading)" }}>
                    Tablero Operativo General
                </h1>
                <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem" }}>
                    Supervisa expedientes médicos y solicitudes activas en tiempo real.
                </p>
            </div>

            <div className="dash-grid">
                <div className="dash-card">
                    <div className="card-icon bg-purple-light">
                        <Users size={28} />
                    </div>
                    <div className="card-info">
                        <h3>Total Pacientes</h3>
                        <div className="card-value">124</div>
                    </div>
                </div>

                <div className="dash-card">
                    <div className="card-icon bg-pink-light">
                        <Activity size={28} />
                    </div>
                    <div className="card-info">
                        <h3>Triajes Pendientes</h3>
                        <div className="card-value">12</div>
                    </div>
                </div>

                <div className="dash-card">
                    <div className="card-icon bg-blue-light">
                        <Clock size={28} />
                    </div>
                    <div className="card-info">
                        <h3>Citas de Hoy</h3>
                        <div className="card-value">5</div>
                    </div>
                </div>
            </div>

            {/* Resumen de Sistema */}
            <div className="feature-card" style={{ padding: "2rem", marginTop: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                    <ShieldCheck size={28} color="var(--primary-light)" />
                    <div>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: "600" }}>Sistema Activo</h2>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                            Cifrado y Conexiones Seguras a base de datos validadas.
                        </p>
                    </div>
                </div>
                <p style={{ color: "var(--text-secondary)", lineHeight: "1.6" }}>
                    Bienvenido nuevamente, Dr. {session?.user?.name}. Tienes acceso administrativo tipo Root. <br /><br />
                    Pronto implementaremos la gestión completa (CRUD) del directorio de pacientes para asignar turnos a tu red de oftalmólogos y generar expedientes médicos digitales.
                </p>

                <div style={{ marginTop: "1.5rem" }}>
                    <button className="btn btn-primary" style={{ border: "none" }}>
                        Ver Pacientes <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </>
    );
}
