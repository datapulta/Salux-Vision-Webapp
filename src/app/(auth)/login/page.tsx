// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, Lock, Mail, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Credenciales inválidas. Por favor intenta de nuevo.");
            setLoading(false);
        } else if (res?.ok) {
            router.push("/app");
            router.refresh();
        }
    };

    return (
        <div className="auth-container">
            <Link
                href="/"
                className="auth-back-btn fade-in"
            >
                <div className="auth-back-icon">
                    <ArrowLeft size={16} />
                </div>
                <span>Volver al Inicio</span>
            </Link>

            <div className="auth-card fade-in">
                <div className="auth-header">
                    <div className="auth-icon-wrapper">
                        <Eye size={32} />
                    </div>
                    <h1 className="auth-title">Bienvenido de Vuelta</h1>
                    <p className="auth-subtitle">
                        Inicia sesión en tu cuenta de Salux Vision
                    </p>
                </div>

                {/* Integración Google Auth */}
                <div className="fade-in delay-1" style={{ marginBottom: "1.5rem" }}>
                    <button
                        onClick={() => {
                            setLoading(true);
                            signIn("google", { callbackUrl: "/app" });
                        }}
                        disabled={loading}
                        className="btn btn-secondary btn-full"
                        style={{ display: "flex", gap: "0.75rem", justifyContent: "center", alignItems: "center", backgroundColor: "#fff", color: "#333", border: "1px solid #ddd", marginBottom: "1.5rem" }}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        <span style={{ fontWeight: 600 }}>Continuar con Google</span>
                    </button>

                    <div style={{ display: "flex", alignItems: "center", margin: "1.5rem 0", color: "var(--text-muted)" }}>
                        <div style={{ flex: 1, height: "1px", background: "var(--glass-border)" }} />
                        <span style={{ padding: "0 1rem", fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>O ingresa con Email</span>
                        <div style={{ flex: 1, height: "1px", background: "var(--glass-border)" }} />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="auth-form fade-in delay-2">
                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">
                            Correo Electrónico
                        </label>
                        <div className="input-wrapper">
                            <Mail className="input-icon" size={18} />
                            <input
                                type="email"
                                name="email"
                                required
                                disabled={loading}
                                className="form-input"
                                placeholder="doctor@clinica.com"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Contraseña
                        </label>
                        <div className="input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
                                type="password"
                                name="password"
                                required
                                disabled={loading}
                                className="form-input"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary btn-full"
                    >
                        {loading ? "Verificando..." : "Iniciar Sesión"}
                    </button>
                </form>

                <div className="auth-footer fade-in delay-2">
                    <p>
                        ¿No tienes una cuenta?{" "}
                        <Link href="/register" className="auth-link">
                            Solicitar acceso
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
