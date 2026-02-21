import { auth } from "@/lib/auth/authOptions";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { DollarSign, Tremor, Package, TrendingUp } from "lucide-react";

export default async function SalesPage() {
    const session = await auth();

    if (!session || session.user?.role !== "admin") {
        redirect("/app");
    }

    // Usaremos "appointments" con status = 'completed' como ventas concretadas.
    // También se podría incluir el costo de micas si tuvieran, por ahora es solo armazones.
    const res = await query(`
        SELECT 
            a.id, 
            a.appointment_date, 
            a.appointment_time, 
            u.name as patient_name,
            f.name as frame_name,
            f.category as category,
            f.price as sale_price,
            f.wholesale_price as cost_price
        FROM appointments a
        JOIN users u ON a.user_id = u.id
        JOIN frames f ON a.selected_frame_id = f.id
        WHERE a.status = 'completed'
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
    `);

    const salesList = res.rows.map((row: any) => ({
        ...row,
        sale_price: parseFloat(row.sale_price || 0),
        cost_price: parseFloat(row.cost_price || 0),
    }));

    const totalSales = salesList.reduce((acc, curr) => acc + curr.sale_price, 0);
    const totalCosts = salesList.reduce((acc, curr) => acc + curr.cost_price, 0);
    const totalMargin = totalSales - totalCosts;

    return (
        <div className="fade-in pb-12">
            <div style={{ marginBottom: "2.5rem" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                    Reporte de Ventas y Finanzas
                </h1>
                <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem", fontSize: "1.1rem" }}>
                    Resumen de citas completadas y cálculo de márgenes.
                </p>
            </div>

            {/* Tarjetas de Resumen KPI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                        <DollarSign size={20} /> <span style={{ fontWeight: 'bold' }}>Ingreso Bruto (Ventas)</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        ${totalSales.toFixed(2)}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>{salesList.length} ventas procesadas</p>
                </div>

                <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#ff4757', marginBottom: '0.5rem' }}>
                        <Package size={20} /> <span style={{ fontWeight: 'bold' }}>Costo de Proveedores</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                        ${totalCosts.toFixed(2)}
                    </div>
                </div>

                <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#2ed573', marginBottom: '0.5rem' }}>
                        <TrendingUp size={20} /> <span style={{ fontWeight: 'bold' }}>Margen de Ganancia Libre</span>
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2ed573' }}>
                        ${totalMargin.toFixed(2)}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                        {totalSales > 0 ? ((totalMargin / totalSales) * 100).toFixed(1) : 0}% de rentabilidad
                    </p>
                </div>
            </div>

            {/* Tabla de Ventas Individuales */}
            <div style={{ background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Desglose de Ventas (Citas Completadas)</span>
                </div>
                {salesList.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                        <table className="appointments-table" style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                            <thead style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                <tr>
                                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>Fecha de Venta</th>
                                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>Paciente</th>
                                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>Producto / Modelo</th>
                                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>P. Venta</th>
                                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>Costo Prov.</th>
                                    <th style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>Margen</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesList.map((sale: any) => (
                                    <tr key={sale.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{new Date(sale.appointment_date).toLocaleDateString('es-ES')}</div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{sale.appointment_time}</div>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{sale.patient_name}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{sale.frame_name}</div>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>{sale.category}</div>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>${sale.sale_price.toFixed(2)}</td>
                                        <td style={{ padding: '1rem', color: '#ff4757', fontWeight: '500' }}>${sale.cost_price.toFixed(2)}</td>
                                        <td style={{ padding: '1rem', color: '#2ed573', fontWeight: 'bold' }}>${(sale.sale_price - sale.cost_price).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <p>No hay ventas registradas (citas marcadas como Completadas con producto seleccionado).</p>
                    </div>
                )}
            </div>
        </div>
    );
}
