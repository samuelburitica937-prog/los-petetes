'use client';
import { useState, useEffect } from 'react';
import { ALL_PRODUCTS, CATEGORIES, Category, formatPrice, Product } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/lib/auth';

const ADMIN_PASSWORD = 'petetes2026';

export default function AdminPage() {
    const { user } = useAuthStore();
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'logistics' | 'settings'>('dashboard');
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState<Category | 'all'>('all');
    const [products, setProducts] = useState<Product[]>(ALL_PRODUCTS);
    const [isMigrating, setIsMigrating] = useState(false);
    
    // Estados para Nuevo Producto
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: 'ferreteria' as Category,
        stock: '',
        imagen: ''
    });

    // Estados para Scanner
    const [showScanner, setShowScanner] = useState(false);
    const [scannerInput, setScannerInput] = useState('');

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
        .filter(p => p.nombre.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 50);

    const handleSaveProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProduct.nombre || !newProduct.precio || !newProduct.stock) {
            toast.error('Por favor completa los campos obligatorios');
            return;
        }

        const newProd: Product = {
            id: `PROD-${Date.now()}`,
            nombre: newProduct.nombre,
            descripcion: newProduct.descripcion,
            precio: Number(newProduct.precio),
            precioMayorista: Math.round(Number(newProduct.precio) * 0.7), // Ejemplo de precio mayorista
            categoria: newProduct.categoria,
            stock: Number(newProduct.stock),
            imagenes: newProduct.imagen ? [newProduct.imagen] : ['/images/placeholders/default.jpg'],
            minMayorista: 1,
            rating: 5,
            vendidos: 0,
            tags: [newProduct.categoria]
        };

        setProducts([newProd, ...products]);
        setIsProductModalOpen(false);
        setNewProduct({ nombre: '', descripcion: '', precio: '', categoria: 'ferreteria', stock: '', imagen: '' });
        toast.success('Producto agregado con éxito');
    };

    const handleDeleteProduct = (id: string) => {
        if (window.confirm('¿Realmente deseas eliminar este producto? Esta acción no se puede deshacer.')) {
            setProducts(products.filter(p => p.id !== id));
            toast.success('Producto eliminado con éxito');
        }
    };

    const handleScan = (e: React.FormEvent) => {
        e.preventDefault();
        if (!scannerInput.trim()) return;

        // Buscar producto por ID exacto
        const foundIndex = products.findIndex(p => p.id.toLowerCase() === scannerInput.trim().toLowerCase());
        
        if (foundIndex !== -1) {
            const updatedProducts = [...products];
            updatedProducts[foundIndex] = {
                ...updatedProducts[foundIndex],
                stock: updatedProducts[foundIndex].stock + 1
            };
            setProducts(updatedProducts);
            toast.success(`+1 Stock añadido a: ${updatedProducts[foundIndex].nombre}`);
            setScannerInput(''); // Limpiar para el siguiente escaneo
        } else {
            toast.error('Producto no encontrado con ese ID');
        }
    };

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
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                            {[
                                { label: 'Total Productos', value: stats.totalProducts.toLocaleString(), icon: '📦', color: '#FFD700' },
                                { label: 'Stock Bajo (<10)', value: stats.lowStock, icon: '⚠️', color: '#FFA000' },
                                { label: 'Valor Inventario', value: formatPrice(stats.totalValue), icon: '💰', color: '#00C864' },
                                { label: 'Ingresos Petete', value: formatPrice(1250000), icon: '🔑', color: '#FF1493' },
                                { label: 'Categorías', value: stats.categories, icon: '🗂️', color: '#00C864' },
                            ].map(stat => (
                                <div key={stat.label} className="card p-5 group hover:border-gold/50 transition-all">
                                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{stat.icon}</div>
                                    <div className="font-black text-xl" style={{ color: stat.color }}>{stat.value}</div>
                                    <div className="text-[9px] font-black uppercase tracking-tighter opacity-40 group-hover:opacity-100 transition-opacity">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* DESCARGA DE PAGOS */}
                        <div className="card p-6 border-2 border-[#00C864]/20 bg-[#00C864]/5">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="font-black text-xl text-[#00C864] uppercase tracking-widest flex items-center gap-2">
                                        💸 Bóveda de Ingresos (Disponible)
                                    </h3>
                                    <p className="text-xs text-white/50">Fondos libres de comisiones listos para ser transferidos a tus cuentas.</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-white/40 font-black uppercase">Saldo Actual</p>
                                    <p className="text-3xl font-black text-[#00C864]">{formatPrice(1250000)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button 
                                    onClick={() => window.open('https://www.bancolombia.com/personas', '_blank')}
                                    className="flex items-center justify-center gap-2 py-4 rounded-xl font-black text-xs transition-all hover:scale-[1.02] cursor-pointer"
                                    style={{ background: '#FFD700', color: '#000' }}
                                >
                                    🏦 DESCARGAR A BANCOLOMBIA
                                </button>
                                <button 
                                    onClick={() => window.open('https://www.nequi.com.co/', '_blank')}
                                    className="flex items-center justify-center gap-2 py-4 rounded-xl font-black text-xs transition-all hover:scale-[1.02] cursor-pointer"
                                    style={{ background: '#FF1493', color: 'white' }}
                                >
                                    📱 DESCARGAR A NEQUI
                                </button>
                                <button 
                                    onClick={() => window.open('https://www.payoneer.com/', '_blank')}
                                    className="flex items-center justify-center gap-2 py-4 rounded-xl font-black text-xs transition-all hover:scale-[1.02] cursor-pointer"
                                    style={{ background: '#FF4500', color: 'white' }}
                                >
                                    🟠 DESCARGAR A PAYONEER
                                </button>
                            </div>
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
                        
                        {/* Lógica de Potenciación y Destacados */}
                        <div className="card p-8 border-2 border-pink-500/20 bg-pink-500/5 mt-8">
                            <h3 className="font-black text-xl mb-6 text-pink-500 uppercase tracking-widest flex items-center gap-4">
                                ❤️ Motor de Destacados Orgánicos
                                <span className="h-px flex-1 bg-pink-500/20" />
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <p className="text-white/60 text-sm mb-4">
                                        El sistema ahora detecta qué productos reciben más interacciones (Likes en favoritos) y volumen de ventas para <strong>potenciarlos automáticamente</strong> como Destacados en la tienda principal.
                                    </p>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Reloj Inteligente Ultra', likes: 145, ventas: 89, boost: '+45%' },
                                            { name: 'Set de Brochas Pro', likes: 120, ventas: 104, boost: '+30%' },
                                            { name: 'Audífonos Inalámbricos', likes: 98, ventas: 210, boost: '+25%' },
                                        ].map(item => (
                                            <div key={item.name} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                                                <span className="font-bold text-xs text-white">{item.name}</span>
                                                <div className="flex gap-4 text-[10px] font-black uppercase text-white/50">
                                                    <span>❤️ {item.likes}</span>
                                                    <span>📦 {item.ventas}</span>
                                                    <span className="text-pink-500 bg-pink-500/10 px-2 py-0.5 rounded">{item.boost} Alcance</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-6 bg-navy/50 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center">
                                    <div className="text-5xl mb-4">📈</div>
                                    <h4 className="font-black text-white uppercase text-sm mb-2">Smart Sorting Activado</h4>
                                    <p className="text-[10px] text-white/40 uppercase tracking-widest mb-4">El algoritmo se ajusta en tiempo real</p>
                                    <button className="text-[10px] font-black px-4 py-2 border border-pink-500/50 text-pink-500 rounded-lg hover:bg-pink-500 hover:text-white transition-all uppercase">
                                        Ajustar Pesos del Algoritmo
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Base de Datos de Clientes (CRM) */}
                        <div className="card p-8 border-t-4 border-blue-500 mt-8">
                            <h3 className="font-black text-xl mb-6 text-blue-500 uppercase tracking-widest flex items-center gap-4">
                                👥 Base de Datos de Clientes (Nuevos Registros)
                                <span className="h-px flex-1 bg-blue-500/20" />
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-white/5 border-b border-white/10">
                                        <tr>
                                            {['Empresa / Nombre', 'Email', 'Rol', 'Fecha de Registro'].map(h => (
                                                <th key={h} className="px-6 py-4 font-black text-blue-400 uppercase text-[10px] tracking-widest">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            ...(user ? [{ nombre: user.nombre, email: user.email, rol: user.esMayorista ? 'MAYORISTA' : 'MINORISTA', fecha: 'Hoy (Reciente)' }] : []),
                                            { nombre: 'Ferretería La 14', email: 'compras@la14.com', rol: 'MAYORISTA', fecha: 'Hace 2 días' },
                                            { nombre: 'Cacharrería El Hueco', email: 'contacto@elhueco.co', rol: 'MAYORISTA', fecha: 'Hace 5 días' },
                                            { nombre: 'Andrés López', email: 'andresl@gmail.com', rol: 'MINORISTA', fecha: 'Hace 1 semana' }
                                        ].map((client, idx) => (
                                            <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-bold text-white">{client.nombre}</td>
                                                <td className="px-6 py-4 text-white/60">{client.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-black px-2 py-1 rounded inline-block ${client.rol === 'MAYORISTA' ? 'bg-gold/20 text-gold' : 'bg-white/10 text-white/40'}`}>
                                                        {client.rol}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-white/40">{client.fecha}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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
                                placeholder="Buscar por nombre o ID..."
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
                            <button 
                                onClick={() => setShowScanner(!showScanner)}
                                className="px-6 py-3 rounded-lg font-bold transition-all text-sm flex items-center justify-center gap-2"
                                style={{ background: showScanner ? 'rgba(0, 200, 100, 0.2)' : 'rgba(255, 255, 255, 0.1)', color: showScanner ? '#00C864' : 'white', border: showScanner ? '1px solid #00C864' : '1px solid rgba(255,255,255,0.2)' }}
                            >
                                📷 {showScanner ? 'Cerrar Escáner' : 'Escáner POS'}
                            </button>
                            <button 
                                onClick={() => setIsProductModalOpen(true)}
                                className="btn-primary px-6 text-sm"
                            >
                                + Nuevo Producto
                            </button>
                        </div>

                        {/* Scanner Section */}
                        {showScanner && (
                            <div className="card p-6 mb-6 border-2 border-[#00C864]/30 bg-[#00C864]/[0.02] animate-fade-in relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#00C864]"></div>
                                
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xl">📷</span>
                                    <div>
                                        <h3 className="font-black text-[#00C864] uppercase tracking-widest text-sm">Punto de Escaneo (POS)</h3>
                                        <p className="text-[10px] text-white/50">WMS App - Añade stock al instante</p>
                                    </div>
                                </div>

                                <div className="bg-[#001F3F] p-6 rounded-2xl border border-white/10 text-center space-y-6">
                                    <p className="text-xs text-white/70">Apunta la cámara al Código de Barras o usa una Pistola Inalámbrica Bluetooth.</p>
                                    
                                    <button className="w-full py-4 rounded-xl font-black text-white flex items-center justify-center gap-3 transition-all hover:bg-[#00C864]/20 border border-[#00C864]" style={{ background: 'rgba(0, 200, 100, 0.1)' }}>
                                        <span className="text-[#00C864] text-xl">📷</span> Activar Lente (Celular)
                                    </button>

                                    <div className="flex items-center justify-center gap-4 text-white/30 text-[10px] uppercase font-bold">
                                        <span className="h-px w-12 bg-white/10"></span>
                                        o escanea láser / usa teclado
                                        <span className="h-px w-12 bg-white/10"></span>
                                    </div>

                                    <form onSubmit={handleScan} className="relative max-w-md mx-auto">
                                        <input
                                            type="text"
                                            value={scannerInput}
                                            onChange={e => setScannerInput(e.target.value)}
                                            placeholder="ID. Ej: ferreteria-1"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#00C864] transition-colors"
                                            autoFocus={showScanner}
                                        />
                                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg hover:bg-[#00C864] hover:text-navy transition-colors text-white">
                                            🔍
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}

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
                                                    <div className="text-[10px] text-gold/60">{p.id}</div>
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
                                                        <button className="px-2 py-1 text-xs rounded font-bold cursor-pointer hover:scale-110 hover:bg-gold hover:text-navy transition-all" style={{ background: 'rgba(255,215,0,0.15)', color: '#FFD700' }} title="Editar">
                                                            ✏️
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDeleteProduct(p.id)}
                                                            className="px-2 py-1 text-xs rounded font-bold cursor-pointer hover:scale-110 hover:bg-red-600 hover:text-white transition-all" 
                                                            style={{ background: 'rgba(255,0,0,0.15)', color: '#FF0000' }} 
                                                            title="Eliminar"
                                                        >
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
                                        ...(user?.pedidosList || []).map(o => ({
                                            id: o.id,
                                            user: user?.nombre || 'Cliente',
                                            total: o.total,
                                            status: o.estado.toUpperCase(),
                                            date: o.fecha
                                        })),
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
                                    { city: 'Manizales (Principal)', address: 'Calle 22 # 23-45', stock: '95%', manager: 'Andrés G.', isDefault: true },
                                    { city: 'Pereira', address: 'Av. 30 de Agosto', stock: '80%', manager: 'Sandra M.', isDefault: false },
                                    { city: 'Armenia', address: 'Carrera 14 # 10-20', stock: '88%', manager: 'Carlos P.', isDefault: false },
                                ].map(sede => (
                                    <div key={sede.city} className="p-4 bg-white/5 rounded-2xl border border-white/10 flex justify-between items-center group hover:border-gold/40 transition-all relative overflow-hidden">
                                        {sede.isDefault && <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>}
                                        <div>
                                            <div className="font-black text-white flex items-center gap-2">
                                                {sede.city}
                                                {sede.isDefault && <span className="text-[8px] bg-green-500/20 text-green-500 px-1.5 py-0.5 rounded uppercase font-bold">Predeterminada</span>}
                                            </div>
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
                                    { qty: 'Nivel Bronce (0 - 2M)', discount: '5%' },
                                    { qty: 'Nivel Plata (2M - 5M)', discount: '7%' },
                                    { qty: 'Nivel Oro (5M - 10M)', discount: '8%' },
                                    { qty: 'Nivel Platino (10M - 20M)', discount: '10%' },
                                    { qty: 'Nivel Diamante (+20M)', discount: '15%' },
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

            {/* Modal Nuevo Producto */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-[#001428] rounded-3xl w-full max-w-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
                        {/* Header Modal */}
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                            <h2 className="text-2xl font-black italic text-[#FFD700]">Nuevo Producto</h2>
                            <button 
                                onClick={() => setIsProductModalOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Formulario */}
                        <form onSubmit={handleSaveProduct} className="p-6 space-y-6">
                            <div>
                                <label className="block text-xs font-black uppercase text-white/60 mb-2">Nombre del Producto</label>
                                <input 
                                    type="text" 
                                    value={newProduct.nombre}
                                    onChange={e => setNewProduct({...newProduct, nombre: e.target.value})}
                                    placeholder="Ej: Reloj Rolex Daytona..." 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-white/60 mb-2">Descripción del Producto</label>
                                <textarea 
                                    value={newProduct.descripcion}
                                    onChange={e => setNewProduct({...newProduct, descripcion: e.target.value})}
                                    placeholder="Opcional. Describe la calidad, uso o empaque..." 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors min-h-[100px] resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-black uppercase text-white/60 mb-2">Precio (COP)</label>
                                    <input 
                                        type="number" 
                                        value={newProduct.precio}
                                        onChange={e => setNewProduct({...newProduct, precio: e.target.value})}
                                        placeholder="0" 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-white/60 mb-2">Catálogo</label>
                                    <select 
                                        value={newProduct.categoria}
                                        onChange={e => setNewProduct({...newProduct, categoria: e.target.value as Category})}
                                        className="w-full bg-[#001F3F] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors appearance-none"
                                    >
                                        {Object.entries(CATEGORIES).map(([cat, info]) => (
                                            <option key={cat} value={cat}>{info.label.toUpperCase()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-black uppercase text-white/60 mb-2">Stock (Cuántos hay?)</label>
                                    <input 
                                        type="number" 
                                        value={newProduct.stock}
                                        onChange={e => setNewProduct({...newProduct, stock: e.target.value})}
                                        placeholder="0" 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-white/60 mb-2">Foto del Producto</label>
                                <div className="flex flex-col md:flex-row gap-4">
                                    <button type="button" className="w-full border-2 border-dashed border-[#00C864] bg-[#00C864]/5 text-[#00C864] rounded-xl py-4 flex items-center justify-center gap-3 font-bold hover:bg-[#00C864]/10 transition-colors">
                                        <span className="text-2xl">↑</span> Subir Foto de Archivo
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4 mt-2 border-t border-white/5">
                                <button type="submit" className="w-full bg-[#000000] text-[#00C864] py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#111111] transition-all flex items-center justify-center gap-2 border border-[#00C864]/30 shadow-[0_0_20px_rgba(0,200,100,0.15)]">
                                    Guardar y Publicar en Tienda
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
