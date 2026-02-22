import Link from 'next/link';
import { Eye, ArrowRight, ArrowLeft, Sparkles, Tag } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
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
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', position: 'relative', overflowX: 'hidden' }}>

            {/* Background Decorations */}
            <div className="bg-dot-grid" style={{ opacity: 0.3 }}></div>
            <div className="bg-orb bg-orb-1" style={{ width: '300px', height: '300px', top: '-100px', left: '-100px' }}></div>

            {/* Mini Navbar Público */}
            <header className="navbar fade-in">
                <div className="container nav-content">
                    <Link href="/" className="logo" style={{ textDecoration: 'none' }}>
                        <div className="logo-icon-wrapper" style={{ background: 'var(--primary-glow)', borderRadius: '10px' }}>
                            <Eye size={20} color="var(--primary)" strokeWidth={2.5} />
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: '800' }}><span className="gradient-text">Salux</span> Vision</span>
                    </Link>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <ThemeToggle />
                        <Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600', fontSize: '0.9rem' }}>
                            <ArrowLeft size={16} /> Volver
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="container pb-12 fade-in" style={{ marginTop: '5rem', position: 'relative', zIndex: 1 }}>
                <div style={{ marginBottom: "4rem", textAlign: 'center' }}>
                    <div className="badge" style={{ backgroundColor: 'rgba(109, 93, 252, 0.1)', color: 'var(--primary)', marginBottom: '1.5rem', margin: '0 auto 1.5rem auto' }}>
                        <Sparkles size={14} style={{ marginRight: '6px' }} /> Catálogo de Impacto Social
                    </div>
                    <h1 className="gradient-text" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: "800", marginBottom: '1rem' }}>
                        Salud Visual para Todos
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.15rem", maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
                        Selecciona tu armazón favorito y agenda tu cita médica de alta calidad.
                        Precios justos diseñados para democratizar el acceso óptico.
                    </p>
                </div>

                <div className="dash-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
                    {framesData.map((frame: any) => (
                        <div key={frame.id} className="feature-card" style={{
                            padding: '0',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}>
                            {/* Visual Header */}
                            <div style={{
                                height: '200px',
                                width: '100%',
                                position: 'relative',
                                background: 'var(--bg-secondary)',
                                overflow: 'hidden'
                            }}>
                                {frame.image_url ? (
                                    <img
                                        src={frame.image_url}
                                        alt={frame.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                        className="card-image-hover"
                                    />
                                ) : (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.1 }}>
                                        <Eye size={64} />
                                    </div>
                                )}
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    background: 'var(--glass-bg)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid var(--glass-border)',
                                    color: 'var(--text-primary)',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                }}>
                                    <Tag size={12} /> {frame.brand}
                                </div>
                            </div>

                            {/* Content */}
                            <div style={{ padding: '1.5rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: '1.25rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>{frame.name}</h3>
                                        <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1.25rem' }}>
                                            ${frame.price}
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span className="status-badge status-completed" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                                            {frame.category || 'Armazón'}
                                        </span>
                                        {frame.color && <span>• {frame.color}</span>}
                                    </div>
                                </div>

                                <Link href={`/login?redirect=/app/book-appointment/${frame.id}`} style={{ marginTop: 'auto', textDecoration: 'none' }}>
                                    <button className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                                        Apartar y Agendar <ArrowRight size={18} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}

                    {framesData.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '6rem 2rem' }}>
                            <div style={{ background: 'var(--glass-surface)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
                                <Eye size={40} color="var(--text-muted)" />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Catálogo en Mantenimiento</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Estamos actualizando nuestros modelos sociales. Vuelve muy pronto.</p>
                        </div>
                    )}
                </div>
            </main>

            <footer className="footer container" style={{ borderTop: '1px solid var(--glass-border)', marginTop: '4rem' }}>
                <p className="footer-copy">© {new Date().getFullYear()} Salux Vision • Democratizando la salud visual.</p>
            </footer>
        </div>
    );
}
