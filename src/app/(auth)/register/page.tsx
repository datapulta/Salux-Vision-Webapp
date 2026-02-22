// src/app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, User, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
            const { message } = await res.json();
            setError(message || "Error al crear la cuenta");
        } else {
            setSuccess(true);
            setTimeout(() => router.push("/login"), 2000);
        }

        setLoading(false);
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
                        <User size={32} />
                    </div>
                    <h1 className="auth-title">Crear Cuenta</h1>
                    <p className="auth-subtitle">
                        Únete a la plataforma tecnológica de Salux Vision
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form fade-in delay-1">
                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="auth-success">
                            Cuenta creada con éxito. Redirigiendo al login...
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">
                            Nombre Completo
                        </label>
                        <div className="input-wrapper">
                            <User className="input-icon" size={18} />
                            <input
                                type="text"
                                name="name"
                                required
                                disabled={loading || success}
                                className="form-input"
                                placeholder="Dr. Juan Pérez"
                            />
                        </div>
                    </div>

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
                                disabled={loading || success}
                                className="form-input"
                                placeholder="juan@clinica.com"
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
                                disabled={loading || success}
                                className="form-input"
                                placeholder="Min. 8 caracteres"
                                minLength={8}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className="btn btn-primary btn-full"
                    >
                        {loading ? "Creando..." : "Registrarse"}
                    </button>
                </form>

                <div className="auth-footer fade-in delay-2">
                    <p>
                        ¿Ya tienes acceso?{" "}
                        <Link href="/login" className="auth-link">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}
