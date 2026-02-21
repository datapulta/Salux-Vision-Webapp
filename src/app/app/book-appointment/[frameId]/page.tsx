import { ArrowLeft, ArrowRight, Clock, Eye, Sparkles } from "lucide-react";
import Link from 'next/link';

import { use } from 'react';

export default function LensSelectionWizard({ params }: { params: Promise<{ frameId: string }> }) {
    const resolvedParams = use(params);
    const selectedFrameId = resolvedParams.frameId;

    // Lógica de "Wizard" estilo Lenskart (Simplificada)
    const lensTypes = [
        {
            id: "type_power",
            title: "Con Graduación (Receta)",
            description: "Miopía, hipermetropía o astigmatismo",
            icon: Eye,
            tag: "Más Común",
            color: "#AA46F1"
        },
        {
            id: "type_zero",
            title: "Sin Graduación",
            description: "Para protección frente a pantallas (Filtro azul)",
            icon: Sparkles,
            tag: "Ideal PC",
            color: "#6D28D9"
        }
    ];

    return (
        <div className="fade-in pb-12">
            {/* Barra de Progreso Lenskart-Style */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <Link href="/app/book-appointment" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={20} /> <span style={{ marginLeft: '0.5rem' }}>Volver</span>
                </Link>
                <div style={{ flex: 1, display: 'flex', gap: '0.5rem', justifyContent: 'center', maxWidth: '400px', margin: '0 auto' }}>
                    <div style={{ flex: 1, height: '4px', background: 'var(--primary)', borderRadius: '2px' }} />
                    <div style={{ flex: 1, height: '4px', background: 'var(--primary)', borderRadius: '2px' }} />
                    <div style={{ flex: 1, height: '4px', background: 'var(--surface)', borderRadius: '2px' }} />
                </div>
            </div>

            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <div style={{ marginBottom: "2rem", textAlign: 'center' }}>
                    <h1 style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                        Paso 2: Tipo de Mica
                    </h1>
                    <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem", fontSize: "1.1rem" }}>
                        Selecciona el uso principal que le darás a las gafas. El doctor confirmará tus datos reales en la óptica.
                    </p>
                </div>

                {/* Las Opciones de Micas Verticales */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {lensTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                            <Link href={`/app/book-appointment/${selectedFrameId}/schedule`} key={type.id} style={{
                                background: 'var(--surface)',
                                borderRadius: '16px',
                                border: '1px solid var(--glass-border)',
                                padding: '2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden',
                                textDecoration: 'none'
                            }}
                            >
                                {/* Ícono grande izquierdo */}
                                <div style={{ background: `rgba(255,255,255,0.05)`, padding: '1rem', borderRadius: '50%', color: type.color }}>
                                    <Icon size={40} strokeWidth={1.5} />
                                </div>

                                {/* Textos Centrales */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>{type.title}</h2>
                                        {type.tag && (
                                            <span style={{
                                                background: 'rgba(255,255,255,0.1)',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                color: type.color
                                            }}>
                                                {type.tag}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                                        {type.description}
                                    </p>
                                </div>

                                {/* Botón de Siguiente (Flecha o Acción) */}
                                <div>
                                    <ArrowRight size={24} color="var(--text-secondary)" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Enlace al último paso (Agendar). 
            Por brevedad del demo, vamos directo a agendar despues de el tipo de mica */}
                <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                    <Link href={`/app/book-appointment/${selectedFrameId}/schedule`} className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.2rem', display: 'inline-block' }}>
                        Avanzar a la Fecha y Hora de la Cita
                    </Link>
                </div>

            </div >
        </div >
    );
}
