import { auth } from "@/lib/auth/authOptions";
import { query } from "@/lib/db";
import { Users, Mail, Calendar as CalendarIcon, FileText } from "lucide-react";
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const dynamic = "force-dynamic";

export default async function AdminDirectoryPage() {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
        redirect('/app');
    }

    try {
        const res = await query(`
            SELECT id, name, email, role, created_at
            FROM users 
            WHERE role = 'user'
            ORDER BY created_at DESC
        `);

        const patients = res.rows;

        return (
            <div className="fade-in pb-12">
                <div style={{ marginBottom: "2.5rem", display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                            Directorio Clínico
                        </h1>
                        <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem", fontSize: "1.1rem" }}>
                            Gestiona los expedientes y cuentas de tus pacientes reales.
                        </p>
                    </div>
                    <div style={{ background: 'var(--surface)', padding: '0.8rem 1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                        <Users size={20} color="var(--primary)" />
                        <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{patients.length} Pacientes</span>
                    </div>
                </div>

                <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                            <thead style={{ background: 'rgba(128,128,128,0.05)', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '1px' }}>
                                <tr>
                                    <th style={{ padding: '1.2rem 1.5rem', fontWeight: 'bold' }}>PACIENTE</th>
                                    <th style={{ padding: '1.2rem 1rem', fontWeight: 'bold' }}>CORREO / CONTACTO</th>
                                    <th style={{ padding: '1.2rem 1rem', fontWeight: 'bold' }}>FECHA DE REGISTRO</th>
                                    <th style={{ padding: '1.2rem 1.5rem', fontWeight: 'bold', textAlign: 'right' }}>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            <Users size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2 }} />
                                            No hay pacientes registrados aún en la base de datos real.
                                        </td>
                                    </tr>
                                ) : (
                                    patients.map((patient) => (
                                        <tr key={patient.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '1.2rem 1.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '45px', height: '45px', background: 'var(--primary)', opacity: 0.9, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                                        {patient.name?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.05rem' }}>
                                                        {patient.name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem 1rem', color: 'var(--text-secondary)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Mail size={16} /> {patient.email}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem 1rem', color: 'var(--text-secondary)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <CalendarIcon size={16} /> {new Date(patient.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem 1.5rem', textAlign: 'right' }}>
                                                <Link href={`/admin/appointments?user=${patient.id}`} className="btn btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none' }}>
                                                    <FileText size={14} /> Ver Citas / Expediente
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    } catch (error) {
        console.error("Directory error:", error);
        return <div style={{ color: 'var(--text-primary)' }}>Error al conectar con la base de datos de pacientes.</div>;
    }
}
