"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Eye, Home, Calendar, Settings, Users, Activity, FileText } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

interface DashboardLayoutProps {
    children: React.ReactNode;
    userRole: "admin" | "user";
    userName: string;
}

export default function DashboardLayout({ children, userRole, userName }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const patientLinks = [
        { name: "Mi Ficha de Salud", href: "/app", icon: Home },
        { name: "Triaje y Citas", href: "/app/appointments", icon: Calendar },
        { name: "Resultados", href: "/app/results", icon: FileText },
        { name: "Ajustes", href: "/app/settings", icon: Settings },
    ];

    const adminLinks = [
        { name: "Directorio Clínico", href: "/admin", icon: Users },
        { name: "Panel General", href: "/admin/dashboard", icon: Activity },
        { name: "Agenda Global", href: "/admin/appointments", icon: Calendar },
        { name: "Ajustes", href: "/admin/settings", icon: Settings },
    ];

    const links = userRole === "admin" ? adminLinks : patientLinks;
    const initials = userName ? userName.substring(0, 2).toUpperCase() : "U";

    return (
        <div className="dashboard-container">
            {/* Cierre de menú al tocar fondo oscuro en Móviles */}
            {sidebarOpen && (
                <div
                    className="dashboard-overlay"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Barra Lateral (Sidebar) */}
            <aside className={`dashboard-sidebar ${sidebarOpen ? 'mobile-show' : 'mobile-hidden'}`}>
                <div className="sidebar-header">
                    <Link href="/" className="logo" style={{ fontSize: "1.25rem" }}>
                        <div className="logo-icon-wrapper" style={{ width: "32px", height: "32px" }}>
                            <Eye size={20} color="var(--secondary)" strokeWidth={2.5} />
                        </div>
                        <span><span className="highlight">Salux</span></span>
                    </Link>
                    <button className="menu-toggle lg-hidden" onClick={toggleSidebar}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    <div className="nav-section-title">MENÚ PRINCIPAL</div>
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`nav-item ${isActive ? "active" : ""}`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <Icon size={20} />
                                <span>{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="sidebar-footer">
                    <LogoutButton />
                </div>
            </aside>

            {/* Zona Central de Contenido */}
            <main className="dashboard-main">

                {/* Barra Superior */}
                <header className="dashboard-topbar">
                    <div className="topbar-left">
                        <button className="menu-toggle lg-hidden" onClick={toggleSidebar} aria-label="Toggle Menu">
                            <Menu size={24} />
                        </button>
                        <h2 className="topbar-title">
                            {links.find(l => pathname === l.href || pathname.startsWith(l.href + '/'))?.name || "Panel"}
                        </h2>
                    </div>

                    <div className="topbar-right">
                        <div className="user-profile">
                            <div className="user-info">
                                <p className="user-name">{userName}</p>
                                <p className="user-role">{userRole === 'admin' ? 'Especialista' : 'Paciente'}</p>
                            </div>
                            <div className="user-avatar">
                                {initials}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Vista Renderizada Inyectada */}
                <div className="dashboard-content fade-in">
                    {children}
                </div>

            </main>
        </div>
    );
}
