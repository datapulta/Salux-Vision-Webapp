"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Users, Mail, Calendar as CalendarIcon, FileText, Settings, Key, X, Phone, UserCheck, UserX } from "lucide-react";

type Patient = {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    is_active: boolean;
    provider: string;
    created_at: string;
};

export default function ClientDirectoryTable({ initialPatients }: { initialPatients: Patient[] }) {
    const [patients, setPatients] = useState<Patient[]>(initialPatients);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [editPhone, setEditPhone] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredPatients = patients.filter(
        (p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (p: Patient) => {
        setSelectedPatient(p);
        setEditPhone(p.phone || "");
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient) return;

        setIsSaving(true);
        try {
            const res = await fetch(`/api/admin/users/${selectedPatient.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: editPhone,
                    is_active: selectedPatient.is_active
                })
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setPatients(prev => prev.map(p => p.id === updatedUser.id ? { ...p, phone: updatedUser.phone, is_active: updatedUser.is_active } : p));
                setSelectedPatient(null);
            } else {
                alert("Error al guardar cambios");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleActive = async (patient: Patient) => {
        const confirmMsg = patient.is_active
            ? "¿Seguro que quieres SUSPENDER a este paciente? Ya no podrá entrar al sistema."
            : "¿Seguro que quieres REACTIVAR a este paciente?";

        if (!window.confirm(confirmMsg)) return;

        const originalState = [...patients];

        // Optimistic UI Update
        setPatients(prev => prev.map(p => p.id === patient.id ? { ...p, is_active: !p.is_active } : p));

        try {
            const res = await fetch(`/api/admin/users/${patient.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: patient.phone,
                    is_active: !patient.is_active
                })
            });

            if (!res.ok) {
                setPatients(originalState);
                alert("Error de permisos.");
            }
        } catch (error) {
            setPatients(originalState);
            alert("Fallo de red.");
        }
    };

    return (
        <div>
            {/* Search Bar */}
            <div style={{ marginBottom: "2rem", display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Buscar por nombre o correo..."
                    className="input-field"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ flex: 1, maxWidth: '400px' }}
                />
            </div>

            {/* Table */}
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
                            {filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        <Users size={48} style={{ margin: '0 auto 1rem auto', opacity: 0.2 }} />
                                        No se encontraron pacientes.
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map((patient) => (
                                    <tr key={patient.id} style={{ opacity: patient.is_active ? 1 : 0.5 }}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    background: patient.is_active ? 'var(--primary)' : 'var(--glass-border)',
                                                    borderRadius: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                    boxShadow: patient.is_active ? '0 4px 8px var(--primary-glow)' : 'none'
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
                                                        {!patient.is_active && (
                                                            <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', borderRadius: '4px', fontWeight: 'bold' }}>SUSPENDIDO</span>
                                                        )}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {patient.id.substring(0, 8)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', color: 'var(--text-secondary)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <Mail size={14} /> {patient.email}
                                                </div>
                                                {patient.phone && (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                                        <Phone size={12} /> {patient.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                                <CalendarIcon size={14} /> {new Date(patient.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                                <Link href={`/admin/appointments?user=${patient.id}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} title="Ver Expediente Histórico">
                                                    <FileText size={14} />
                                                </Link>
                                                <button onClick={() => handleEdit(patient)} className="btn btn-secondary" style={{ padding: '0.5rem', fontSize: '0.8rem' }} title="Ajustes de Cuenta">
                                                    <Settings size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleToggleActive(patient)}
                                                    className="btn btn-secondary"
                                                    style={{ padding: '0.5rem', fontSize: '0.8rem', color: patient.is_active ? '#ff4444' : '#00C851', borderColor: patient.is_active ? 'rgba(255, 68, 68, 0.2)' : 'rgba(0, 200, 81, 0.2)' }}
                                                    title={patient.is_active ? "Suspender Paciente" : "Reactivar Paciente"}
                                                >
                                                    {patient.is_active ? <UserX size={14} /> : <UserCheck size={14} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal (using fixed overlay) */}
            {/* Edit Modal (using React Portal for fixed overlay escape) */}
            {mounted && selectedPatient && createPortal(
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)' }}>
                    <div className="slide-up" style={{ width: '100%', maxWidth: '420px', background: 'var(--bg-secondary)', padding: '2.5rem', border: '1px solid var(--glass-border)', zIndex: 1000000, position: 'relative', borderRadius: '20px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)', display: 'flex', flexDirection: 'column' }}>

                        <button onClick={() => setSelectedPatient(null)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.background = 'var(--text-primary)'; e.currentTarget.style.color = 'var(--bg-color)'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'var(--glass-surface)'; e.currentTarget.style.color = 'var(--text-muted)'; }}>
                            <X size={18} />
                        </button>

                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                            <Settings size={22} className="text-primary" /> Editar Paciente
                        </h3>

                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nombre Completo</label>
                                <input type="text" className="input-field" value={selectedPatient.name} disabled style={{ opacity: 0.8, cursor: 'not-allowed', background: 'var(--bg-color)' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correo Electrónico</label>
                                <input type="email" className="input-field" value={selectedPatient.email} disabled style={{ opacity: 0.8, cursor: 'not-allowed', background: 'var(--bg-color)' }} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Teléfono Móvil (Opcional)</label>
                                <input
                                    type="tel"
                                    className="input-field"
                                    value={editPhone}
                                    onChange={(e) => setEditPhone(e.target.value)}
                                    placeholder="+52 55 1234 5678"
                                    style={{ background: 'var(--surface-hover)', borderColor: 'var(--primary-glow)' }}
                                />
                            </div>

                            <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', width: '100%', padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}>
                                {isSaving ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </form>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
