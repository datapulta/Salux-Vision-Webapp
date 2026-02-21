import { auth } from "@/lib/auth/authOptions";
import { Calendar, Clock, Eye, AlertCircle, MapPin } from "lucide-react";
import Link from "next/link";
import { redirect } from 'next/navigation';

import { query } from "@/lib/db";

export default async function MyAppointmentsPage() {
    const session = await auth();
    if (!session || !session.user) return redirect('/login');

    // Leemos directo desde la BD Real
    const res = await query(`
        SELECT * FROM appointments 
        WHERE user_id = $1 
        ORDER BY appointment_date ASC, appointment_time ASC
    `, [session.user.id]);

    const realAppointments = res.rows.map((row: any) => ({
        id: row.id,
        date: new Date(row.appointment_date).toISOString().split('T')[0],
        time: row.appointment_time.slice(0, 5) + ' hrs',
        status: row.status as 'pending' | 'confirmed' | 'completed' | 'cancelled',
        type: row.selected_frame_id === 'no-frame' ? 'Evaluación Visual Gratuita' : 'Prueba de Armazón y Cita',
        frame_preview: row.selected_frame_id === 'no-frame' ? 'Ninguno' : `Cod: ${row.selected_frame_id}`,
        address: 'Clínica Principal Salux',
        notes: row.patient_notes
    }));

    return (
        <div className="fade-in pb-12">
            <div style={{ marginBottom: "2.5rem", display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                        Mis Citas Médicas
                    </h1>
                    <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem", fontSize: "1.1rem" }}>
                        Gestiona tus próximas evaluaciones clínicas y apartados de armazones.
                    </p>
                </div>
                <Link href="/app/book-appointment" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', borderRadius: '20px', textDecoration: 'none' }}>
                    + Nueva Cita
                </Link>
            </div>

            {/* Listado de Citas Activas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {realAppointments.map((appt) => (
                    <div key={appt.id} style={{
                        background: 'var(--surface)',
                        borderRadius: '16px',
                        border: '1px solid var(--glass-border)',
                        padding: '2rem',
                        display: 'flex',
                        gap: '2rem',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap'
                    }}>
                        {/* Bloque de Fechas Principal */}
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{
                                background: 'rgba(170, 70, 241, 0.1)',
                                border: '1px solid var(--primary)',
                                padding: '1rem',
                                borderRadius: '12px',
                                textAlign: 'center',
                                minWidth: '90px'
                            }}>
                                <span style={{ display: 'block', fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--primary)', lineHeight: '1' }}>24</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--primary-light)', textTransform: 'uppercase', letterSpacing: '1px' }}>OCT</span>
                            </div>

                            <div>
                                <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>{appt.type}</h2>
                                <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={16} /> {appt.time}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={16} /> {appt.address}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bloque Detalle y Estatus */}
                        <div style={{ flex: '1', minWidth: '250px', borderLeft: '1px solid var(--glass-border)', paddingLeft: '2rem' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <span style={{
                                    background: appt.status === 'confirmed' ? 'rgba(46, 213, 115, 0.15)' : 'rgba(251, 197, 49, 0.15)',
                                    color: appt.status === 'confirmed' ? '#2ed573' : '#fbc531',
                                    padding: '0.3rem 0.8rem',
                                    borderRadius: '20px',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem'
                                }}>
                                    {appt.status === 'confirmed' ? "Confirmada por la Clínica" : "Pendiente de Confirmación"}
                                </span>
                            </div>

                            <p style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <Eye size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                                <span><strong>Reserva Física:</strong> <br /> {appt.frame_preview}</span>
                            </p>
                        </div>

                        {/* Acciones */}
                        <div>
                            <button className="btn btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', color: '#ff6b81', borderColor: 'rgba(255, 107, 129, 0.3)' }}>
                                Cancelar Cita
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Aviso Historial */}
            <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)' }}>
                <AlertCircle size={24} color="var(--primary)" />
                <p style={{ fontSize: '0.95rem' }}>Las citas pasadas o completadas se moverán automáticamente a tu <strong>Historial Clínico</strong> una vez que el oftalmólogo suba tu receta digital a la plataforma.</p>
            </div>

        </div>
    );
}
