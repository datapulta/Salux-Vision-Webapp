"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Eye, Home, Calendar, Settings, Users, Activity, FileText, Package } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import ThemeToggle from "@/components/ThemeToggle";
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
        { name: "Mis Citas", href: "/app/appointments", icon: Calendar },
        { name: "Resultados", href: "/app/results", icon: FileText },
        { name: "Ajustes", href: "/app/settings", icon: Settings },
    ];

    const adminLinks = [
        { name: "Directorio Clínico", href: "/admin", icon: Users },
        { name: "Panel General", href: "/admin/dashboard", icon: Activity },
        { name: "Agenda Global", href: "/admin/appointments", icon: Calendar },
        { name: "Catálogo / Inventario", href: "/admin/inventory", icon: Package },
        { name: "Ventas y Finanzas", href: "/admin/sales", icon: FileText },
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

            {/* Barra Lateral (Sidebar) - Mejora en Mobile */}
            <aside className={`dashboard-sidebar ${sidebarOpen ? 'mobile-show' : ''}`}>
                <div className="sidebar-header">
                    <Link href="/" className="logo">
                        <div className="logo-icon-wrapper" style={{ width: "32px", height: "32px", background: 'var(--primary-glow)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Eye size={20} color="var(--primary)" strokeWidth={2.5} />
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                            <span className="gradient-text">Salux</span> Vision
                        </span>
                    </Link>
                    <button className="menu-toggle lg-hidden" onClick={toggleSidebar}>
                        <X size={20} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isRootLink = link.href === '/admin' || link.href === '/app';
                        const isActive = isRootLink
                            ? pathname === link.href
                            : (pathname === link.href || pathname.startsWith(link.href + '/'));
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
                        <button className="menu-toggle lg-hidden" onClick={toggleSidebar} aria-label="Toggle Menu" style={{ padding: '8px', background: 'var(--glass-surface)', borderRadius: '10px' }}>
                            <Menu size={20} />
                        </button>
                        <h2 className="topbar-title" style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                            {links.find(link => {
                                const isRootLink = link.href === '/admin' || link.href === '/app';
                                return isRootLink ? pathname === link.href : (pathname === link.href || pathname.startsWith(link.href + '/'));
                            })?.name || "Panel"}
                        </h2>
                    </div>

                    <div className="topbar-right">
                        <ThemeToggle />
                        <div className="user-profile">
                            <div className="user-info">
                                <p className="user-name">{userName}</p>
                                <p className="user-role">{userRole === 'admin' ? 'Especialista' : 'Paciente'}</p>
                            </div>
                            <div className="user-avatar" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', border: 'none', boxShadow: '0 4px 10px var(--primary-glow)' }}>
                                {initials}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Vista Renderizada Inyectada */}
                <div className="dashboard-content fade-in">
                    {children}
                </div>

                {/* Mobile Navigation Bar - El "Surprise" para el usuario */}
                <nav className="mobile-nav-bar">
                    {links.slice(0, 4).map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`mobile-nav-item ${isActive ? "active" : ""}`}
                            >
                                <div className="icon-box">
                                    <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span>{link.name.split(' ')[0]}</span> {/* Solo la primera palabra para que quepa bien */}
                            </Link>
                        );
                    })}
                </nav>

            </main>
        </div>
    );
}
