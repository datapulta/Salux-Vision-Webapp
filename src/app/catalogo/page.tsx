import Link from 'next/link';
import { Eye, ArrowRight, ArrowLeft } from "lucide-react";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function PublicCatalogPage() {

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
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>

            {/* Mini Navbar Público */}
            <header className="navbar fade-in" style={{ borderBottom: '1px solid var(--glass-border)' }}>
                <div className="container nav-content">
                    <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
                        <div className="logo-icon-wrapper">
                            <Eye size={24} color="var(--secondary)" strokeWidth={2.5} />
                        </div>
                        <span><span className="highlight">Salux</span> Vision</span>
                    </Link>
                    <nav>
                        <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ArrowLeft size={16} /> Volver al Inicio
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="container pb-12 fade-in" style={{ marginTop: '3rem' }}>
                <div style={{ marginBottom: "3rem", textAlign: 'center' }}>
                    <span style={{ color: 'var(--primary)', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>Catálogo de Impacto Social</span>
                    <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", fontFamily: "var(--font-heading)", color: "var(--text-primary)", marginTop: '0.5rem' }}>
                        Salud Visual al Alcance de Todos
                    </h1>
                    <p style={{ color: "var(--text-secondary)", marginTop: "1rem", fontSize: "1.2rem", maxWidth: '600px', margin: '1rem auto 0 auto' }}>
                        Explora nuestros modelos de alta calidad a precios justos y reales. Selecciona tu armazón favorito y aparta tu cita médica sin comprometer tu economía.
                    </p>
                </div>

                <div className="dash-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "2.5rem" }}>
                    {framesData.map((frame: any) => (
                        <div key={frame.id} style={{
                            background: 'var(--surface)',
                            borderRadius: '20px',
                            border: '1px solid var(--glass-border)',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'transform 0.3s ease',
                        }}>
                            {/* Contenedor de la Imagen */}
                            <div style={{
                                height: '220px',
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
                            <div style={{ padding: '2rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{frame.name}</h3>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{frame.brand}</span>
                                    </div>
                                    <div style={{ background: 'rgba(170, 70, 241, 0.1)', color: 'var(--primary-light)', padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '1rem', fontWeight: 'bold', border: '1px solid var(--primary)' }}>
                                        ${frame.price}
                                    </div>
                                </div>

                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: '1.5' }}>
                                    {frame.color ? `Color: ${frame.color}` : 'Color Clásico'}
                                    {frame.size_category && ` • Talla: ${frame.size_category}`}
                                </p>

                                {/* Botón Call To Action Público */}
                                <div style={{ marginTop: 'auto' }}>
                                    <Link href={`/login?redirect=/app/book-appointment/${frame.id}`}>
                                        <button className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
                                            {frame.category === 'armazon' || !frame.category ? 'Apartar y Agendar Cita' : 'Añadir a mi Cita/Compra'} <ArrowRight size={18} />
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                    {framesData.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-secondary)' }}>
                            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>No hay armazones disponibles por el momento</h3>
                            <p>Vuelve más tarde para ver nuestros nuevos modelos sociales.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
