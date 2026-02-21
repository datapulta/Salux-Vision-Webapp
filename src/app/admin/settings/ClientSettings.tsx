"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun, Settings, Monitor, Smartphone, LayoutDashboard } from "lucide-react";

export default function ClientSettings() {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="fade-in pb-12">
            <div style={{ marginBottom: "2.5rem" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                    Ajustes Globales de Plataforma
                </h1>
                <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem", fontSize: "1.1rem" }}>
                    Configura la apariencia, notificaciones y reglas del sistema para administrativos y pacientes.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <Monitor size={20} color="var(--primary)" /> Apariencia e Interfaz
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--glass-border)', transition: 'transform 0.2s', cursor: 'pointer' }}>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    Tema Visual
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.4rem', maxWidth: '300px' }}>
                                    Alterna entre el Modo Claro y Oscuro. Este cambio afecta en tiempo real todas las vistas tanto en móviles como web de escritorio.
                                </p>
                            </div>

                            <button
                                onClick={toggleTheme}
                                className="btn btn-secondary"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.8rem 1.5rem',
                                    background: theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'var(--primary)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px'
                                }}
                            >
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                                {theme === 'dark' ? 'Activar Claro' : 'Activar Oscuro'}
                            </button>
                        </div>

                        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--glass-border)', opacity: 0.6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.5rem' }}>
                                <Smartphone size={18} color="var(--text-secondary)" />
                                <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>Logo Web y App (Próximamente)</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Cambiar dinámica de logotipos directamente desde el software.</p>
                        </div>
                    </div>
                </div>

                <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)', opacity: 0.6, pointerEvents: 'none' }}>
                    <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem', paddingBottom: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                        <LayoutDashboard size={20} color="var(--secondary)" /> Preferencias del Sistema
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Módulo en construcción para reglas de negocio, correos de confirmación y horarios de agenda.</p>
                </div>
            </div>
        </div>
    );
}
