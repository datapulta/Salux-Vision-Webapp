"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                background: "var(--accent-red)",
                opacity: "0.8",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "opacity 0.3s"
            }}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "1")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "0.8")}
        >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
        </button>
    );
}
