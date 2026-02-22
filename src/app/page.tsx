import { auth } from "@/lib/auth/authOptions";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";
import { Activity, Eye, Heart, ShieldCheck, ArrowRight, Sparkles, Phone, MapPin, Clock, Calendar } from "lucide-react";

export default async function Home() {
  const session = await auth();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "name": "Salux Vision",
    "url": "https://saluxvision.com",
    "logo": "https://saluxvision.com/logo.png",
    "description": "Salux Vision es una plataforma emergente de health-tech dedicada a revolucionar el cuidado de la visión con un objetivo social. Democratizamos el acceso a la salud visual.",
    "slogan": "Visión y Salud, Redefinidas para Todos.",
    "foundingDate": "2026",
    "sameAs": []
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Decorative Elements */}
      <div className="bg-dot-grid"></div>
      <div className="bg-orb bg-orb-1"></div>
      <div className="bg-orb bg-orb-2"></div>

      <header className="navbar fade-in">
        <div className="container nav-content">
          <Link href="/" className="logo" aria-label="Logotipo de Salux Vision">
            <div className="logo-icon-wrapper" style={{ background: 'var(--primary-glow)', borderRadius: '12px' }} aria-hidden="true">
              <Eye size={24} color="var(--primary)" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '1.4rem' }}><span className="gradient-text">Salux</span> Vision</span>
          </Link>
          <nav aria-label="Navegación principal" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <ThemeToggle />
            {session ? (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <Link href={session.user?.role === "admin" ? "/admin" : "/app"} className="btn btn-secondary nav-btn-mobile">
                  <ShieldCheck size={18} className="visible-on-mobile mobile-only-icon" />
                  <span className="hide-on-mobile">{session.user?.role === "admin" ? "Panel Admin" : "Mi Panel"}</span>
                </Link>
                <LogoutButton isMobileOptimized={true} />
              </div>
            ) : (
              <div className="nav-links-group">
                <Link href="/catalogo" className="nav-link-item hide-on-mobile">
                  Catálogo
                </Link>
                <Link href="/login" className="nav-link-item">
                  Entrar
                </Link>
                <Link href="/register" className="btn btn-primary nav-btn-mobile nav-btn-cta">
                  <span className="hide-on-mobile">Registrarme</span>
                  <ArrowRight size={16} aria-hidden="true" className="visible-on-mobile mobile-only-icon" />
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-heading" style={{
          position: 'relative',
          backgroundImage: 'url(/hero_optometria.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}>
          {/* Overlay to ensure text readability against the photo */}
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'var(--bg-color)', opacity: 0.88, zIndex: 0 }}></div>
          <div className="container hero-content" style={{ position: 'relative', zIndex: 1 }}>
            <div className="badge fade-in" style={{ backgroundColor: 'rgba(109, 93, 252, 0.1)', border: '1px solid var(--primary-glow)', color: 'var(--primary)', marginBottom: '1.5rem' }}>
              <Sparkles size={14} style={{ display: "inline", marginBottom: "-2px", marginRight: "6px" }} aria-hidden="true" />
              Impacto Social • Health Tech
            </div>
            <h1 id="hero-heading" className="fade-in" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', lineHeight: '1.1', marginBottom: '1.5rem' }}>
              Visión y Salud, <br />
              <span className="gradient-text">Redefinidas para Todos.</span>
            </h1>
            <p className="fade-in" style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1.1rem, 2vw, 1.25rem)', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
              Democratizamos el cuidado óptico de alta calidad. Tecnología avanzada de diagnóstico con un modelo social diseñado para ser accesible y centrado en el paciente.
            </p>
            <div className="hero-actions fade-in" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              {session ? (
                <Link href={session.user?.role === "admin" ? "/admin" : "/app"} className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: '14px' }}>
                  Gestionar mi Tablero <ArrowRight size={18} aria-hidden="true" />
                </Link>
              ) : (
                <>
                  <Link href="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: '14px' }}>
                    Empezar Ahora <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                  <Link href="/catalogo" className="btn btn-secondary" style={{ padding: '1rem 2rem', borderRadius: '14px' }}>
                    Explorar Catálogo
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="features container" aria-labelledby="features-heading">
          <div className="section-header fade-in">
            <h2 id="features-heading" className="section-title" style={{ fontSize: '2.5rem' }}>Una Visión con Propósito</h2>
            <p className="section-subtitle">
              Estamos creando un ecosistema de impacto social para asegurar que el cuidado visual sea un derecho, no un lujo.
            </p>
          </div>

          <div className="features-grid">
            <article className="feature-card fade-in">
              <div className="feature-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}>
                <Activity size={32} />
              </div>
              <h3 className="feature-title">Ecosistema Health Tech</h3>
              <p className="feature-desc">
                IA avanzada y diagnósticos digitales para un monitoreo visual ágil y extraordinariamente preciso.
              </p>
            </article>

            <article className="feature-card fade-in">
              <div className="feature-icon" style={{ background: 'rgba(232, 80, 147, 0.1)', color: '#e85093' }}>
                <Heart size={32} />
              </div>
              <h3 className="feature-title">Objetivo Social</h3>
              <p className="feature-desc">
                Derribamos las barreras de atención médica mediante un modelo de costos justos y reales para todos.
              </p>
            </article>

            <article className="feature-card fade-in">
              <div className="feature-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                <ShieldCheck size={32} />
              </div>
              <h3 className="feature-title">Clínicamente Seguro</h3>
              <p className="feature-desc">
                Cumplimos con estándares de grado médico para la gestión segura y transparente de los datos del paciente.
              </p>
            </article>
          </div>
        </section>

        <section className="vision-section" aria-labelledby="vision-heading">
          <div className="container vision-container">
            <div className="vision-image-wrapper fade-in">
              <Eye size={120} color="var(--primary)" strokeWidth={1} style={{ opacity: 0.8 }} />
            </div>
            <div className="vision-content fade-in">
              <h2 id="vision-heading" style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Escalando para un Mañana Saludable.</h2>
              <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Salux Vision conecta pacientes, especialistas y diagnósticos avanzados en una red única. Nuestro compromiso es evolucionar continuamente para llevar salud visual a cada rincón.
              </p>
              <div className="stats-grid">
                <div className="stat-item" style={{ borderLeft: '3px solid var(--primary)', paddingLeft: '1.5rem' }}>
                  <div className="stat-val">2026</div>
                  <div className="stat-label">Lanzamiento Oficial</div>
                </div>
                <div className="stat-item" style={{ borderLeft: '3px solid var(--secondary)', paddingLeft: '1.5rem' }}>
                  <div className="stat-val">100%</div>
                  <div className="stat-label">Transparencia</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="contact-section container" aria-labelledby="contact-heading" style={{ padding: '6rem 1rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          <div className="contact-info fade-in" style={{ paddingLeft: '1rem' }}>
            <h2 id="contact-heading" style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', marginBottom: '1rem', fontWeight: '800', lineHeight: 1.1 }}>Visítanos o Agenda tu Cita</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
              Estamos ubicados en el corazón de Huixquilucan. También ofrecemos servicio a domicilio para tu comodidad.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--primary)' }}>
                  <Phone size={24} />
                </div>
                <div>
                  <a href="https://wa.me/525663607793" target="_blank" rel="noopener noreferrer" className="contact-link">
                    +52 56 6360 7793
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--primary)' }}>
                  <MapPin size={24} />
                </div>
                <div>
                  <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: '500', fontSize: '1.1rem' }}>José María Morelos 4</p>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem' }}>Col. Centro, 52760 Huixquilucan de Degollado, Méx.</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                <div style={{ color: 'var(--primary)' }}>
                  <Clock size={24} />
                </div>
                <div>
                  <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: '500', fontSize: '1.1rem' }}>Lunes a Viernes: 10am - 7pm</p>
                  <span style={{ color: 'var(--text-secondary)', display: 'block', marginTop: '0.25rem' }}>Sábados: 10am - 3pm</span>
                </div>
              </div>
            </div>

            <Link href="/book-appointment" className="btn btn-primary" style={{ display: 'inline-flex', padding: '1rem 2rem', borderRadius: '12px', width: 'fit-content' }}>
              <Calendar size={20} style={{ marginRight: '0.5rem' }} /> Agendar Cita Online
            </Link>
          </div>

          <div className="contact-map fade-in" style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--glass-border)', height: '100%', minHeight: '450px', position: 'relative' }}>
            <iframe
              src="https://maps.google.com/maps?q=Jose+Maria+Morelos+4,+Centro,+52760+Huixquilucan+de+Degollado,+Mex&t=&z=17&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Salux Vision">
            </iframe>
          </div>
        </section>
      </main>


      <footer className="footer container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', paddingBottom: '2rem' }}>
        <div className="logo footer-logo">
          <div className="logo-icon-wrapper" style={{ width: '30px', height: '30px', background: 'var(--primary-glow)', borderRadius: '8px' }}>
            <Eye size={18} color="var(--primary)" />
          </div>
          <span style={{ fontWeight: 'bold' }}>Salux Vision</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p className="footer-copy" style={{ marginBottom: '0.5rem' }}>
            © {new Date().getFullYear()} Salux Vision. Redefiniendo la salud visual con impacto social.
          </p>
          <Link href="/privacidad" className="privacy-link" style={{ fontSize: '0.85rem', textDecoration: 'underline', transition: 'color 0.2s', display: 'inline-block' }}>
            Política de Privacidad y Tratamiento de Datos Personales
          </Link>
        </div>
      </footer>
    </div>
  );
}
