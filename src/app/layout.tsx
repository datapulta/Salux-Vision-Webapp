import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  colorScheme: "light",
};

export const metadata: Metadata = {
  title: "Salux Vision | Salud y Visión Redefinida",
  description: "Salux Vision es una plataforma emergente de health-tech dedicada a revolucionar el cuidado de la visión con un objetivo social. Democratizamos el acceso a la salud visual.",
  keywords: ["health-tech", "salud visual", "cuidado de la visión", "tecnología médica", "impacto social", "oftalmología digital", "Salux Vision", "clínica oftalmológica online"],
  authors: [{ name: "Salux Vision" }],
  creator: "Salux Vision",
  publisher: "Salux Vision",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Salux Vision | Salud y Visión Redefinida",
    description: "Plataforma emergente de health-tech dedicada a revolucionar el cuidado de la visión con un objetivo social. Democratizamos el acceso a la salud visual.",
    url: "https://saluxvision.com",
    siteName: "Salux Vision",
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salux Vision | Salud y Visión Redefinida",
    description: "Plataforma emergente de health-tech para el cuidado de la visión con un objetivo social profundo.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://saluxvision.com",
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" dir="ltr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const storedTheme = localStorage.getItem('salux_theme');
                if (storedTheme === 'dark') {
                  document.documentElement.classList.remove('light-mode');
                } else if (storedTheme === 'light') {
                  document.documentElement.classList.add('light-mode');
                } else {
                  // Default to light if no theme is strictly set based on user's new request
                  document.documentElement.classList.add('light-mode');
                  localStorage.setItem('salux_theme', 'light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
