import Link from 'next/link';
import { Eye, Clock, Ruler, ArrowRight } from "lucide-react";
import { query } from "@/lib/db";

export default async function BookAppointmentPage() {

    const res = await query(`
        SELECT 
            id, 
            name, 
            brand, 
            price, 
            stock, 
            image_url,
            category,
            color,
            size_category,
            status
        FROM frames
        WHERE status = 'active'
        ORDER BY created_at DESC
    `);

    const framesData = res.rows.map((row: any) => ({
        ...row,
        price: parseFloat(row.price || 0),
        stock: parseInt(row.stock || 0, 10),
    }));

    return (
        <div className="fade-in pb-12">
            <div style={{ marginBottom: "2.5rem" }}>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Visión y Accesorios</span>
                <h1 style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "var(--font-heading)", color: "var(--text-primary)", marginTop: '0.5rem' }}>
                    Paso 1: Armazones, Consumibles y Estilos
                </h1>
                <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem", fontSize: "1.1rem" }}>
                    Navega nuestro catálogo de productos. Añade a tu cita médica los armazones para probar o los artículos que desees reservar.
                </p>
            </div>

            <div className="dash-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2rem" }}>
                {framesData.map((frame: any) => (
                    <div key={frame.id} style={{
                        background: 'var(--surface)',
                        borderRadius: '16px',
                        border: '1px solid var(--glass-border)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.3s ease',
                        cursor: 'pointer'
                    }}>
                        {/* Contenedor de la Imagen */}
                        <div style={{
                            height: '200px',
                            width: '100%',
                            backgroundColor: 'var(--surface)',
                            backgroundImage: `url(${frame.image_url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderBottom: '1px solid var(--glass-border)',
                            position: 'relative'
                        }}>
                            <span style={{
                                position: 'absolute',
                                top: '1rem',
                                left: '1rem',
                                background: 'rgba(0,0,0,0.6)',
                                color: 'var(--text-primary)',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                letterSpacing: '1px',
                                textTransform: 'uppercase',
                                backdropFilter: 'blur(4px)'
                            }}>
                                {frame.category === 'accesorio' ? 'Accesorio' : frame.category === 'consumible' ? 'Consumible' : 'Armazón'}
                            </span>
                        </div>

                        {/* Información del Armazón */}
                        <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{frame.name}</h3>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{frame.brand}</span>
                                </div>
                                <div style={{ background: 'var(--primary)', color: 'var(--text-primary)', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                                    ${frame.price}
                                </div>
                            </div>

                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                                {frame.color ? `Color: ${frame.color}` : 'Color Clásico'}
                                {frame.size_category && ` • Talla: ${frame.size_category}`}
                            </p>

                            {/* Botón hacia las micas */}
                            <div style={{ marginTop: 'auto' }}>
                                <Link href={`/app/book-appointment/${frame.id}`} className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'space-between', padding: '0.8rem 1rem' }}>
                                    <span>{frame.category === 'armazon' || !frame.category ? 'Seleccionar Estilo' : 'Añadir a mi Cita'}</span>
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
                {framesData.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>No hay armazones disponibles por el momento</h3>
                        <p>Vuelve más tarde para ver nuestros nuevos modelos.</p>
                    </div>
                )}
            </div>

            {/* Opción para los que NO quieren comprar nada y solo quieren consulta */}
            <div style={{ marginTop: '3rem', padding: '2rem', textAlign: 'center', borderTop: '1px solid var(--glass-border)' }}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>¿Solo necesitas revisarte la vista sin comprar armazón?</p>
                <Link href="/app/book-appointment/no-frame/schedule" className="btn btn-secondary" style={{ padding: '0.5rem 2rem', opacity: 0.8, display: 'inline-block', textDecoration: 'none' }}>
                    Agendar Consulta Básica
                </Link>
            </div>
        </div>
    );
}
