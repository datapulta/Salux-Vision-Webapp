"use client";

import { Activity, Eye, Heart, ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <>
      <nav className="navbar fade-in">
        <div className="container nav-content">
          <div className="logo">
            <div className="logo-icon-wrapper">
              <Eye size={32} color="var(--secondary)" strokeWidth={2.5} />
            </div>
            <span><span className="highlight">Salux</span> Vision</span>
          </div>
          <div>
            <button className="btn btn-secondary">
              Conocer Más <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="container hero-content">
            <div className="badge fade-in delay-1">
              <Sparkles size={14} style={{ display: "inline", marginBottom: "-2px", marginRight: "6px" }} />
              Health Tech de Nueva Generación
            </div>
            <h1 className="fade-in delay-2">
              Visión y Salud, <br />
              <span className="gradient-text">Redefinidas para Todos.</span>
            </h1>
            <p className="fade-in delay-3">
              Salux Vision es una plataforma emergente de health-tech dedicada a democratizar el cuidado óptico. Impulsados por un audaz objetivo social, combinamos soluciones avanzadas de salud digital con un enfoque empático, seguro y centrado en el paciente.
            </p>
            <div className="hero-actions fade-in delay-3">
              <button className="btn btn-primary">
                Únete a la Misión <Heart size={18} />
              </button>
              <button className="btn btn-secondary">
                Nuestra Tecnología
              </button>
            </div>
          </div>
        </section>

        <section className="features container">
          <div className="section-header fade-in">
            <h2 className="section-title">Una Visión con Propósito</h2>
            <p className="section-subtitle">
              Estamos construyendo más que solo tecnología; estamos creando un ecosistema de impacto social para asegurar que el cuidado visual de alta calidad llegue a todos.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card fade-in delay-1">
              <div className="feature-icon icon-purple">
                <Activity size={32} />
              </div>
              <h3 className="feature-title">Ecosistema Health Tech</h3>
              <p className="feature-desc">
                Aprovechando lo último en Inteligencia Artificial y diagnósticos digitales para hacer el monitoreo de la visión más ágil, accesible y extraordinariamente preciso.
              </p>
            </div>

            <div className="feature-card fade-in delay-2">
              <div className="feature-icon icon-pink">
                <Heart size={32} />
              </div>
              <h3 className="feature-title">Objetivo Social</h3>
              <p className="feature-desc">
                Comprometidos con derribar las barreras de atención. Creemos firmemente que ver claro es un derecho humano fundamental, no un lujo.
              </p>
            </div>

            <div className="feature-card fade-in delay-3">
              <div className="feature-icon icon-blue">
                <ShieldCheck size={32} />
              </div>
              <h3 className="feature-title">Confiable y Seguro</h3>
              <p className="feature-desc">
                Construido sobre cimientos de confianza clínica. Cumplimos con estándares médicos para la gestión de datos segura y transparente de cada usuario.
              </p>
            </div>
          </div>
        </section>

        <section className="vision-section">
          <div className="container vision-container">
            <div className="vision-image-wrapper fade-in">
              <Eye className="logo-large" color="var(--primary)" strokeWidth={1} style={{ mixBlendMode: 'overlay' }} />
              <div style={{ position: 'absolute' }}>
                <Eye size={120} color="var(--text-primary)" strokeWidth={1.5} />
              </div>
            </div>
            <div className="vision-content fade-in delay-2">
              <h2>Escalando para un Mañana más Sano.</h2>
              <p>
                Lo que comienza como un portal informativo, pronto escalará hacia una plataforma integral. El objetivo de Salux Vision es conectar pacientes, médicos especialistas y diagnósticos avanzados bajo una misma red accesible.
              </p>
              <div className="stats-grid">
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

      <footer className="footer container">
        <div className="logo footer-logo">
          <Eye size={24} color="var(--primary-light)" />
          <span>Salux Vision</span>
        </div>
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Salux Vision. Todos los derechos reservados. Construyendo un futuro más claro y saludable.
        </p>
      </footer>
    </>
  );
}
