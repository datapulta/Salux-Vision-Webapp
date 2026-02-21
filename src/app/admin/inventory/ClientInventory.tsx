'use client';
import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Image as ImageIcon, Save, X, AlertTriangle, PackageOpen, Boxes, FileDown, HelpCircle, ChevronDown, ChevronUp, FileText } from 'lucide-react';
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
            <div style={{ marginBottom: "2rem", display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: "2rem", fontWeight: "bold", fontFamily: "var(--font-heading)", color: "var(--text-primary)" }}>
                        Control de Inventario
                    </h1>
                    <p style={{ color: "var(--text-secondary)", marginTop: "0.25rem", fontSize: "1.1rem" }}>
                        Gestiona el stock y alertas de tus artículos
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => alert("Reporte PDF Próximamente")}
                        className="btn"
                        style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--accent-red)', color: 'white', border: 'none' }}>
                        <FileDown size={18} /> Descargar PDF Completo
                    </button>
                    <button onClick={() => alert("Próximamente Ajustes de Inventario")} className="btn" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#e0f2fe', color: 'var(--accent-blue)', border: '1px solid #bae6fd', fontWeight: 'bold' }}>
                        Ir a Gestión de Artículos
                    </button>
                    <button className="btn" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', fontWeight: 'bold' }}>
                        ← Volver a Menú Artículos
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', borderLeft: '5px solid var(--accent-blue)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Total Artículos</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{totalArticulos}</div>
                    </div>
                    <Boxes size={32} color="var(--accent-blue)" />
                </div>

                <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', borderLeft: '5px solid var(--accent-red)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>En Alerta</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-red)' }}>{enAlerta}</div>
                    </div>
                    <AlertTriangle size={32} color="var(--accent-red)" />
                </div>

                <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', borderLeft: '5px solid #f97316', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Sin Stock</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f97316' }}>{sinStock}</div>
                    </div>
                    <PackageOpen size={32} color="#f97316" />
                </div>

                <div style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', borderLeft: '5px solid #2ed573', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>Total Unidades en Inventario</div>
                        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2ed573' }}>{totalUnidades}</div>
                    </div>
                    <Boxes size={32} color="#2ed573" />
                </div>
            </div>

            {/* Panel de Búsqueda y Botón */}
            <div style={{ marginBottom: '1rem', background: 'var(--surface)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', maxWidth: '400px' }}>
                    <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 'bold' }}>Buscar Artículos</label>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} color="var(--text-secondary)" style={{ position: 'absolute', top: '12px', left: '12px' }} />
                        <input
                            type="text"
                            placeholder="Nombre, código o código de barras..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field"
                            style={{ width: '100%', paddingLeft: '2.5rem', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
                        />
                    </div>
                </div>
                <div>
                    <button onClick={handleCreateNew} className="btn" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: '#0d9488', color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 'bold' }}>
                        <Plus size={18} /> Nuevo Artículo
                    </button>
                </div>
            </div>

            {/* Tabla de Artículos */}
            <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'rgba(128,128,128,0.05)', textAlign: 'left', color: 'var(--text-secondary)', fontSize: '0.8rem', letterSpacing: '1px' }}>
                            <tr>
                                <th style={{ padding: '1rem 1.5rem', fontWeight: 'bold' }}>ARTÍCULO</th>
                                <th style={{ padding: '1rem', fontWeight: 'bold', textAlign: 'center' }}>STOCK ACTUAL</th>
                                <th style={{ padding: '1rem', fontWeight: 'bold', textAlign: 'center' }}>STOCK MÍNIMO</th>
                                <th style={{ padding: '1rem', fontWeight: 'bold', textAlign: 'center' }}>ESTADO</th>
                                <th style={{ padding: '1rem', fontWeight: 'bold', textAlign: 'right' }}>ACCIONES</th>
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

            {/* Modal de Edición/Creación de Producto (Estilo Eleventa) */}
            {editingFrame && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="fade-in" style={{
                        background: 'var(--surface)',
                        borderRadius: '8px',
                        border: '1px solid var(--glass-border)',
                        width: '100%',
                        maxWidth: '650px',
                        maxHeight: '95vh',
                        overflowY: 'auto',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        {/* Cabecera del Modal */}
                        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--surface)', zIndex: 10 }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>
                                {isCreating ? 'Nuevo Artículo' : 'Modificar Artículo'}
                            </h2>
                            <button onClick={() => setEditingFrame(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.2rem' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cuerpo del Modal */}
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

                            {/* Nombre */}
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: '500' }}>
                                    Nombre <span style={{ color: 'var(--accent-red)' }}>*</span>
                                    <HelpCircle size={14} color="#0d9488" style={{ cursor: 'help' }} />
                                </label>
                                <input
                                    className="input-field"
                                    value={editingFrame.name}
                                    onChange={(e) => setEditingFrame({ ...editingFrame, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '4px' }}
                                    maxLength={230}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                                    <span>Máximo 230 caracteres</span>
                                    <span>{editingFrame.name.length}/230</span>
                                </div>
                            </div>

                            {/* Código SKU */}
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: '500' }}>
                                    Código <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal' }}>(opcional)</span>
                                    <HelpCircle size={14} color="#0d9488" style={{ cursor: 'help' }} />
                                </label>
                                <input
                                    className="input-field"
                                    value={editingFrame.sku || ''}
                                    onChange={(e) => setEditingFrame({ ...editingFrame, sku: e.target.value })}
                                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '4px' }}
                                    placeholder="Ej: SKU-001, COD-123, 00045"
                                    maxLength={100}
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                                    <span>Máximo 100 caracteres</span>
                                    <span>{editingFrame.sku ? editingFrame.sku.length : 0}/100</span>
                                </div>
                            </div>

                            {/* Descripción */}
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: '500' }}>
                                    Descripción
                                    <HelpCircle size={14} color="#0d9488" style={{ cursor: 'help' }} />
                                </label>
                                <textarea
                                    className="input-field"
                                    value={editingFrame.description || ''}
                                    onChange={(e) => setEditingFrame({ ...editingFrame, description: e.target.value })}
                                    style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '4px', minHeight: '80px', resize: 'vertical' }}
                                />
                            </div>

                            {/* Precios */}
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: '500' }}>
                                    Precio sin Descuento <span style={{ color: 'var(--accent-red)' }}>*</span>
                                    <HelpCircle size={14} color="#0d9488" style={{ cursor: 'help' }} />
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }}>$</span>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={editingFrame.price || ''}
                                        onChange={(e) => setEditingFrame({ ...editingFrame, price: parseFloat(e.target.value) || 0 })}
                                        style={{ width: '100%', padding: '0.6rem 0.8rem 0.6rem 2rem', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '4px' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: '500' }}>
                                    Costo de Adquisición (Lo que me cuesta a mi)
                                    <HelpCircle size={14} color="#0d9488" style={{ cursor: 'help' }} />
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }}>$</span>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={editingFrame.wholesale_price || ''}
                                        onChange={(e) => setEditingFrame({ ...editingFrame, wholesale_price: parseFloat(e.target.value) || 0 })}
                                        style={{ width: '100%', padding: '0.6rem 0.8rem 0.6rem 2rem', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '4px' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: '500' }}>
                                    Descuento Fijo
                                    <HelpCircle size={14} color="#0d9488" style={{ cursor: 'help' }} />
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <span style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--text-secondary)' }}>$</span>
                                    <input
                                        type="number"
                                        className="input-field"
                                        value={editingFrame.discount || ''}
                                        onChange={(e) => setEditingFrame({ ...editingFrame, discount: parseFloat(e.target.value) || 0 })}
                                        style={{ width: '100%', padding: '0.6rem 0.8rem 0.6rem 2rem', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '4px' }}
                                    />
                                </div>
                            </div>

                            {/* Requiere Stock */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginTop: '0.5rem' }}>
                                <input
                                    type="checkbox"
                                    checked={editingFrame.requires_stock !== false}
                                    onChange={(e) => setEditingFrame({ ...editingFrame, requires_stock: e.target.checked })}
                                    style={{ width: '16px', height: '16px', accentColor: '#0d9488' }}
                                />
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                                    Requiere Stock
                                    <HelpCircle size={14} color="#0d9488" style={{ cursor: 'help' }} />
                                </label>
                            </div>

                            {/* Control de Stock Adicional si requiere stock */}
                            {editingFrame.requires_stock !== false && (
                                <div style={{ display: 'flex', gap: '1rem', background: 'rgba(128,128,128,0.03)', padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '4px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Stock Inicial Físico</label>
                                        <input type="number" className="input-field" value={editingFrame.stock} onChange={(e) => setEditingFrame({ ...editingFrame, stock: parseInt(e.target.value, 10) || 0 })} style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '4px' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>Min. Alerta</label>
                                        <input type="number" className="input-field" value={editingFrame.min_stock ?? 3} onChange={(e) => setEditingFrame({ ...editingFrame, min_stock: parseInt(e.target.value, 10) || 0 })} style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '4px' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>URL Foto</label>
                                        <input type="text" className="input-field" placeholder="https://..." value={editingFrame.image_url} onChange={(e) => setEditingFrame({ ...editingFrame, image_url: e.target.value })} style={{ width: '100%', padding: '0.5rem', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '4px' }} />
                                    </div>
                                </div>
                            )}

                            {/* Acordeón Facturación */}
                            <div style={{ border: '1px solid #e2e8f0', borderRadius: '4px', overflow: 'hidden', marginTop: '1rem' }}>
                                <div
                                    onClick={() => setShowFacturacion(!showFacturacion)}
                                    style={{ background: '#f8fafc', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: showFacturacion ? '1px solid #e2e8f0' : 'none' }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                        <FileText size={20} color="#0ea5e9" />
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#1e293b', fontWeight: 'bold' }}>Configurar Datos para facturación artículo</h4>
                                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Opcional - requerido solo para facturación</span>
                                        </div>
                                    </div>
                                    {showFacturacion ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                                </div>

                                {showFacturacion && (
                                    <div style={{ padding: '1.5rem', background: 'var(--surface)' }}>
                                        <div style={{ border: '1px solid #e9d5ff', borderRadius: '8px', padding: '1.2rem', background: '#fcfaff', marginBottom: '1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9333ea', fontWeight: 'bold', marginBottom: '0.8rem' }}>
                                                <span>⚡</span> Configuraciones Rápidas (claves SAT precargadas)
                                            </div>
                                            <p style={{ fontSize: '0.85rem', color: '#9333ea', marginBottom: '1rem' }}>
                                                Selecciona un tipo de artículo común para autocompletar o busca lo que necesites directo en el buscador:
                                            </p>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.8rem' }}>
                                                {['Armazón Oftálmico', 'Micas Graduadas', 'Examen de Vista', 'Lentes de Contacto', 'Gafas de Sol', 'Estuche para Lentes', 'Paño Microfibra', 'Kit de Limpieza'].map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => setSatQuickOption(opt)}
                                                        style={{ background: 'white', border: '1px solid #e9d5ff', padding: '0.8rem 0.5rem', borderRadius: '8px', color: '#9333ea', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center' }}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: '500' }}>
                                                    Clave de Producto SAT <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal' }}>(opcional)</span>
                                                    <HelpCircle size={14} color="#0d9488" style={{ cursor: 'help' }} />
                                                </label>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type="text"
                                                        value={editingFrame.sat_product_key || ''}
                                                        onChange={(e) => setEditingFrame({ ...editingFrame, sat_product_key: e.target.value })}
                                                        className="input-field"
                                                        style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'white', color: '#1e293b', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                                        placeholder="Busca en el catálogo SAT: 'lentes', 'armazón', 'examen'..."
                                                    />
                                                    <Search size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '10px' }} />
                                                </div>
                                            </div>

                                            <div>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: '500' }}>
                                                    Clave de Unidad SAT <span style={{ color: 'var(--text-secondary)', fontWeight: 'normal' }}>(opcional)</span>
                                                    <HelpCircle size={14} color="#0d9488" style={{ cursor: 'help' }} />
                                                </label>
                                                <div style={{ position: 'relative' }}>
                                                    <input
                                                        type="text"
                                                        value={editingFrame.sat_unit_key || ''}
                                                        onChange={(e) => setEditingFrame({ ...editingFrame, sat_unit_key: e.target.value })}
                                                        className="input-field"
                                                        style={{ width: '100%', padding: '0.6rem 0.8rem', background: 'white', color: '#1e293b', border: '1px solid #cbd5e1', borderRadius: '4px' }}
                                                        placeholder="Busca unidad: 'pieza', 'servicio', 'kilogramo'..."
                                                    />
                                                    <Search size={16} color="#94a3b8" style={{ position: 'absolute', right: '12px', top: '10px' }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer del Modal */}
                        <div style={{ padding: '1.2rem 1.5rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: 'var(--surface)', position: 'sticky', bottom: 0, borderRadius: '0 0 8px 8px' }}>
                            <button onClick={() => setEditingFrame(null)} style={{ padding: '0.5rem 1.5rem', border: '1px solid #cbd5e1', background: 'white', color: '#475569', borderRadius: '4px', fontWeight: '500', cursor: 'pointer' }}>
                                Cancelar
                            </button>
                            <button onClick={handleSaveEdit} style={{ padding: '0.5rem 1.5rem', border: 'none', background: '#0d9488', color: 'white', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                                {isCreating ? 'Crear' : 'Actualizar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
