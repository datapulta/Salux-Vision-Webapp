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

        // Aquí usamos signIn de next-auth pasándole las credenciales a nuestro authOptions.ts
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false, // Manejamos la redirección manualmente
        });

        if (res?.error) {
            setError("Credenciales inválidas. Por favor intenta de nuevo.");
            setLoading(false);
        } else if (res?.ok) {
            // Redirección manejada inteligentemente según su JWT / Rol a futuro por middleware
            router.push("/app");
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-color)]">
            <div className="max-w-md w-full feature-card p-8">

                {/* Cabecera de Marca Simple */}
                <div className="flex flex-col items-center mb-8 fade-in">
                    <div className="w-16 h-16 rounded-full bg-[rgba(209,163,224,0.1)] border border-[rgba(209,163,224,0.2)] flex items-center justify-center mb-4 text-[var(--primary-light)]">
                        <Eye size={32} />
                    </div>
                    <h1 className="text-2xl font-bold font-[var(--font-heading)] mb-2">Bienvenido de Vuelta</h1>
                    <p className="text-[var(--text-secondary)] text-sm text-center">
                        Inicia sesión en tu cuenta de Salux Vision
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-6 fade-in delay-1">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

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
                                disabled={loading}
                                className="w-full pl-10 pr-4 py-3 bg-[rgba(0,0,0,0.2)] border border-[var(--glass-border)] rounded-xl text-white outline-none focus:border-[var(--primary)] transition-all"
                                placeholder="doctor@clinica.com"
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
                                disabled={loading}
                                className="w-full pl-10 pr-4 py-3 bg-[rgba(0,0,0,0.2)] border border-[var(--glass-border)] rounded-xl text-white outline-none focus:border-[var(--primary)] transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn btn-primary py-3 rounded-xl disabled:opacity-50 mt-4"
                    >
                        {loading ? "Verificando..." : "Iniciar Sesión"}
                    </button>
                </form>

                <p className="mt-8 text-center text-[var(--text-secondary)] text-sm fade-in delay-2">
                    ¿No tienes una cuenta?{" "}
                    <Link href="/register" className="text-[var(--primary-light)] hover:underline">
                        Solicitar acceso
                    </Link>
                </p>

            </div>
        </div>
    );
}
