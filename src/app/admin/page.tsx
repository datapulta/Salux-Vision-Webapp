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
            SELECT id, name, email, role, provider, created_at
            FROM users 
            WHERE role = 'user'
            ORDER BY created_at DESC
        `);

        const patients = res.rows;

        return (
            <div className="fade-in pb-12">
                <div style={{ marginBottom: "2.5rem", display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 className="gradient-text" style={{ fontSize: "2.25rem", fontWeight: "800", marginBottom: '0.5rem' }}>
                            Directorio Clínico
                        </h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", fontWeight: '500' }}>
                            Gestión centralizada de expedientes y cuentas de pacientes.
                        </p>
                    </div>
                    <div className="dash-card" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-glow)', border: '1px solid var(--primary)' }}>
                        <Users size={24} color="var(--primary)" />
                        <div className="card-info">
                            <div className="card-value" style={{ fontSize: '1.25rem' }}>{patients.length} Registrados</div>
                        </div>
                    </div>
                </div>

                <div className="table-container fade-in">
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>PACIENTE</th>
                                    <th>CORREO / CONTACTO</th>
                                    <th>FECHA DE REGISTRO</th>
                                    <th style={{ textAlign: 'right' }}>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            <Users size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2 }} />
                                            No hay pacientes registrados aún.
                                        </td>
                                    </tr>
                                ) : (
                                    patients.map((patient) => (
                                        <tr key={patient.id}>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{
                                                        width: '40px',
                                                        height: '40px',
                                                        background: 'var(--primary)',
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        boxShadow: '0 4px 8px var(--primary-glow)'
                                                    }}>
                                                        {patient.name?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <div style={{ color: 'var(--text-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            {patient.name}
                                                            {patient.provider === 'google' ? (
                                                                <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', background: 'rgba(66, 133, 244, 0.1)', color: '#4285f4', borderRadius: '4px', fontWeight: 'bold' }}>GOOGLE</span>
                                                            ) : (
                                                                <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', background: 'rgba(109, 93, 252, 0.1)', color: 'var(--primary)', borderRadius: '4px', fontWeight: 'bold' }}>EMAIL</span>
                                                            )}
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {patient.id.substring(0, 8)}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                                    <Mail size={14} /> {patient.email}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                                    <CalendarIcon size={14} /> {new Date(patient.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <Link href={`/admin/appointments?user=${patient.id}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                                                    <FileText size={14} /> Expediente
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
