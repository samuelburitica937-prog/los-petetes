'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatPrice } from '@/lib/data';
import { useAuthStore } from '@/lib/auth';
import { generateLoyaltyCard } from '@/lib/pdf-utils';
import Link from 'next/link';

// Niveles de fidelización
function getLevelInfo(totalCOP: number) {
    if (totalCOP >= 10_000_000) return { nivel: 'PLATINO', color: '#C0C0C0', bg: 'from-slate-400/20 to-slate-600/10', border: 'border-slate-400/40', next: null, emoji: '💎', descuento: '20%' };
    if (totalCOP >= 5_000_000)  return { nivel: 'GOLD',    color: '#FFD700', bg: 'from-gold/20 to-amber-600/10',    border: 'border-gold/40',    next: 10_000_000, emoji: '🥇', descuento: '15%' };
    if (totalCOP >= 2_000_000)  return { nivel: 'SILVER',  color: '#C8C8DC', bg: 'from-slate-300/20 to-slate-400/10',border: 'border-slate-300/40',next: 5_000_000,  emoji: '🥈', descuento: '10%' };
    return                             { nivel: 'ALIADO',  color: '#CD7F32', bg: 'from-orange-400/20 to-orange-700/10',border:'border-orange-400/40',next: 2_000_000,  emoji: '🤝', descuento: '5%' };
}

// Pedidos mock (se reemplazarán por Supabase al activar el webhook)
const MOCK_ORDERS = [
    { id: 'PET-89234', fecha: '13/03/2026', total: 450000,  estado: 'En preparación', items: 12 },
    { id: 'PET-88152', fecha: '01/03/2026', total: 1250000, estado: 'Entregado',       items: 45 },
];

