// src/app/(auth)/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, Lock, Mail, User } from "lucide-react";

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

        // Llamamos a nuestra API de postgres interna
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
            setTimeout(() => router.push("/login"), 2000); // Dar tiempito para leer el mensaje de exito
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-color)]">
            <div className="max-w-md w-full feature-card p-8">

                {/* Cabecera */}
                <div className="flex flex-col items-center mb-8 fade-in">
                    <div className="w-16 h-16 rounded-full bg-[rgba(209,163,224,0.1)] border border-[rgba(209,163,224,0.2)] flex items-center justify-center mb-4 text-[var(--primary-light)]">
                        <User size={32} />
                    </div>
                    <h1 className="text-2xl font-bold font-[var(--font-heading)] mb-2">Crear Cuenta</h1>
                    <p className="text-[var(--text-secondary)] text-sm text-center">
                        Únete a la plataforma tecnológica de Salux Vision
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-6 fade-in delay-1">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm text-center">
                            Cuenta creada con éxito. Redirigiendo al login...
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                            Nombre Completo
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                            <input
                                type="text"
                                name="name"
                                required
                                disabled={loading || success}
                                className="w-full pl-10 pr-4 py-3 bg-[rgba(0,0,0,0.2)] border border-[var(--glass-border)] rounded-xl text-white outline-none focus:border-[var(--primary)] transition-all"
                                placeholder="Dr. Juan Pérez"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                            Correo Electrónico
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                            <input
                                type="email"
                                name="email"
                                required
                                disabled={loading || success}
                                className="w-full pl-10 pr-4 py-3 bg-[rgba(0,0,0,0.2)] border border-[var(--glass-border)] rounded-xl text-white outline-none focus:border-[var(--primary)] transition-all"
                                placeholder="juan@clinica.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                            <input
                                type="password"
                                name="password"
                                required
                                disabled={loading || success}
                                className="w-full pl-10 pr-4 py-3 bg-[rgba(0,0,0,0.2)] border border-[var(--glass-border)] rounded-xl text-white outline-none focus:border-[var(--primary)] transition-all"
                                placeholder="Min. 8 caracteres"
                                minLength={8}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || success}
                        className="w-full btn btn-primary py-3 rounded-xl disabled:opacity-50 mt-4"
                    >
                        {loading ? "Creando..." : "Registrarse"}
                    </button>
                </form>

                <p className="mt-8 text-center text-[var(--text-secondary)] text-sm fade-in delay-2">
                    ¿Ya tienes acceso?{" "}
                    <Link href="/login" className="text-[var(--primary-light)] hover:underline">
                        Inicia sesión aquí
                    </Link>
                </p>

            </div>
        </div>
    );
}
