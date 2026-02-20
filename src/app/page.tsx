import { auth } from "@/lib/auth/authOptions";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { Activity, Eye, Heart, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="navbar fade-in">
        <div className="container nav-content">
          <div className="logo" aria-label="Logotipo de Salux Vision">
            <div className="logo-icon-wrapper" aria-hidden="true">
              <Eye size={32} color="var(--secondary)" strokeWidth={2.5} />
            </div>
            <span><span className="highlight">Salux</span> Vision</span>
          </div>
          <nav aria-label="Navegación principal" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {session ? (
              <>
                <Link href={session.user?.role === "admin" ? "/admin" : "/app"} className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                  {session.user?.role === "admin" ? "Panel Admin" : "Mi Panel"}
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login" style={{ color: "var(--text-secondary)", textDecoration: 'none', fontWeight: 500, fontSize: "0.875rem" }}>
                  Iniciar Sesión
                </Link>
                <Link href="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                  Crear Cuenta <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" aria-labelledby="hero-heading">
          <div className="container hero-content">
            <div className="badge fade-in delay-1" role="text">
              <Sparkles size={14} style={{ display: "inline", marginBottom: "-2px", marginRight: "6px" }} aria-hidden="true" />
              Health Tech de Nueva Generación
            </div>
            <h1 id="hero-heading" className="fade-in delay-2">
              Visión y Salud, <br />
              <span className="gradient-text">Redefinidas para Todos.</span>
            </h1>
            <p className="fade-in delay-3">
              Salux Vision es una plataforma emergente de health-tech dedicada a democratizar el cuidado óptico. Impulsados por un audaz objetivo social, combinamos soluciones avanzadas de salud digital con un enfoque empático, seguro y centrado en el paciente.
            </p>
            <div className="hero-actions fade-in delay-3">
              {session ? (
                <Link href={session.user?.role === "admin" ? "/admin" : "/app"} className="btn btn-primary" style={{ textDecoration: 'none' }}>
                  Ir a mi Tablero <ArrowRight size={18} aria-hidden="true" />
                </Link>
              ) : (
                <Link href="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                  Únete a la Misión <Heart size={18} aria-hidden="true" />
                </Link>
              )}
              <a href="#main-content" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                Nuestra Tecnología
              </a>
            </div>
          </div>
        </section>

        <section className="features container" aria-labelledby="features-heading">
          <div className="section-header fade-in">
            <h2 id="features-heading" className="section-title">Una Visión con Propósito</h2>
            <p className="section-subtitle">
              Estamos construyendo más que solo tecnología; estamos creando un ecosistema de impacto social para asegurar que el cuidado visual de alta calidad llegue a todos.
            </p>
          </div>

          <div className="features-grid">
            <article className="feature-card fade-in delay-1">
              <div className="feature-icon icon-purple" aria-hidden="true">
                <Activity size={32} />
              </div>
              <h3 className="feature-title">Ecosistema Health Tech</h3>
              <p className="feature-desc">
                Aprovechando lo último en Inteligencia Artificial y diagnósticos digitales para hacer el monitoreo de la visión más ágil, accesible y extraordinariamente preciso.
              </p>
            </article>

            <article className="feature-card fade-in delay-2">
              <div className="feature-icon icon-pink" aria-hidden="true">
                <Heart size={32} />
              </div>
              <h3 className="feature-title">Objetivo Social</h3>
              <p className="feature-desc">
                Comprometidos con derribar las barreras de atención médica. Creemos firmemente que ver claro es un derecho humano fundamental, no un lujo.
              </p>
            </article>

            <article className="feature-card fade-in delay-3">
              <div className="feature-icon icon-blue" aria-hidden="true">
                <ShieldCheck size={32} />
              </div>
              <h3 className="feature-title">Confiable y Seguro</h3>
              <p className="feature-desc">
                Construido sobre cimientos de confianza clínica. Cumplimos con estándares médicos para la gestión de datos segura y transparente de cada paciente.
              </p>
            </article>
          </div>
        </section>

        <section className="vision-section" aria-labelledby="vision-heading">
          <div className="container vision-container">
            <div className="vision-image-wrapper fade-in" aria-hidden="true">
              <Eye className="logo-large" color="var(--primary)" strokeWidth={1} style={{ mixBlendMode: 'overlay' }} />
              <div style={{ position: 'absolute' }}>
                <Eye size={120} color="var(--text-primary)" strokeWidth={1.5} />
              </div>
            </div>
            <div className="vision-content fade-in delay-2">
              <h2 id="vision-heading">Escalando para un Mañana más Sano.</h2>
              <p>
                Lo que comienza como un portal informativo web, pronto escalará hacia una plataforma integral. El objetivo de Salux Vision es conectar pacientes, médicos especialistas y diagnósticos avanzados bajo una misma red accesible.
              </p>
              <div className="stats-grid" aria-label="Estadísticas de lanzamiento y enfoque">
                <div className="stat-item">
                  <div className="stat-val">2026</div>
                  <div className="stat-label">Lanzamiento de Plataforma</div>
                </div>
                <div className="stat-item">
                  <div className="stat-val">100%</div>
                  <div className="stat-label">Compromiso Social</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer container" role="contentinfo">
        <div className="logo footer-logo" aria-hidden="true">
          <Eye size={24} color="var(--primary-light)" />
          <span>Salux Vision</span>
        </div>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Salux Vision. Todos los derechos reservados. Construyendo un futuro más claro y saludable para todos.
        </p>
      </footer>
    </>
  );
}
