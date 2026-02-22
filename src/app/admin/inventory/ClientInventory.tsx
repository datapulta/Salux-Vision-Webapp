'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Search, Plus, Edit, Trash2, Image as ImageIcon, Save, X, AlertTriangle, PackageOpen, Boxes, FileDown, HelpCircle, ChevronDown, ChevronUp, FileText, Sparkles } from 'lucide-react';
import { updateFrame, deleteFrame, createFrame } from './actions';

export interface FrameData {
    id: string;
    name: string;
    brand: string;
    price: number;
    wholesale_price?: number;
    stock: number;
    min_stock?: number;
    image_url: string;
    category?: string;
    sku?: string;
    description?: string;
    discount?: number;
    requires_stock?: boolean;
    sat_product_key?: string;
    sat_unit_key?: string;
}

export default function AdminInventoryClient({ initialFrames }: { initialFrames: FrameData[] }) {
    const [frames, setFrames] = useState<FrameData[]>(initialFrames);
    const [search, setSearch] = useState('');
    const [editingFrame, setEditingFrame] = useState<FrameData | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    // Facturacion toggle
    const [showFacturacion, setShowFacturacion] = useState(false);

    const filteredFrames = frames.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        f.brand.toLowerCase().includes(search.toLowerCase()) ||
        (f.sku && f.sku.toLowerCase().includes(search.toLowerCase()))
    );

    const handleSaveEdit = async () => {
        if (!editingFrame) return;

        try {
            if (isCreating) {
                const res = await createFrame({
                    name: editingFrame.name || 'Nuevo Producto',
                    brand: editingFrame.brand || 'Desconocido',
                    price: Number(editingFrame.price || 0),
                    wholesale_price: Number(editingFrame.wholesale_price || 0),
                    stock: Number(editingFrame.stock || 0),
                    min_stock: Number(editingFrame.min_stock || 3),
                    image_url: editingFrame.image_url || '',
                    category: editingFrame.category || 'armazon',
                    sku: editingFrame.sku || '',
                    description: editingFrame.description || '',
                    discount: Number(editingFrame.discount || 0),
                    requires_stock: editingFrame.requires_stock !== undefined ? editingFrame.requires_stock : true,
                    sat_product_key: editingFrame.sat_product_key || '',
                    sat_unit_key: editingFrame.sat_unit_key || ''
                });
                if (res.success && res.id) {
                    setFrames([{ ...editingFrame, id: res.id }, ...frames]);
                }
            } else {
                setFrames(prev => prev.map(f => f.id === editingFrame.id ? editingFrame : f));
                await updateFrame(editingFrame.id, {
                    name: editingFrame.name,
                    brand: editingFrame.brand,
                    price: Number(editingFrame.price),
                    wholesale_price: Number(editingFrame.wholesale_price || 0),
                    stock: Number(editingFrame.stock),
                    min_stock: Number(editingFrame.min_stock || 3),
                    image_url: editingFrame.image_url,
                    category: editingFrame.category || 'armazon',
                    sku: editingFrame.sku || '',
                    description: editingFrame.description || '',
                    discount: Number(editingFrame.discount || 0),
                    requires_stock: editingFrame.requires_stock !== undefined ? editingFrame.requires_stock : true,
                    sat_product_key: editingFrame.sat_product_key || '',
                    sat_unit_key: editingFrame.sat_unit_key || ''
                });
            }
        } catch (e) {
            console.error(e);
            alert("Hubo un error al guardar en la Base de Datos.");
        }

        setEditingFrame(null);
        setIsCreating(false);
        setShowFacturacion(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Seguro que deseas eliminar este producto del inventario?")) return;
        setFrames(prev => prev.filter(f => f.id !== id));
        try {
            await deleteFrame(id);
        } catch (e) {
            console.error(e);
            alert("Hubo un error al eliminar.");
        }
    };

    const handleCreateNew = () => {
        setIsCreating(true);
        setShowFacturacion(false);
        setEditingFrame({
            id: 'temp',
            name: '',
            brand: 'Genérica',
            price: 0,
            wholesale_price: 0,
            stock: 0,
            min_stock: 3,
            image_url: '',
            category: 'armazon',
            sku: '',
            description: '',
            discount: 0,
            requires_stock: true,
            sat_product_key: '',
            sat_unit_key: ''
        });
    };

    const getCategoryLabel = (cat?: string) => {
        if (cat === 'accesorio') return 'Accesorio';
        if (cat === 'consumible') return 'Consumible';
        return 'Armazón';
    };

    const setSatQuickOption = (productKey: string) => {
        if (editingFrame) {
            setEditingFrame({ ...editingFrame, sat_product_key: productKey });
        }
    };

    // Cálculos para KPIs
    const totalArticulos = frames.length;
    const enAlerta = frames.filter(f => f.stock > 0 && f.stock <= (f.min_stock || 3)).length;
    const sinStock = frames.filter(f => f.stock === 0).length;
    const totalUnidades = frames.reduce((acc, f) => acc + f.stock, 0);

    return (
        <div className="fade-in pb-12" style={{ position: 'relative' }}>

            {/* Cabecera Tipo POS / ERP */}
            <div style={{ marginBottom: "2.5rem", display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                    <h1 className="gradient-text" style={{ fontSize: "2.25rem", fontWeight: "800", marginBottom: '0.5rem' }}>
                        Control de Inventario
                    </h1>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", fontWeight: '500' }}>
                        Gestión de existencias y alertas críticas de stock.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => alert("Reporte PDF Próximamente")}
                        className="btn btn-secondary"
                        style={{ border: '1px solid var(--accent-red)', color: 'var(--accent-red)' }}>
                        <FileDown size={18} /> Exportar Reporte
                    </button>
                    <button onClick={handleCreateNew} className="btn btn-primary" style={{ padding: '0.8rem 1.5rem' }}>
                        <Plus size={18} /> Nuevo Artículo
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="dash-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
                <div className="dash-card" style={{ borderLeft: '4px solid var(--accent-blue)' }}>
                    <div className="card-icon bg-blue-light">
                        <Boxes size={28} />
                    </div>
                    <div className="card-info">
                        <h3>Variedad de Artículos</h3>
                        <div className="card-value">{totalArticulos}</div>
                    </div>
                </div>

                <div className="dash-card" style={{ borderLeft: '4px solid var(--accent-red)' }}>
                    <div className="card-icon bg-pink-light">
                        <AlertTriangle size={28} />
                    </div>
                    <div className="card-info">
                        <h3>Bajo Stock</h3>
                        <div className="card-value" style={{ color: 'var(--accent-red)' }}>{enAlerta}</div>
                    </div>
                </div>

                <div className="dash-card" style={{ borderLeft: '4px solid #f97316' }}>
                    <div className="card-icon" style={{ background: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>
                        <PackageOpen size={28} />
                    </div>
                    <div className="card-info">
                        <h3>Agotados</h3>
                        <div className="card-value" style={{ color: '#f97316' }}>{sinStock}</div>
                    </div>
                </div>

                <div className="dash-card" style={{ borderLeft: '4px solid var(--accent-green)' }}>
                    <div className="card-icon" style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' }}>
                        <Boxes size={28} />
                    </div>
                    <div className="card-info">
                        <h3>Stock Total</h3>
                        <div className="card-value" style={{ color: '#22c55e' }}>{totalUnidades}</div>
                    </div>
                </div>
            </div>

            {/* Panel de Búsqueda */}
            <div style={{
                marginBottom: '1.5rem',
                background: 'var(--bg-secondary)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--glass-border)',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
            }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, marca o SKU..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '2.5rem' }}
                    />
                </div>
            </div>

            {/* Tabla de Artículos */}
            <div className="table-container fade-in">
                <div style={{ overflowX: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>ARTÍCULO</th>
                                <th style={{ textAlign: 'center' }}>STOCK ACTUAL</th>
                                <th style={{ textAlign: 'center' }}>MÍNIMO</th>
                                <th style={{ textAlign: 'center' }}>ESTADO</th>
                                <th style={{ textAlign: 'right' }}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFrames.map((frame) => {
                                const min = frame.min_stock || 3;
                                let estado = "Suficiente";
                                let colorEstado = "#2ed573";
                                let bgEstado = "rgba(46, 213, 115, 0.1)";

                                if (frame.stock === 0) {
                                    estado = "Agotado";
                                    colorEstado = "#f97316";
                                    bgEstado = "rgba(249, 115, 22, 0.1)";
                                } else if (frame.stock <= min) {
                                    estado = "Alerta Baja";
                                    colorEstado = "var(--accent-red)";
                                    bgEstado = "rgba(220, 38, 38, 0.1)";
                                }

                                return (
                                    <tr key={frame.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '50px', height: '50px', background: 'rgba(128,128,128,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                                    {frame.image_url ? (
                                                        <img src={frame.image_url} alt={frame.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <ImageIcon size={20} color="var(--text-secondary)" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '1.05rem' }}>{frame.name}</div>
                                                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{frame.sku ? `${frame.sku} • ` : ''}{frame.brand} • {getCategoryLabel(frame.category)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '500', textAlign: 'center' }}>
                                            {frame.stock}
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontSize: '1.1rem', textAlign: 'center' }}>
                                            {min}
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                                            <span style={{ color: colorEstado, background: bgEstado, padding: '0.3rem 0.6rem', borderRadius: '16px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                                {estado}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                <button onClick={() => { setEditingFrame(frame); setIsCreating(false); }} className="btn btn-secondary" style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--primary)' }}>
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(frame.id)} className="btn btn-secondary" style={{ padding: '0.5rem', background: 'transparent', border: 'none', color: '#ff4757' }}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>

                    {filteredFrames.length === 0 && (
                        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Boxes size={64} style={{ marginBottom: '1rem', opacity: 0.5 }} color="var(--text-secondary)" />
                            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '0.5rem' }}>No hay artículos con control de stock</h3>
                            <p>Los artículos con control de stock habilitado aparecerán aquí.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Edición/Creación de Producto Premium via Portal */}
            {mounted && typeof document !== 'undefined' && editingFrame && createPortal(
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 999999 }}>
                    <div className="fade-in" style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-xl)',
                        border: '1px solid var(--glass-border)',
                        width: '100%',
                        maxWidth: '820px',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 'var(--shadow-lg)',
                        overflow: 'hidden'
                    }}>
                        {/* Cabecera del Modal */}
                        <div style={{ padding: '1.25rem 2rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--glass-surface)', flexShrink: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ background: 'var(--primary-glow)', padding: '0.5rem', borderRadius: '10px', color: 'var(--primary)' }}>
                                    <PackageOpen size={22} />
                                </div>
                                <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>
                                    {isCreating ? 'Nuevo Artículo' : 'Modificar Artículo'}
                                </h2>
                            </div>
                            <button onClick={() => setEditingFrame(null)} style={{ background: 'var(--surface)', border: '1px solid var(--glass-border)', borderRadius: '50%', color: 'var(--text-secondary)', cursor: 'pointer', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--primary)'; }} onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}>
                                <X size={18} />
                            </button>
                        </div>

                        {/* Cuerpo del Modal */}
                        <div className="modal-body-scroll" style={{ padding: '1.5rem 2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>

                            {/* Fila 1: Nombre y SKU */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                <div>
                                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        Nombre <span style={{ color: 'var(--accent-red)' }}>*</span>
                                    </label>
                                    <input
                                        className="input-field"
                                        value={editingFrame.name}
                                        onChange={(e) => setEditingFrame({ ...editingFrame, name: e.target.value })}
                                        placeholder="Ej. Armazón RayBan Clásico"
                                        maxLength={230}
                                    />
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', textAlign: 'right' }}>
                                        {editingFrame.name.length}/230
                                    </div>
                                </div>
                                <div>
                                    <label className="form-label">
                                        Código SKU <span style={{ color: 'var(--text-muted)' }}>(Opcional)</span>
                                    </label>
                                    <input
                                        className="input-field"
                                        value={editingFrame.sku || ''}
                                        onChange={(e) => setEditingFrame({ ...editingFrame, sku: e.target.value })}
                                        placeholder="Ej. RB-3025"
                                        maxLength={100}
                                    />
                                </div>
                            </div>

                            {/* Fila 2: Marca y Categoría */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                <div>
                                    <label className="form-label">Marca</label>
                                    <input
                                        className="input-field"
                                        value={editingFrame.brand}
                                        onChange={(e) => setEditingFrame({ ...editingFrame, brand: e.target.value })}
                                        placeholder="Ej. RayBan, Genérica..."
                                        maxLength={100}
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Categoría</label>
                                    <select
                                        className="input-field"
                                        style={{ height: '48px', cursor: 'pointer', appearance: 'auto' }}
                                        value={editingFrame.category || 'armazon'}
                                        onChange={(e) => setEditingFrame({ ...editingFrame, category: e.target.value })}
                                    >
                                        <option value="armazon">Armazón</option>
                                        <option value="accesorio">Accesorio (Estuches, Limpieza)</option>
                                        <option value="consumible">Consumible (Lentes de contacto)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div>
                                <label className="form-label">Descripción</label>
                                <textarea
                                    className="input-field"
                                    value={editingFrame.description || ''}
                                    onChange={(e) => setEditingFrame({ ...editingFrame, description: e.target.value })}
                                    style={{ minHeight: '80px', resize: 'vertical', lineHeight: '1.5' }}
                                    placeholder="Agrega notas, dimensiones o características específicas..."
                                />
                            </div>

                            {/* Sección de Precios */}
                            <div>
                                <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', margin: '0 0 1rem 0', paddingBottom: '0.4rem', borderBottom: '1px solid var(--glass-border)' }}>Fijación de Precios</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', background: 'var(--glass-surface)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                                    <div>
                                        <label className="form-label">
                                            Venta Público <span style={{ color: 'var(--accent-red)' }}>*</span>
                                        </label>
                                        <div className="input-wrapper">
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-primary)', fontWeight: 'bold' }}>$</span>
                                            <input
                                                type="number"
                                                className="form-input input-field"
                                                value={editingFrame.price || ''}
                                                onChange={(e) => setEditingFrame({ ...editingFrame, price: parseFloat(e.target.value) || 0 })}
                                                style={{ paddingLeft: '2.25rem' }}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label" style={{ textTransform: 'none', letterSpacing: 'normal' }}>
                                            Costo Adquisición <span style={{ color: 'var(--text-muted)' }}>(Interno)</span>
                                        </label>
                                        <div className="input-wrapper">
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontWeight: 'bold' }}>$</span>
                                            <input
                                                type="number"
                                                className="form-input input-field"
                                                value={editingFrame.wholesale_price || ''}
                                                onChange={(e) => setEditingFrame({ ...editingFrame, wholesale_price: parseFloat(e.target.value) || 0 })}
                                                style={{ paddingLeft: '2.25rem' }}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="form-label" style={{ textTransform: 'none', letterSpacing: 'normal' }}>Descuento Fijo</label>
                                        <div className="input-wrapper">
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-purple)', fontWeight: 'bold' }}>-$</span>
                                            <input
                                                type="number"
                                                className="form-input input-field"
                                                value={editingFrame.discount || ''}
                                                onChange={(e) => setEditingFrame({ ...editingFrame, discount: parseFloat(e.target.value) || 0 })}
                                                style={{ paddingLeft: '2.8rem' }}
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Control de Stock */}
                            <div style={{ border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                                <div style={{ background: 'var(--glass-surface)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.8rem', borderBottom: editingFrame.requires_stock !== false ? '1px solid var(--glass-border)' : 'none' }}>
                                    <input
                                        type="checkbox"
                                        checked={editingFrame.requires_stock !== false}
                                        onChange={(e) => setEditingFrame({ ...editingFrame, requires_stock: e.target.checked })}
                                        style={{ width: '18px', height: '18px', accentColor: 'var(--primary)', cursor: 'pointer' }}
                                        id="requires-stock-check"
                                    />
                                    <label htmlFor="requires-stock-check" style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '600', cursor: 'pointer', flex: 1, userSelect: 'none' }}>
                                        Controlar Existencias (Stock)
                                    </label>
                                </div>

                                {editingFrame.requires_stock !== false && (
                                    <div style={{ padding: '1.25rem', background: 'var(--bg-color)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem' }}>
                                        <div>
                                            <label className="form-label">Stock Físico</label>
                                            <input type="number" className="input-field" value={editingFrame.stock} onChange={(e) => setEditingFrame({ ...editingFrame, stock: parseInt(e.target.value, 10) || 0 })} />
                                        </div>
                                        <div>
                                            <label className="form-label">Alerta Mínima</label>
                                            <input type="number" className="input-field" value={editingFrame.min_stock ?? 3} onChange={(e) => setEditingFrame({ ...editingFrame, min_stock: parseInt(e.target.value, 10) || 0 })} />
                                        </div>
                                        <div style={{ gridColumn: '1 / -1' }}>
                                            <label className="form-label">URL Fotografía</label>
                                            <div className="input-wrapper">
                                                <ImageIcon size={18} className="input-icon" />
                                                <input type="text" className="form-input input-field" placeholder="https://ejemplo.com/foto.jpg" value={editingFrame.image_url} onChange={(e) => setEditingFrame({ ...editingFrame, image_url: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Acordeón Facturación (Sistema Premium) */}
                            <div style={{ border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                                <div
                                    onClick={() => setShowFacturacion(!showFacturacion)}
                                    style={{ background: 'var(--glass-surface)', padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: showFacturacion ? '1px dotted var(--glass-border)' : 'none' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '6px', borderRadius: '8px', color: '#3b82f6' }}>
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)', fontWeight: '600' }}>Configuración CFDI (Facturación)</h4>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Parámetros SAT opcionales para facturación electrónica</span>
                                        </div>
                                    </div>
                                    <div style={{ background: 'var(--surface)', padding: '0.4rem', borderRadius: '50%', color: 'var(--text-muted)' }}>
                                        {showFacturacion ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </div>
                                </div>

                                {showFacturacion && (
                                    <div className="fade-in" style={{ padding: '1.5rem', background: 'var(--bg-color)' }}>
                                        <div style={{ border: '1px dashed var(--primary)', borderRadius: 'var(--radius-md)', padding: '1.25rem', background: 'var(--primary-glow)', marginBottom: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '1rem', fontSize: '0.9rem' }}>
                                                <Sparkles size={16} color="var(--primary)" /> Sugerencias de Autocompletado (SAT)
                                            </div>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {['Armazón Oftálmico', 'Micas Graduadas', 'Examen de Vista', 'Lentes de Contacto', 'Gafas de Sol', 'Estuche', 'Paño Microfibra', 'Consulta Médica'].map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={(e) => { e.preventDefault(); setSatQuickOption(opt); }}
                                                        className="badge"
                                                        style={{ background: 'var(--surface)', border: '1px solid var(--glass-border)', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.4rem 0.8rem', fontSize: '0.75rem', transition: 'all 0.2s', fontWeight: '500' }}
                                                        onMouseOver={(e) => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                                        onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
                                            <div>
                                                <label className="form-label">
                                                    Clave ProdServ (SAT)
                                                </label>
                                                <div className="input-wrapper">
                                                    <Search size={16} className="input-icon" />
                                                    <input
                                                        type="text"
                                                        value={editingFrame.sat_product_key || ''}
                                                        onChange={(e) => setEditingFrame({ ...editingFrame, sat_product_key: e.target.value })}
                                                        className="form-input input-field"
                                                        placeholder="Buscar en catálogo..."
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="form-label">
                                                    Clave Unidad (SAT)
                                                </label>
                                                <div className="input-wrapper">
                                                    <Search size={16} className="input-icon" />
                                                    <input
                                                        type="text"
                                                        value={editingFrame.sat_unit_key || ''}
                                                        onChange={(e) => setEditingFrame({ ...editingFrame, sat_unit_key: e.target.value })}
                                                        className="form-input input-field"
                                                        placeholder="Ej: H87"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer del Modal */}
                        <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: 'var(--bg-secondary)', flexShrink: 0 }}>
                            <button onClick={() => setEditingFrame(null)} className="btn btn-secondary" style={{ padding: '0.75rem 2rem' }}>
                                Cancelar
                            </button>
                            <button onClick={handleSaveEdit} className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
                                <Save size={18} /> {isCreating ? 'Crear Artículo' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
                , document.body)}
        </div>
    );
}
