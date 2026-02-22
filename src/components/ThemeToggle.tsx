"use client";

import { useTheme } from "@/components/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'var(--glass-surface)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.background = 'var(--surface-hover)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.background = 'var(--glass-surface)';
            }}
        >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}
