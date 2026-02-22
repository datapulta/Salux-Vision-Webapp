import Link from "next/link";
import { Eye, Shield, ArrowRight } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
    title: "Aviso de Privacidad | Salux Vision",
    description: "Política de Privacidad y Tratamiento de Datos Personales de Salux Vision, en cumplimiento con las leyes de los Estados Unidos Mexicanos.",
};

export default function PrivacyPolicyPage() {
    return (
        <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-color)", position: "relative" }}>
            {/* Background elements */}
            <div className="bg-dot-grid"></div>
            <div className="bg-orb bg-orb-1"></div>
            <div className="bg-orb bg-orb-2"></div>

            <header className="navbar fade-in" style={{ position: 'relative', zIndex: 50 }}>
                <div className="container nav-content">
                    <Link href="/" className="logo" aria-label="Logotipo de Salux Vision">
                        <div className="logo-icon-wrapper" style={{ background: 'var(--primary-glow)', borderRadius: '12px' }} aria-hidden="true">
                            <Eye size={24} color="var(--primary)" strokeWidth={2.5} />
                        </div>
                        <span style={{ fontSize: '1.4rem' }}><span className="gradient-text">Salux</span> Vision</span>
                    </Link>

                    <nav aria-label="Navegación principal" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <ThemeToggle />

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
                    </nav>
                </div>
            </header>

            <main className="container" style={{ position: "relative", zIndex: 10, paddingTop: "2rem", paddingBottom: "4rem" }}>

                {/* Paper Container */}
                <div style={{
                    background: "var(--glass-surface)",
                    borderRadius: "24px",
                    padding: "4rem 3rem",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)",
                    border: "1px solid var(--glass-border)",
                    backdropFilter: "blur(20px)",
                    color: "var(--text-primary)"
                }}>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                        <div style={{ padding: "1rem", background: "var(--primary-glow)", color: "var(--primary)", borderRadius: "16px" }}>
                            <Shield size={32} />
                        </div>
                        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>Aviso de Privacidad</h1>
                    </div>

                    <div style={{ fontSize: "1rem", lineHeight: "1.8", color: "var(--text-secondary)" }}>
                        <p style={{ marginBottom: "1.5rem" }}>
                            <strong>Última actualización:</strong> 21 de Febrero de 2026.
                        </p>

                        <p style={{ marginBottom: "2rem" }}>
                            En cumplimiento con lo establecido por la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP)</strong>, su Reglamento y los Lineamientos del Aviso de Privacidad, <strong>Salux Vision</strong> (en adelante "El Responsable"), con domicilio en los Estados Unidos Mexicanos, hace de su conocimiento el presente Aviso de Privacidad aplicable a los usuarios de nuestra plataforma tecnológica y sitio web.
                        </p>

                        <h2 style={{ fontSize: "1.5rem", color: "var(--text-primary)", fontWeight: 700, marginTop: "2.5rem", marginBottom: "1rem" }}>1. Identidad y Domicilio del Responsable</h2>
                        <p style={{ marginBottom: "2rem" }}>
                            Salux Vision, constituida conforme a las leyes mexicanas, es la responsable del uso y protección de sus datos personales. Nuestro compromiso es garantizar la privacidad y seguridad de su información clínica y personal, integrando altos estándares tecnológicos.
                        </p>

                        <h2 style={{ fontSize: "1.5rem", color: "var(--text-primary)", fontWeight: 700, marginTop: "2.5rem", marginBottom: "1rem" }}>2. Datos Personales Recabados</h2>
                        <p style={{ marginBottom: "1rem" }}>
                            Para la prestación de los servicios ofrecidos en nuestra plataforma, así como para el inicio de sesión a través de plataformas de terceros (como Google OAuth), requerimos recopilar los siguientes datos personales:
                        </p>
                        <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem", marginBottom: "2rem" }}>
                            <li style={{ marginBottom: "0.5rem" }}>Nombre completo.</li>
                            <li style={{ marginBottom: "0.5rem" }}>Correo electrónico (Email).</li>
                            <li style={{ marginBottom: "0.5rem" }}>Fotografía de perfil (al iniciar sesión mediante integración con Google).</li>
                            <li style={{ marginBottom: "0.5rem" }}>Número telefónico de contacto (para envío de confirmaciones y SMS/WhatsApp).</li>
                            <li style={{ marginBottom: "0.5rem" }}>Datos métricos visuales recabados durante consultas (exámenes de la vista).</li>
                        </ul>

                        <h2 style={{ fontSize: "1.5rem", color: "var(--text-primary)", fontWeight: 700, marginTop: "2.5rem", marginBottom: "1rem" }}>3. Finalidades del Tratamiento de los Datos</h2>
                        <p style={{ marginBottom: "1rem" }}>Los datos personales que recabamos de usted, los utilizaremos de manera confidencial para las siguientes finalidades esenciales:</p>
                        <ul style={{ listStyleType: "decimal", paddingLeft: "1.5rem", marginBottom: "2rem" }}>
                            <li style={{ marginBottom: "0.5rem" }}>Creación, administración y mantenimiento de su expediente clínico digital dentro de la plataforma Salux Vision.</li>
                            <li style={{ marginBottom: "0.5rem" }}>Autenticación rápida e inicio de sesión seguro derivado de integraciones tecnológicas de Identidad (Google, WhatsApp).</li>
                            <li style={{ marginBottom: "0.5rem" }}>Envío de notificaciones relativas a programación, cancelación o confirmación de citas optométricas o seguimiento de producción de armazones.</li>
                            <li style={{ marginBottom: "0.5rem" }}>Soporte técnico, operativo y servicio de atención al paciente.</li>
                        </ul>

                        <h2 style={{ fontSize: "1.5rem", color: "var(--text-primary)", fontWeight: 700, marginTop: "2.5rem", marginBottom: "1rem" }}>4. Transferencia de Datos Personales</h2>
                        <p style={{ marginBottom: "2rem" }}>
                            Salux Vision se compromete a <strong>no transferir su información personal a terceros</strong> sin su consentimiento, salvo las excepciones previstas en el artículo 37 de la LFPDPPP, así como a realizar esta transferencia en los términos que fija esa ley. La información almacenada mediante servicios de infraestructura tecnológica como <em>GCP (Google Cloud Platform)</em> está sujeta a rigurosos estándares de seguridad y encriptación de datos de extremo a extremo.
                        </p>

                        <h2 style={{ fontSize: "1.5rem", color: "var(--text-primary)", fontWeight: 700, marginTop: "2.5rem", marginBottom: "1rem" }}>5. Ejercicio de los Derechos ARCO</h2>
                        <p style={{ marginBottom: "1rem" }}>
                            Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal si esta está desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición).
                        </p>
                        <p style={{ marginBottom: "2rem" }}>
                            Para el ejercicio de cualquiera de los derechos ARCO, usted o su representante legal (previa acreditación de identidad) deberá enviar una solicitud por escrito al departamento de Datos Personales y Privacidad a través de nuestro canal centralizado de atención electrónica: <strong>privacidad@saluxvision.com</strong>.
                        </p>

                        <h2 style={{ fontSize: "1.5rem", color: "var(--text-primary)", fontWeight: 700, marginTop: "2.5rem", marginBottom: "1rem" }}>6. Cambios al Aviso de Privacidad</h2>
                        <p style={{ marginBottom: "2rem" }}>
                            El presente aviso de privacidad puede sufrir modificaciones, cambios o actualizaciones derivadas de nuevos requerimientos legales, de nuestras propias necesidades por servicios de salud tecnológica que ofrecemos o cambios en nuestro modelo de negocio.
                            Nos comprometemos a mantenerlo informado sobre los cambios que pueda sufrir el presente aviso de privacidad a través de actualizaciones directas difundidas en esta misma plataforma web.
                        </p>

                        <div style={{ marginTop: "4rem", paddingTop: "2rem", borderTop: "1px solid var(--glass-border)", textAlign: "center", fontStyle: "italic", fontSize: "0.9rem" }}>
                            Al hacer uso pleno de este portal o integrarse mediante las API de Inicio de Sesión de Google o Meta (WhatsApp), usted acepta explícitamente haber leído, entendido y acordado los términos detallados en esta Política de Privacidad de conformidad con las leyes mexicanas vigentes.
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