export default function OrdersPage() {
    const { user, isAuthenticated } = useAuthStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const [cardFlipped, setCardFlipped] = useState(false);

    const totalCOP   = MOCK_ORDERS.reduce((acc, o) => acc + o.total, 0);
    const totalPedidos = MOCK_ORDERS.length;
    const levelInfo  = getLevelInfo(totalCOP);
    const pctToNext  = levelInfo.next
        ? Math.min(100, Math.round((totalCOP / levelInfo.next) * 100))
        : 100;

    const handleDownload = async () => {
        if (!user) return;
        setIsGenerating(true);
        await new Promise(r => setTimeout(r, 600)); // Micro-delay UX
        generateLoyaltyCard({
            nombre:        user.nombre,
            email:         user.email,
            userId:        user.id,
            totalCompras:  totalCOP,
            totalPedidos,
        });
        setIsGenerating(false);
    };

    return (
        <main className="min-h-screen bg-navy flex flex-col pt-32 pb-20">
            <Header />
            <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">

                {/* Page Title */}
                <div className="flex items-end justify-between mb-16 border-b border-white/10 pb-6">
                    <div>
                        <p className="text-[11px] font-black text-gold uppercase tracking-[0.4em] mb-2">Panel Mayorista</p>
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
                            Mis Pedidos
                        </h1>
                    </div>
                    {isAuthenticated && (
                        <div className="hidden md:flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/5 border border-white/10">
                            <span className="text-xl">{levelInfo.emoji}</span>
                            <div>
                                <p className="text-[9px] text-white/30 uppercase tracking-widest font-black">Nivel actual</p>
                                <p className="font-black text-sm" style={{ color: levelInfo.color }}>{levelInfo.nivel}</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid lg:grid-cols-3 gap-12">

                    {/* LEFT — Tarjeta de Fidelización */}
                    <div className="lg:col-span-1 space-y-8">

                        {/* Card Preview 3D */}
                        <div
                            className="relative cursor-pointer select-none"
                            style={{ perspective: '1000px' }}
                            onClick={() => setCardFlipped(f => !f)}
                            title="Clic para girar"
                        >
                            <div
                                className="relative transition-all duration-700"
                                style={{
                                    transformStyle: 'preserve-3d',
                                    transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                    aspectRatio: '85.6/53.98',
                                }}
                            >
                                {/* FRENTE */}
                                <div
                                    className={`absolute inset-0 rounded-2xl overflow-hidden border-2 ${levelInfo.border} bg-gradient-to-br from-[#001532] to-[#000d1f] shadow-[0_30px_80px_rgba(0,0,0,0.7)]`}
                                    style={{ backfaceVisibility: 'hidden' }}
                                >
                                    {/* Franja superior del nivel */}
                                    <div className="h-[19%] w-full flex items-center justify-between px-4" style={{ background: levelInfo.color }}>
                                        <span className="text-[#001532] font-black text-sm tracking-tighter">LOS PETETES MAYORISTA</span>
                                        <span className="text-[#001532] font-black text-[10px] tracking-[0.2em]">{levelInfo.nivel}</span>
                                    </div>

                                    {/* Cuerpo */}
                                    <div className="px-4 pt-3 pb-4 flex flex-col justify-between h-[81%]">
                                        {/* Chip dorado */}
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-7 rounded bg-gradient-to-br from-yellow-400 to-yellow-600 border border-yellow-700/50 relative overflow-hidden flex-shrink-0">
                                                <div className="absolute inset-0 grid grid-cols-3 gap-px p-0.5">
                                                    {[...Array(9)].map((_, i) => (
                                                        <div key={i} className="bg-yellow-700/30 rounded-sm" />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black text-white text-sm truncate leading-tight">
                                                    {isAuthenticated ? user?.nombre?.toUpperCase() : 'TU NOMBRE'}
                                                </p>
                                                <p className="text-white/40 text-[9px] truncate">{isAuthenticated ? user?.email : 'correo@empresa.com'}</p>
                                            </div>
                                        </div>

                                        {/* Número */}
                                        <div>
                                            <p className="font-mono text-white/30 text-xs tracking-[0.3em]">
                                                {isAuthenticated
                                                    ? (user?.id.replace(/-/g,'').slice(0,16).padEnd(16,'0').replace(/(.{4})/g,'$1 ').trim().toUpperCase())
                                                    : '•••• •••• •••• ••••'
                                                }
                                            </p>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-[8px] text-white/30 uppercase tracking-widest">Descuento extra</p>
                                                <p className="font-black text-base" style={{ color: levelInfo.color }}>{levelInfo.descuento}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] text-white/30 uppercase tracking-widest text-right">Pedidos</p>
                                                <p className="font-black text-base text-white text-right">{totalPedidos}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] text-white/30 uppercase tracking-widest text-right">Válida hasta</p>
                                                <p className="font-black text-sm text-white text-right">
                                                    {String(new Date(Date.now() + 365*86400000).getMonth()+1).padStart(2,'0')}/{new Date(Date.now() + 365*86400000).getFullYear()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Glow */}
                                    <div className="absolute top-2 right-2 w-16 h-16 rounded-full opacity-20 blur-2xl" style={{ background: levelInfo.color }} />
                                </div>

                                {/* REVERSO */}
                                <div
                                    className="absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-br from-[#000d1f] to-[#001532] border border-white/10 shadow-xl flex flex-col justify-between"
                                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                                >
                                    <div className="w-full h-10 bg-zinc-800 mt-5" />
                                    <div className="px-4 space-y-3">
                                        <div className="h-8 bg-white rounded flex items-center px-3">
                                            <span className="text-[8px] text-zinc-400 font-mono flex-1">FIRMA AUTORIZADA</span>
                                        </div>
                                        <p className="text-[8px] text-white/30 text-center">Esta tarjeta es personal e intransferible. Válida solo con cédula/NIT del titular del registro.</p>
                                    </div>
                                    <div className="px-4 pb-3 flex justify-between items-end">
                                        <p className="text-[8px] text-white/20 font-mono">lospetetes.com</p>
                                        <p className="text-[8px] text-white/20">+57 (606) 884-0248</p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-center text-[9px] text-white/20 uppercase tracking-widest mt-3 font-black">← Clic para girar</p>
                        </div>

                        {/* Progreso al siguiente nivel */}
                        {levelInfo.next && (
                            <div className="glass-card p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Progreso al siguiente nivel</p>
                                    <p className="text-[10px] font-black" style={{ color: levelInfo.color }}>{pctToNext}%</p>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{ width: `${pctToNext}%`, background: levelInfo.color }}
                                    />
                                </div>
                                <div className="flex justify-between text-[9px] text-white/30 font-bold">
                                    <span>{formatPrice(totalCOP)}</span>
                                    <span>{formatPrice(levelInfo.next)}</span>
                                </div>
                                <p className="text-[9px] text-white/20">
                                    Te faltan {formatPrice(levelInfo.next - totalCOP)} para subir de nivel.
                                </p>
                            </div>
                        )}

                        {/* Botón descargar */}
                        <button
                            id="btn-download-loyalty-card"
                            onClick={handleDownload}
                            disabled={isGenerating || !isAuthenticated}
                            className="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
                            style={{
                                background: isGenerating ? 'rgba(255,215,0,0.1)' : `linear-gradient(135deg, ${levelInfo.color}, #ffb700)`,
                                color: '#001532',
                                boxShadow: `0 20px 40px ${levelInfo.color}30`,
                            }}
                        >
                            {isGenerating ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83" strokeLinecap="round"/>
                                    </svg>
                                    Generando PDF...
                                </>
                            ) : (
                                <>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                        <path d="M12 2v13M7 11l5 5 5-5M20 17v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2"/>
                                    </svg>
                                    {isAuthenticated ? 'Descargar Tarjeta PDF' : 'Inicia sesión para tu tarjeta'}
                                </>
                            )}
                        </button>

                        {!isAuthenticated && (
                            <div className="text-center">
                                <Link href="/login" className="text-gold text-sm font-black hover:underline">→ Iniciar Sesión</Link>
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Historial de Pedidos */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Historial de Compras</h2>
                            <span className="text-[10px] px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/40 font-black uppercase">
                                {totalPedidos} pedidos
                            </span>
                        </div>

                        {/* Resumen */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="glass-card p-5">
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Total Invertido</p>
                                <p className="text-2xl font-black text-gold">{formatPrice(totalCOP)}</p>
                            </div>
                            <div className="glass-card p-5">
                                <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-2">Ahorro Mayorista</p>
                                <p className="text-2xl font-black text-green-400">+{formatPrice(totalCOP * 0.35)}</p>
                            </div>
                        </div>

                        {/* Lista de pedidos */}
                        <div className="space-y-4">
                            {MOCK_ORDERS.map(order => (
                                <div key={order.id} className="glass-card p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:border-gold/30 transition-all group">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl group-hover:bg-gold/10 transition-colors flex-shrink-0">
                                        📦
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[10px] font-black text-gold uppercase tracking-widest">#{order.id}</span>
                                        </div>
                                        <p className="text-lg font-black text-white leading-tight">Realizada el {order.fecha}</p>
                                        <p className="text-white/40 text-xs mt-1">{order.items} referencias compradas</p>
                                    </div>
                                    <div className="text-left md:text-right flex-shrink-0">
                                        <p className="text-[9px] text-white/30 uppercase tracking-widest mb-1">Total Pagado</p>
                                        <p className="text-xl font-black text-gold">{formatPrice(order.total)}</p>
                                    </div>
                                    <div className="flex flex-col items-start md:items-end gap-3 flex-shrink-0">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            order.estado === 'Entregado'
                                                ? 'bg-green-500/15 text-green-400 border border-green-500/30'
                                                : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                        }`}>
                                            {order.estado === 'Entregado' ? '✅ ' : '🔄 '}{order.estado}
                                        </span>
                                        <button className="text-[10px] font-black text-white/30 hover:text-gold uppercase tracking-widest transition-colors">
                                            Ver Detalle →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-6 border-2 border-dashed border-white/10 rounded-2xl text-center space-y-2">
                            <p className="text-white/30 text-sm">¿Problema con un pedido?</p>
                            <a href="https://wa.me/576068840248" className="text-gold font-black text-sm hover:underline">
                                📲 Contactar por WhatsApp →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}

