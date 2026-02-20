// src/app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, Lock, Mail } from "lucide-react";

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

                <form onSubmit={handleSubmit} className="auth-form fade-in delay-1">
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
