'use client';
import { useState } from 'react';
import { Search, Filter, MoreVertical, Edit, CheckCircle, Clock, Save, X, Eye } from 'lucide-react';

import { updateAppointment } from './actions';

export interface AppointmentData {
    id: string;
    patientName: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    frame: string;
    lensType: string;
    notes: string;
}

export default function AdminAppointmentsClient({ initialData }: { initialData: AppointmentData[] }) {
    const [appointments, setAppointments] = useState<AppointmentData[]>(initialData);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Partial<AppointmentData>>({});

    const handleEditClick = (appt: AppointmentData) => {
        setEditingId(appt.id);
        setEditForm(appt);
    };

    const handleSave = async () => {
        if (!editingId) return;

        // Visual update update optimistic
        setAppointments(prev => prev.map(a => a.id === editingId ? { ...a, ...editForm } as AppointmentData : a));

        try {
            await updateAppointment(editingId, {
                date: editForm.date || '',
                time: editForm.time || '',
                status: editForm.status || 'pending',
                notes: editForm.notes || ''
            });
        } catch (e) {
            console.error(e);
            alert("Hubo un error al guardar la cita en la base de datos.");
        }

        setEditingId(null);
    };

    const statusColors = {
        pending: { bg: 'rgba(251, 197, 49, 0.15)', color: '#fbc531', label: 'Pendiente' },
        confirmed: { bg: 'rgba(46, 213, 115, 0.15)', color: '#2ed573', label: 'Confirmada' },
        completed: { bg: 'rgba(170, 70, 241, 0.15)', color: '#aa46f1', label: 'Completada' },
        cancelled: { bg: 'rgba(232, 65, 24, 0.15)', color: '#e84118', label: 'Cancelada' }
    };

    return (
        <div className="fade-in pb-12">
            <div style={{ marginBottom: "2.5rem", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                        Gestión de Citas y Armazones
                    </h1>
                    <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem", fontSize: "1.1rem" }}>
                        Visualiza los pacientes agendados y los lentes que apartaron desde su carrito híbrido.
                    </p>
                </div>
            </div>

            {/* Panel de Controles */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                    <input
                        type="text"
                        placeholder="Buscar por paciente o armazón..."
                        className="input-field"
                        style={{ width: '100%', paddingLeft: '2.5rem' }}
                    />
                </div>
                <button className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter size={18} /> Filtrar por Día
                </button>
            </div>

            {/* Tabla Compleja Interactiva */}
            <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Paciente</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Fecha y Hora</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Estatus</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Carrito Híbrido</th>
                                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: '600', textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appt) => (
                                <tr key={appt.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>

                                    {/* Paciente */}
                                    <td style={{ padding: '1.5rem' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{appt.patientName}</div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>Expediente Digital #A0{appt.id.slice(0, 4)}</div>
                                    </td>

                                    {/* Fecha */}
                                    <td style={{ padding: '1.5rem' }}>
                                        {editingId === appt.id ? (
                                            <div style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                                                <input type="date" value={editForm.date} onChange={e => setEditForm({ ...editForm, date: e.target.value })} className="input-field" style={{ padding: '0.5rem' }} />
                                                <input type="time" value={editForm.time} onChange={e => setEditForm({ ...editForm, time: e.target.value })} className="input-field" style={{ padding: '0.5rem' }} />
                                            </div>
                                        ) : (
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
                                                    <Clock size={16} color="var(--primary)" /> {appt.time} hrs
                                                </div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>{appt.date}</div>
                                            </div>
                                        )}
                                    </td>

                                    {/* Estatus */}
                                    <td style={{ padding: '1.5rem' }}>
                                        {editingId === appt.id ? (
                                            <select
                                                className="input-field"
                                                value={editForm.status}
                                                onChange={e => setEditForm({ ...editForm, status: e.target.value as any })}
                                                style={{ padding: '0.5rem', width: '130px' }}
                                            >
                                                <option value="pending">Pendiente</option>
                                                <option value="confirmed">Confirmada</option>
                                                <option value="completed">Completada</option>
                                                <option value="cancelled">Cancelada</option>
                                            </select>
                                        ) : (
                                            <span style={{
                                                background: statusColors[appt.status].bg,
                                                color: statusColors[appt.status].color,
                                                padding: '0.4rem 0.8rem',
                                                borderRadius: '20px',
                                                fontSize: '0.85rem',
                                                fontWeight: 'bold',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '0.3rem'
                                            }}>
                                                {appt.status === 'confirmed' && <CheckCircle size={14} />}
                                                {statusColors[appt.status].label}
                                            </span>
                                        )}
                                    </td>

                                    {/* Carrito (Armazón y Mica) */}
                                    <td style={{ padding: '1.5rem', maxWidth: '280px' }}>
                                        {editingId === appt.id ? (
                                            <textarea
                                                className="input-field"
                                                value={editForm.notes}
                                                onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                                                style={{ padding: '0.5rem', width: '100%', fontSize: '0.9rem', minHeight: '80px' }}
                                                placeholder="Notas médicas o de inventario..."
                                            />
                                        ) : (
                                            <div style={{ fontSize: '0.9rem' }}>
                                                <div style={{ color: 'var(--text-primary)', marginBottom: '0.3rem', display: 'flex', alignItems: 'start', gap: '0.3rem' }}><Eye size={15} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} /> <strong>{appt.frame}</strong></div>
                                                <div style={{ color: 'var(--text-secondary)' }}><em>{appt.lensType}</em></div>
                                                <div style={{ marginTop: '0.5rem', color: '#ffb142', fontStyle: 'italic', fontSize: '0.85rem', background: 'rgba(255, 177, 66, 0.1)', padding: '0.4rem', borderRadius: '4px' }}>
                                                    " {appt.notes} "
                                                </div>
                                            </div>
                                        )}
                                    </td>

                                    {/* Acciones */}
                                    <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                                        {editingId === appt.id ? (
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button onClick={handleSave} className="btn btn-primary" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                                                    <Save size={16} /> Guardar
                                                </button>
                                                <button onClick={() => setEditingId(null)} className="btn btn-secondary" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center' }}>
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button onClick={() => handleEditClick(appt)} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', fontSize: '0.9rem' }}>
                                                <Edit size={16} /> Modificar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
