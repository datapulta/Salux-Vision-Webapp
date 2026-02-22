"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton({ isMobileOptimized = false }: { isMobileOptimized?: boolean }) {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={`logout-btn ${isMobileOptimized ? 'mobile-optimized' : ''}`}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: isMobileOptimized ? "0.6rem" : "0.5rem 1rem",
                background: "var(--accent-red)",
                opacity: "0.8",
                color: "#ffffff",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
            }}
            onMouseOver={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1.05)"; }}
            onMouseOut={(e) => { e.currentTarget.style.opacity = "0.8"; e.currentTarget.style.transform = "scale(1)"; }}
            title="Cerrar Sesión"
        >
            <LogOut size={18} />
            <span className={isMobileOptimized ? "hide-on-mobile" : ""}>Cerrar Sesión</span>
        </button>
    );
}
