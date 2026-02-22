import { auth } from "@/lib/auth/authOptions";
import { query } from "@/lib/db";
import { Users } from "lucide-react";
import { redirect } from 'next/navigation';
import ClientDirectoryTable from "./ClientDirectoryTable";

export const dynamic = "force-dynamic";

export default async function AdminDirectoryPage() {
    const session = await auth();
    if (!session || session.user?.role !== 'admin') {
        redirect('/app');
    }

    try {
        const res = await query(`
            SELECT id, name, email, phone, is_active, role, provider, created_at
            FROM users 
            WHERE role = 'user'
            ORDER BY created_at DESC
        `);

        // Convert Dates to ISO strings to avoid hydration errors traversing Server/Client Component boundary
        const patients = res.rows.map(row => ({
            ...row,
            created_at: row.created_at.toISOString(),
            is_active: Boolean(row.is_active)
        }));

        return (
            <div className="fade-in pb-12">
                <div style={{ marginBottom: "2.5rem", display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 className="gradient-text" style={{ fontSize: "2.25rem", fontWeight: "800", marginBottom: '0.5rem' }}>
                            Directorio Clínico
                        </h1>
                        <p style={{ color: "var(--text-secondary)", fontSize: "1.05rem", fontWeight: '500' }}>
                            Gestión centralizada de expedientes y cuentas de pacientes.
                        </p>
                    </div>
                    <div className="dash-card" style={{ padding: '0.75rem 1.5rem', background: 'var(--primary-glow)', border: '1px solid var(--primary)' }}>
                        <Users size={24} color="var(--primary)" />
                        <div className="card-info">
                            <div className="card-value" style={{ fontSize: '1.25rem' }}>{patients.length} Registrados</div>
                        </div>
                    </div>
                </div>

                <ClientDirectoryTable initialPatients={patients} />
            </div>
        );
    } catch (error) {
        console.error("Directory error:", error);
        return <div style={{ color: 'var(--text-primary)' }}>Error al conectar con la base de datos de pacientes.</div>;
    }
}
