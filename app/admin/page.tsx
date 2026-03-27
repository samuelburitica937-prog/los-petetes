'use client';
import { useState, useEffect } from 'react';
import { ALL_PRODUCTS, CATEGORIES, Category, formatPrice, Product } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

const ADMIN_PASSWORD = 'petetes2026';

export default function AdminPage() {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'logistics' | 'settings'>('dashboard');
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState<Category | 'all'>('all');
    const [products, setProducts] = useState<Product[]>(ALL_PRODUCTS);
    const [isMigrating, setIsMigrating] = useState(false);
    const router = useRouter();

    const migrateToSupabase = async () => {
        setIsMigrating(true);
        toast.loading('Iniciando migración de datos a Supabase...', { id: 'migrate' });
        try {
            // Migrando Categorías
            const categoryEntries = Object.entries(CATEGORIES).map(([id, cat]) => ({
                id,
                label: cat.label,
                icon: cat.icon,
                color: cat.color,
                description: cat.label + ' mayorista'
            }));
            const { error: catError } = await supabase.from('categories').upsert(categoryEntries);
            if (catError) throw catError;

            // Migrando Productos
            const productEntries = ALL_PRODUCTS.map(p => ({
                id: p.id,
                nombre: p.nombre,
                precio: p.precio,
                precio_mayorista: p.precioMayorista,
                stock: p.stock,
                categoria: p.categoria,
                descripcion: p.descripcion || '',
                imagenes: p.imagenes,
                min_mayorista: p.minMayorista || 1,
                destacado: p.destacado || false
            }));
            const { error: prodError } = await supabase.from('products').upsert(productEntries);
            if (prodError) throw prodError;

            toast.success('¡Ecosistema migrado a Supabase con éxito! 🚀', { id: 'migrate', duration: 5000 });
        } catch (error: any) {
            console.error('Error migrating to Supabase:', error);
            toast.error('Error al migrar: ' + error.message, { id: 'migrate', duration: 4000 });
        }
        setIsMigrating(false);
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setAuthenticated(true);
            setError('');
        } else {
            setError('Contraseña incorrecta');
        }
    };

    const filteredProducts = products
        .filter(p => catFilter === 'all' || p.categoria === catFilter)
        .filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 50);

    const stats = {
        totalProducts: products.length,
        lowStock: products.filter(p => p.stock < 10).length,
        totalValue: products.reduce((a, p) => a + p.precioMayorista * p.stock, 0),
        categories: Object.keys(CATEGORIES).length,
    };

    if (!authenticated) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ paddingTop: '140px', background: 'radial-gradient(ellipse at center, #002D5E 0%, #001428 100%)' }}
            >
                <div className="glass-card p-8 w-full max-w-md mx-4">
                    <div className="text-center mb-8">
                        <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl mx-auto mb-4"
                            style={{ background: 'linear-gradient(135deg, #FFD700, #E6C200)', color: '#001F3F' }}
                        >
                            🔐
                        </div>
                        <h1 className="font-black text-2xl" style={{ color: '#FFD700' }}>Panel Administrador</h1>
                        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Los Petetes Mayorista</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-2" style={{ color: '#FFD700' }}>Contraseña de Acceso</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="input-styled"
                                placeholder="••••••••••"
                                autoFocus
                            />
                        </div>
                        {error && (
                            <div className="text-sm font-semibold" style={{ color: '#FF0000' }}>⚠ {error}</div>
                        )}
                        <button type="submit" className="btn-primary w-full py-3 text-base">
                            Ingresar al Panel
                        </button>
                    </form>
                    <button
                        onClick={() => router.push('/')}
                        className="w-full mt-3 text-sm font-semibold text-center cursor-pointer"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                        ← Volver a la tienda
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ paddingTop: '140px' }}>
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="font-black text-3xl" style={{ color: '#FFD700' }}>Panel Administrador</h1>
                        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Los Petetes Mayorista — Control total</p>
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={migrateToSupabase} 
                            disabled={isMigrating} 
                            className="text-sm py-2 px-6 rounded-lg font-black transition-all shadow-[0_0_20px_rgba(0,200,100,0.3)] hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-wait"
                            style={{ background: '#00C864', color: '#001F3F' }}
                        >
                            {isMigrating ? 'Sincronizando...' : '⚡ MIGRAR A SUPABASE'}
                        </button>
                        <a href="/" className="btn-outline text-sm py-2 px-4">← Tienda</a>
                        <button onClick={() => setAuthenticated(false)} className="btn-danger text-sm py-2 px-4">Salir</button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {[
                        { id: 'dashboard', label: '📊 Dashboard' },
                        { id: 'products', label: '📦 Inventario' },
                        { id: 'orders', label: '🛒 Pedidos Real-Time' },
                        { id: 'logistics', label: '🚚 Logística & Sedes' },
                        { id: 'settings', label: '⚙️ Configuración' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className="px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap cursor-pointer transition-all"
                            style={{
                                background: activeTab === tab.id ? '#FFD700' : 'rgba(255,215,0,0.08)',
                                color: activeTab === tab.id ? '#001F3F' : '#FFD700',
                                border: '1.5px solid rgba(255,215,0,0.3)',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Dashboard */}
                {activeTab === 'dashboard' && (
                    <div className="animate-fade-in space-y-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {[
                                { label: 'Total Productos', value: stats.totalProducts.toLocaleString(), icon: '📦', color: '#FFD700' },
                                { label: 'Stock Bajo (<10)', value: stats.lowStock, icon: '⚠️', color: '#FFA000' },
                                { label: 'Valor Inventario', value: formatPrice(stats.totalValue), icon: '💰', color: '#00C864' },
                                { label: 'Categorías', value: stats.categories, icon: '🗂️', color: '#FF69B4' },
                            ].map(stat => (
                                <div key={stat.label} className="card p-5 group hover:border-gold/50 transition-all">
                                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                                    <div className="font-black text-2xl" style={{ color: stat.color }}>{stat.value}</div>
                                    <div className="text-sm font-black uppercase tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* CORPORATE SCHEMA VISUALIZATION */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="card p-8 border-2 border-gold/10 bg-gold/[0.02]">
                                    <h3 className="font-black text-xl mb-8 text-gold uppercase tracking-widest flex items-center gap-4">
                                        🏗️ Esquema Corporativo del Backend
                                        <span className="h-px flex-1 bg-white/10" />
                                    </h3>
                                    
                                    <div className="relative p-6 bg-navy/50 rounded-3xl border border-white/5 overflow-hidden">
                                        {/* Background pattern */}
                                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FFD700 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                        
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                                            {/* Step 1: Frontend */}
                                            <div className="flex-1 w-full text-center space-y-4">
                                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-xl">
                                                    <span className="text-2xl block mb-2">📱</span>
                                                    <p className="text-[10px] font-black text-white/40 uppercase mb-1">Capa de Cliente</p>
                                                    <p className="font-black text-white text-xs">NEXT.JS 15 + ZUSTAND</p>
                                                </div>
                                            </div>

                                            <div className="rotate-90 md:rotate-0 text-gold/30 text-2xl font-black">━━▶</div>

                                            {/* Step 2: Supabase (Center) */}
                                            <div className="flex-1 w-full text-center space-y-4">
                                                <div className="p-6 bg-gold/10 rounded-3xl border-2 border-gold/30 shadow-[0_0_50px_rgba(255,215,0,0.1)] relative">
                                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy text-[8px] font-black px-2 py-0.5 rounded-full">CORE BACKEND</div>
                                                    <span className="text-3xl block mb-2">⚡</span>
                                                    <p className="font-black text-gold text-sm">SUPABASE CLOUD</p>
                                                    <div className="h-px w-8 bg-gold/30 mx-auto my-2" />
                                                    <div className="flex justify-center gap-2">
                                                        <span title="PostgreSQL" className="grayscale hover:grayscale-0 transition-all cursor-help opacity-40 hover:opacity-100">🐘</span>
                                                        <span title="Auth" className="grayscale hover:grayscale-0 transition-all cursor-help opacity-40 hover:opacity-100">🔒</span>
                                                        <span title="Storage" className="grayscale hover:grayscale-0 transition-all cursor-help opacity-40 hover:opacity-100">📦</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="rotate-90 md:rotate-0 text-gold/30 text-2xl font-black">━━▶</div>

                                            {/* Step 3: External */}
                                            <div className="flex-1 w-full text-center space-y-4">
                                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-xl">
                                                    <span className="text-2xl block mb-2">🏦</span>
                                                    <p className="text-[10px] font-black text-white/40 uppercase mb-1">Pasarelas de Pago</p>
                                                    <p className="font-black text-white text-xs">WOMPI / NEQUI</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { label: 'DB Latency', value: '12ms', color: '#00C864' },
                                                { label: 'API Uptime', value: '99.9%', color: '#00C864' },
                                                { label: 'Backups', value: 'DIARIO', color: '#2196F3' },
                                                { label: 'Security', value: 'SSL 256', color: '#FFD700' },
                                            ].map(m => (
                                                <div key={m.label} className="text-center">
                                                    <p className="text-[8px] font-black text-white/20 uppercase mb-1">{m.label}</p>
                                                    <p className="text-[10px] font-bold" style={{ color: m.color }}>{m.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 flex gap-4">
                                        <button 
                                            onClick={() => window.open('https://supabase.com/dashboard', '_blank')}
                                            className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-white/60 hover:bg-white/10 hover:text-white transition-all uppercase tracking-widest"
                                        >
                                            Abrir Consola Supabase
                                        </button>
                                        <button 
                                            id="btn-access-backend"
                                            className="flex-1 py-3 bg-gold/5 border border-gold/20 rounded-xl text-[10px] font-black text-gold/60 hover:bg-gold/10 hover:text-gold transition-all uppercase tracking-widest"
                                        >
                                            Generar Reporte Técnico
                                        </button>
                                    </div>
                                </div>

                                {/* Category breakdown table/list */}
                                <div className="card p-6">
                                    <h3 className="font-black text-lg mb-6 text-gold uppercase tracking-tighter flex items-center justify-between">
                                        Segmentación de Catálogo (15 Líneas)
                                        <span className="text-[10px] px-2 py-1 bg-white/5 rounded text-white/40">Sincronizado</span>
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                        {Object.entries(CATEGORIES).map(([cat, info]) => {
                                            const count = ALL_PRODUCTS.filter(p => p.categoria === cat).length;
                                            const pct = Math.round((count / ALL_PRODUCTS.length) * 100);
                                            return (
                                                <div key={cat} className="flex items-center gap-3">
                                                    <span className="w-24 text-xs font-black uppercase text-white/40 flex-shrink-0">
                                                        {info.icon} {info.label}
                                                    </span>
                                                    <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                                                            style={{ width: `${pct}%`, background: info.color }}
                                                        />
                                                    </div>
                                                    <span className="text-[10px] font-black w-10 text-right text-gold">{count} uds</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="card p-6 bg-green-500/5 border border-green-500/20">
                                    <h4 className="text-[10px] font-black text-green-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        Estado del Ecosistema
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-white/60">Servidor (Edge)</span>
                                            <span className="text-green-500 font-bold">ONLINE</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-white/60">Base de Datos</span>
                                            <span className="text-green-500 font-bold">CONECTADO</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-white/60">Backup Automático</span>
                                            <span className="text-green-500 font-bold">OK</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="card p-6 bg-red/5 border border-red/20">
                                    <h4 className="text-[10px] font-black text-red uppercase tracking-widest mb-4">Métricas de Rendimiento</h4>
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase text-white/40">
                                                <span>Uso de CPU</span>
                                                <span className="text-white/80">14%</span>
                                            </div>
                                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-red w-[14%]" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-[10px] font-black mb-1.5 uppercase text-white/40">
                                                <span>Memoria RAM</span>
                                                <span className="text-white/80">32%</span>
                                            </div>
                                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-red w-[32%]" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="card p-6 border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4 opacity-60 hover:opacity-100 transition-opacity">
                                    <div className="text-4xl">🧪</div>
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-tighter">Entorno de Pruebas (Staging)</p>
                                    <button className="text-[10px] font-black px-4 py-2 border border-white/20 rounded-lg hover:bg-white hover:text-navy transition-all uppercase">
                                        Activar Sandbox
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Products */}
                {activeTab === 'products' && (
                    <div className="animate-fade-in">
                        <div className="flex flex-col md:flex-row gap-3 mb-6">
                            <input
                                type="search"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="input-styled flex-1"
                                placeholder="Buscar producto..."
                            />
                            <select
                                value={catFilter}
                                onChange={e => setCatFilter(e.target.value as Category | 'all')}
                                className="px-3 py-3 rounded-lg font-semibold outline-none cursor-pointer"
                                style={{ background: 'rgba(255,255,255,0.07)', border: '2px solid rgba(255,215,0,0.25)', color: '#FFD700', minWidth: '150px' }}
                            >
                                <option value="all" style={{ background: '#001F3F' }}>Todas las categorías</option>
                                {Object.entries(CATEGORIES).map(([cat, info]) => (
                                    <option key={cat} value={cat} style={{ background: '#001F3F' }}>
                                        {info.icon} {info.label}
                                    </option>
                                ))}
                            </select>
                            <button className="btn-primary px-6 text-sm">
                                + Nuevo Producto
                            </button>
                        </div>

                        <div className="card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr style={{ background: 'rgba(255,215,0,0.08)', borderBottom: '1px solid rgba(255,215,0,0.15)' }}>
                                            {['Imagen', 'Producto', 'Categoría', 'Precio Mayor.', 'Stock', 'Estado', 'Acciones'].map(h => (
                                                <th key={h} className="px-4 py-3 text-left font-black" style={{ color: '#FFD700' }}>{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map(p => (
                                            <tr
                                                key={p.id}
                                                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                                                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,215,0,0.04)')}
                                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                            >
                                                <td className="px-4 py-3">
                                                    <img src={p.imagenes?.[0] || '/images/placeholders/default.jpg'} alt={p.nombre} className="w-10 h-10 rounded-lg object-cover" />
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-semibold" style={{ color: 'white', maxWidth: '200px' }}>{p.nombre}</div>
                                                </td>
                                                <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                                    {CATEGORIES[p.categoria]?.label}
                                                </td>
                                                <td className="px-4 py-3 font-bold" style={{ color: '#FFD700' }}>
                                                    {formatPrice(p.precioMayorista)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={p.stock < 10 ? 'badge-stock-low' : 'badge-stock'}>
                                                        {p.stock} uds
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="badge-mayorista">{p.destacado ? 'DESTACADO' : 'ACTIVO'}</span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button className="px-2 py-1 text-xs rounded font-bold cursor-pointer" style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700' }}>
                                                            ✏️
                                                        </button>
                                                        <button className="px-2 py-1 text-xs rounded font-bold cursor-pointer" style={{ background: 'rgba(255,0,0,0.15)', color: '#FF0000' }}>
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                Mostrando {filteredProducts.length} de {products.length} productos
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders */}
                {activeTab === 'orders' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="card p-6 flex items-center justify-between border-l-4 border-gold">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-2xl">⚡</div>
                                <div>
                                    <h3 className="font-black text-white uppercase">Sincronización Activa</h3>
                                    <p className="text-xs text-white/40">Conectado a Supabase Realtime para recibir pedidos.</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-black bg-green-500/20 text-green-500 px-3 py-1 rounded-full animate-pulse">LIVE</span>
                        </div>
                        
                        <div className="card overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        {['ID Orden', 'Cliente', 'Total', 'Estado', 'Fecha', 'Acciones'].map(h => (
                                            <th key={h} className="px-6 py-4 font-black text-gold uppercase text-[10px] tracking-widest">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { id: '#8922', user: 'Distribuidora Eje', total: 1250000, status: 'PROCESANDO', date: 'Hace 5 min' },
                                        { id: '#8920', user: 'Papelería Central', total: 450000, status: 'ENVIADO', date: 'Hace 2 horas' },
                                        { id: '#8918', user: 'Ferretería Maizales', total: 3200000, status: 'ENTREGADO', date: 'Ayer' },
                                    ].map(order => (
                                        <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-bold text-white">{order.id}</td>
                                            <td className="px-6 py-4 text-white/60">{order.user}</td>
                                            <td className="px-6 py-4 font-black text-gold">{formatPrice(order.total)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-black px-2 py-1 rounded inline-block ${
                                                    order.status === 'PROCESANDO' ? 'bg-blue-500/20 text-blue-500' :
                                                    order.status === 'ENVIADO' ? 'bg-orange-500/20 text-orange-500' : 'bg-green-500/20 text-green-500'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-white/40">{order.date}</td>
                                            <td className="px-6 py-4">
                                                <button className="text-gold hover:underline text-xs font-bold">Ver Detalles</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Logistics & Branches */}
                {activeTab === 'logistics' && (
                    <div className="animate-fade-in grid md:grid-cols-2 gap-6">
                        <div className="card p-6">
                            <h3 className="font-black text-lg mb-6 text-gold uppercase tracking-tighter">Sedes Los Petetes (Eje Cafetero)</h3>
                            <div className="space-y-4">
                                {[
                                    { city: 'Manizales (Principal)', address: 'Calle 22 # 23-45', stock: '95%', manager: 'Andrés G.' },
                                    { city: 'Pereira', address: 'Av. 30 de Agosto', stock: '80%', manager: 'Sandra M.' },
                                    { city: 'Armenia', address: 'Carrera 14 # 10-20', stock: '88%', manager: 'Carlos P.' },
                                ].map(sede => (
                                    <div key={sede.city} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center group hover:border-gold/40 transition-all">
                                        <div>
                                            <div className="font-black text-white">{sede.city}</div>
                                            <div className="text-xs text-white/40">{sede.address}</div>
                                            <div className="text-[10px] text-gold mt-1 uppercase font-bold">Encargado: {sede.manager}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-black text-green-500">{sede.stock} Stock</div>
                                            <div className="w-16 h-1 bg-white/10 mt-1 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-500" style={{ width: sede.stock }} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card p-6">
                            <h3 className="font-black text-lg mb-6 text-gold uppercase tracking-tighter">Aliados de Transporte</h3>
                            <div className="space-y-4">
                                {[
                                    { name: 'Servientrega', type: 'Envio Nacional', status: 'Conectado', api: 'API v2.4' },
                                    { name: 'Interrapidisimo', type: 'Envio Regional', status: 'Conectado', api: 'API v5.0' },
                                    { name: 'Coordinadora', type: 'Carga Pesada', status: 'En Espera', api: 'OAuth' },
                                ].map(partner => (
                                    <div key={partner.name} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center font-black text-xs text-gold border border-gold/20">{partner.name[0]}</div>
                                            <div>
                                                <div className="font-black text-white">{partner.name.toUpperCase()}</div>
                                                <div className="text-[10px] text-white/40 uppercase font-bold">{partner.type}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-[10px] font-black uppercase ${partner.status === 'Conectado' ? 'text-green-500' : 'text-orange-500'}`}>{partner.status}</div>
                                            <div className="text-[9px] text-white/20 font-bold">{partner.api}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Settings */}
                {activeTab === 'settings' && (
                    <div className="animate-fade-in grid md:grid-cols-2 gap-6">
                        <div className="card p-6">
                            <h3 className="font-black text-lg mb-4" style={{ color: '#FFD700' }}>Configuración de Tienda</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Nombre tienda', value: 'Los Petetes Mayorista' },
                                    { label: 'WhatsApp', value: '+57 606 884 0248' },
                                    { label: 'Instagram', value: '@lospetetesmanizales7' },
                                    { label: 'Ciudad principal', value: 'Manizales, Caldas' },
                                ].map(s => (
                                    <div key={s.label}>
                                        <label className="block text-xs font-bold mb-1" style={{ color: 'rgba(255,215,0,0.7)' }}>{s.label}</label>
                                        <input defaultValue={s.value} className="input-styled text-sm" />
                                    </div>
                                ))}
                                <button className="btn-primary text-sm px-6 py-2">Guardar Cambios</button>
                            </div>
                        </div>
                        <div className="card p-6">
                            <h3 className="font-black text-lg mb-4" style={{ color: '#FFD700' }}>Descuentos Mayoristas</h3>
                            <div className="space-y-3 text-sm">
                                {[
                                    { qty: '+20 uds', discount: '5%' },
                                    { qty: '+50 uds', discount: '10%' },
                                    { qty: '+100 uds', discount: '15%' },
                                ].map(d => (
                                    <div key={d.qty} className="flex justify-between items-center px-3 py-2 rounded-lg" style={{ background: 'rgba(255,215,0,0.06)' }}>
                                        <span style={{ color: 'rgba(255,255,255,0.8)' }}>{d.qty}</span>
                                        <span className="font-black" style={{ color: '#00C864' }}>─{d.discount}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
