import { ArrowLeft, Clock, Calendar, CheckCircle2 } from "lucide-react";
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from "@/lib/auth/authOptions";
import { query } from "@/lib/db";
import { use } from 'react';

export const dynamic = "force-dynamic";

export default function ScheduleAppointment({ params }: { params: Promise<{ frameId: string }> }) {
    const resolvedParams = use(params);
    const frameId = resolvedParams.frameId;
    const isBasicConsult = frameId === 'no-frame';

    // Función de Cierre de Cita en Base de Datos Real
    async function confirmBooking(formData: FormData) {
        'use server'
        const date = formData.get('date');
        const time = formData.get('time');

        const session = await auth();
        if (!session || !session.user) return redirect('/login');

        const userId = session.user.id;

        // Guardamos la cita en la tabla appointments
        await query(`
            INSERT INTO appointments (user_id, appointment_date, appointment_time, status, selected_frame_id, patient_notes)
            VALUES ($1, $2, $3, 'pending', $4, $5)
        `, [
            userId,
            date,
            time,
            isBasicConsult ? 'no-frame' : frameId,
            'Nueva cita desde la web'
        ]);

        console.log('Cita Reservada con éxito:', { date, time, frameId, userId });

        // Redirigir al panel con mensaje de Éxito
        redirect('/app?success=true');
    }

    return (
        <div className="fade-in pb-12">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <Link href={isBasicConsult ? "/app/book-appointment" : `/app/book-appointment/${frameId}`} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={20} /> <span style={{ marginLeft: '0.5rem' }}>Volver</span>
                </Link>
                <div style={{ flex: 1, display: 'flex', gap: '0.5rem', justifyContent: 'center', maxWidth: '400px', margin: '0 auto' }}>
                    <div style={{ flex: 1, height: '4px', background: 'var(--primary)', borderRadius: '2px' }} />
                    <div style={{ flex: 1, height: '4px', background: 'var(--primary)', borderRadius: '2px' }} />
                    <div style={{ flex: 1, height: '4px', background: 'var(--primary)', borderRadius: '2px' }} />
                </div>
            </div>

            <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: 'center' }}>
                <div style={{ marginBottom: "2rem" }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                        {isBasicConsult ? "Agendar Consulta Médica" : "Paso 3: Reserva tu lugar"}
                    </h1>
                    <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem", fontSize: "1.1rem" }}>
                        {isBasicConsult
                            ? "Selecciona el día y hora para tu evaluación visual profesional y detallada en la clínica."
                            : "Ya tenemos tu armazón y micas preparadas. ¿Qué día vienes al consultorio a tu examen?"}
                    </p>
                </div>

                {/* Formulario de Agendamiento en Pantalla Completa */}
                <form action={confirmBooking} style={{
                    background: 'var(--surface)',
                    padding: '2.5rem',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    textAlign: 'left'
                }}>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            <Calendar size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                            Fecha
                        </label>
                        <input
                            type="date"
                            name="date"
                            required
                            className="input-field"
                            style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                        />
                    </div>

                    <div style={{ marginBottom: '2.5rem' }}>
                        <label style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                            <Clock size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.5rem' }} />
                            Hora
                        </label>
                        <input
                            type="time"
                            name="time"
                            required
                            className="input-field"
                            style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                        />
                    </div>

                    <div style={{ background: 'rgba(170, 70, 241, 0.1)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--primary)', marginBottom: '2rem' }}>
                        <h3 style={{ color: 'var(--primary)', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle2 size={20} /> {isBasicConsult ? "Resumen de tu Consulta" : "Resumen de tu Carrito Híbrido"}
                        </h3>
                        <ul style={{ color: 'var(--text-secondary)', marginTop: '1rem', listStyle: 'none', padding: 0, lineHeight: '1.8' }}>
                            {!isBasicConsult && (
                                <>
                                    <li>👓 <strong>Armazón:</strong> {frameId === 'f1' ? 'Wayfarer Classic' : 'Armazón seleccionado'} (Guardado para ti)</li>
                                    <li>🔬 <strong>Micas:</strong> Con Graduación Base</li>
                                </>
                            )}
                            <li>🏥 <strong>Examen Clínico:</strong> Evaluación Oftalmológica Incluida</li>
                        </ul>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', borderRadius: '12px', border: 'none' }}>
                        Confirmar Cita en Óptica
                    </button>
                </form>

            </div>
        </div>
    );
}
