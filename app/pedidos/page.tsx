'use client';
import { useState } from 'react';


import { formatPrice, getLevelInfo } from '@/lib/data';
import { useAuthStore } from '@/lib/auth';
import { generateLoyaltyCard } from '@/lib/pdf-utils';
import Link from 'next/link';

const TIERS = [
    { min: 0, max: 2000000, label: '0 - 2M', pct: '5%' },
    { min: 2000000, max: 5000000, label: '2M - 5M', pct: '7%' },
    { min: 5000000, max: 10000000, label: '5M - 10M', pct: '8%' },
    { min: 10000000, max: 20000000, label: '10M - 20M', pct: '10%' },
    { min: 20000000, max: null, label: '+20M', pct: '15%' }
];

// Pedidos mock (se reemplazarán por Supabase al activar el webhook)
const MOCK_ORDERS = [
    { id: 'PET-89234', fecha: '13/03/2026', total: 450000,  estado: 'En preparación', items: 12 },
    { id: 'PET-88152', fecha: '01/03/2026', total: 1250000, estado: 'Entregado',       items: 45 },
];

export default function OrdersPage() {
    const { user, isAuthenticated, updatePaymentMethods, buyPetete } = useAuthStore();
    
    // Combine real orders from store with MOCK_ORDERS fallback
    const userOrders = user?.pedidosList || [];
    const displayOrders = userOrders.length > 0 ? userOrders : MOCK_ORDERS;
    const [isGenerating, setIsGenerating] = useState(false);
    const [cardFlipped, setCardFlipped] = useState(false);
    
    // New States for Features
    const [giftCards, setGiftCards] = useState<{ amount: number; code: string; used: boolean }[]>([]);
    const [selectedGiftAmount, setSelectedGiftAmount] = useState<number>(50000);
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);

    const petetesEmojis = ['🐶','🐱','🧸','🦄','🐼','🦊','🐸','🐙','🐢','🐰','🦁','🐵','🐧','🦉','🦖'];

    const generateGiftCard = () => {
        const newCode = 'LP-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        setGiftCards(prev => [...prev, { amount: selectedGiftAmount, code: newCode, used: false }]);
        setGeneratedCode(newCode);
    };

    // buyPetete function is now extracted from useAuthStore

    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentYear = currentDate.getFullYear();
    const memberSince = `${currentMonth}/${currentYear}`;
    const validUntil = `${currentMonth}/${currentYear + 3}`;

    const totalCOP   = user?.totalCompras || displayOrders.reduce((acc, o) => acc + o.total, 0);
    const totalPedidos = displayOrders.length;
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
                                    className={`absolute inset-0 rounded-2xl overflow-hidden border-2 ${levelInfo.border} shadow-[0_30px_80px_rgba(0,0,0,0.7)] relative bg-[#0b1b3d] flex flex-col justify-between p-4 md:p-6`}
                                    style={{ backfaceVisibility: 'hidden' }}
                                >
                                    {/* Geometric Tech Background Pattern */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
                                        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
                                        backgroundSize: '20px 20px'
                                    }}>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-[#4FC3F7]/30 rounded-lg transform rotate-45"></div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border border-[#4FC3F7]/30 rounded-lg transform -rotate-45"></div>
                                    </div>

                                    {/* Header */}
                                    <div className="text-center relative z-10">
                                        <h2 className="text-[#89b4f8] font-black text-[12px] md:text-lg tracking-tighter uppercase drop-shadow-md">TARJETA CLIENTE LOS PETETES</h2>
                                        <p className="text-[#a8c7fa] font-medium tracking-[0.2em] text-[8px] md:text-xs mt-0.5 uppercase drop-shadow-sm">MIEMBRO {levelInfo.nivel}</p>
                                    </div>

                                    {/* Body Container (Flex layout to prevent overlap) */}
                                    <div className="flex-1 flex items-center justify-between relative z-10 mt-2">
                                        {/* Dates */}
                                        <div className="space-y-2 md:space-y-4">
                                            <div className="flex items-center gap-2 md:gap-4">
                                                <span className="text-[#89b4f8] font-bold tracking-widest text-[8px] md:text-xs uppercase w-20 md:w-28">MIEMBRO DESDE:</span>
                                                <span className="text-[#e8f0fe] font-mono text-[10px] md:text-sm tracking-widest">{memberSince}</span>
                                            </div>
                                            <div className="flex items-center gap-2 md:gap-4">
                                                <span className="text-[#89b4f8] font-bold tracking-widest text-[8px] md:text-xs uppercase w-20 md:w-28">VENCIMIENTO:</span>
                                                <span className="text-[#e8f0fe] font-mono text-[10px] md:text-sm tracking-widest">{validUntil}</span>
                                            </div>
                                        </div>

                                        {/* Chip & Logo */}
                                        <div className="flex flex-col items-center gap-2 md:gap-3">
                                            {/* Chip */}
                                            <div className="w-8 h-5 md:w-10 md:h-7 rounded bg-gradient-to-br from-yellow-300 to-yellow-600 border border-yellow-700/50 relative overflow-hidden">
                                                <div className="absolute inset-0 grid grid-cols-3 gap-px p-0.5">
                                                    {[...Array(9)].map((_, i) => (
                                                        <div key={i} className="bg-yellow-800/30 rounded-sm" />
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Logo Fake */}
                                            <div className="flex flex-col items-center">
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-[#89b4f8] flex items-center justify-center text-[#89b4f8] font-black text-xs md:text-sm shadow-[0_0_15px_rgba(137,180,248,0.3)]">
                                                    LP
                                                </div>
                                                <span className="text-[#89b4f8] text-[6px] md:text-[8px] font-black tracking-widest mt-1">LOS PETETES</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer (Username and Discount) */}
                                    <div className="flex justify-between items-end relative z-10 mt-2">
                                        <div>
                                            <p className="text-[#e8f0fe] font-mono text-[10px] md:text-sm tracking-widest uppercase">
                                                {isAuthenticated ? user?.nombre?.substring(0, 20) : 'TU NOMBRE'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-[10px] md:text-sm" style={{ color: levelInfo.color }}>{Math.round(levelInfo.descuento * 100)}%</p>
                                        </div>
                                    </div>

                                    {/* Edge highlight / Glow */}
                                    <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none" />
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
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
                        <div className="glass-card p-6 space-y-5">
                            {levelInfo.next ? (
                                <>
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
                                </>
                            ) : (
                                <p className="text-[10px] font-black text-gold uppercase tracking-widest text-center">¡Eres el nivel máximo (PLATINO)!</p>
                            )}

                            {/* Tiers Visualizer */}
                            <div className="pt-4 border-t border-white/10">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Beneficios por Nivel</p>
                                <div className="space-y-2">
                                    {TIERS.map((tier, idx) => {
                                        const isCurrent = (totalCOP >= tier.min && (tier.max === null || totalCOP < tier.max));
                                        return (
                                            <div key={idx} className={`flex items-center justify-between p-2 rounded-lg text-[10px] font-black tracking-widest transition-colors ${isCurrent ? 'bg-white/10 border border-white/20' : 'opacity-50'}`}>
                                                <span className={isCurrent ? 'text-white' : 'text-white/40'}>{tier.label}</span>
                                                <span className={isCurrent ? 'text-gold' : 'text-white/40'}>{tier.pct} Dcto</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Botones de Tarjeta */}
                        <div className="space-y-3">
                            <button
                                id="btn-download-loyalty-card"
                                onClick={handleDownload}
                                disabled={isGenerating || !isAuthenticated}
                                className="w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95"
                                style={{
                                    background: isGenerating ? 'rgba(255,215,0,0.1)' : `linear-gradient(135deg, ${levelInfo.color}, #ffb700)`,
                                    color: '#001532',
                                    boxShadow: `0 10px 20px ${levelInfo.color}30`,
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

                            <button
                                disabled={!isAuthenticated}
                                onClick={() => {
                                    alert("Solicitud de tarjeta a domicilio en camino. Un asesor te contactará para el pago de los $25.000.");
                                }}
                                className="w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 bg-[#001532] border border-white/20 text-white/80 hover:bg-white/5 hover:border-gold/50 hover:text-gold disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                💳 Pedir Tarjeta Física a Domicilio ($25.000)
                            </button>
                        </div>

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
                            {displayOrders.map(order => (
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

                {/* MÉTODOS DE PAGO FAVORITOS */}
                {isAuthenticated && (
                    <div className="mt-16 glass-card p-8 border-t-4 border-t-blue-500 space-y-6">
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">🏦 Métodos de Pago Favoritos</h3>
                            <p className="text-sm text-white/50">Selecciona cómo prefieres pagar. Esto se reflejará en tus catálogos interactivos.</p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {['Bancolombia', 'Nequi', 'Wompi', 'PSE', 'PayPal', 'Payoneer'].map(method => {
                                const isSelected = user?.metodosPago?.includes(method);
                                return (
                                    <button
                                        key={method}
                                        onClick={() => {
                                            const current = user?.metodosPago || [];
                                            const next = isSelected ? current.filter(m => m !== method) : [...current, method];
                                            updatePaymentMethods(next);
                                        }}
                                        className={`px-5 py-3 rounded-xl text-xs font-black transition-all ${
                                            isSelected
                                            ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border-2 border-blue-400'
                                            : 'bg-white/5 text-white/60 border-2 border-transparent hover:bg-white/10'
                                        }`}
                                    >
                                        {isSelected ? '✓ ' : ''}{method}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* NUEVAS SECCIONES: TARJETAS DE REGALO Y OBRA SOCIAL */}
                <div className="mt-8 grid lg:grid-cols-2 gap-12">
                    
                    {/* TARJETAS DE REGALO */}
                    <div className="glass-card p-8 border-t-4 border-t-gold space-y-6">
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-1">🎁 Tarjetas Regalo</h3>
                            <p className="text-sm text-white/50">Genera códigos únicos de regalo para tus clientes o socios.</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {[50000, 100000, 500000, 1000000, 2000000].map(amount => (
                                <button
                                    key={amount}
                                    onClick={() => setSelectedGiftAmount(amount)}
                                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                        selectedGiftAmount === amount 
                                        ? 'bg-gold text-navy' 
                                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                                    }`}
                                >
                                    ${(amount / 1000).toFixed(0)}K
                                </button>
                            ))}
                        </div>

                        <button 
                            onClick={generateGiftCard}
                            className="w-full py-3 rounded-xl bg-[#89b4f8] text-navy font-black uppercase text-sm hover:bg-blue-400 transition-colors"
                        >
                            Generar Tarjeta de {formatPrice(selectedGiftAmount)}
                        </button>

                        {generatedCode && (
                            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-dashed border-[#89b4f8] text-center">
                                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Código Generado (Un Solo Uso)</p>
                                <p className="text-2xl font-mono text-white tracking-widest">{generatedCode}</p>
                            </div>
                        )}

                        {giftCards.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <p className="text-[10px] text-white/30 uppercase tracking-widest">Tus Tarjetas (Base de Datos Local)</p>
                                {giftCards.map((gc, i) => (
                                    <div key={i} className="flex justify-between items-center bg-black/20 p-2 rounded text-xs">
                                        <span className="font-mono text-gold">{gc.code}</span>
                                        <span className="text-white/60">{formatPrice(gc.amount)}</span>
                                        <span className={gc.used ? 'text-red-400' : 'text-green-400'}>{gc.used ? 'Usada' : 'Activa'}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* OBRA SOCIAL: COMPRA TU PETETE */}
                    <div className="glass-card p-8 border-t-4 border-t-[#ff6b6b] space-y-6">
                        <div>
                            <div className="inline-block px-3 py-1 bg-[#ff6b6b]/20 text-[#ff6b6b] border border-[#ff6b6b]/30 rounded-full text-[10px] font-black uppercase tracking-widest mb-3">
                                Obra Social
                            </div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">🧸 Compra tu Petete</h3>
                            <p className="text-sm text-white/70 leading-relaxed">
                                Llévate un llavero coleccionable por <strong>$15.000</strong>. <br/>
                                <span className="text-[#ff6b6b] font-bold">$10.000 de tu compra van directo a fundaciones de perritos y personas en condición de vulnerabilidad.</span>
                            </p>
                            <p className="text-xs text-gold mt-2 font-bold bg-gold/10 p-2 rounded-lg inline-block">
                                ¡Obtén 1% de DESCUENTO EXTRA en tu compra por apoyar!
                            </p>
                        </div>

                        <div className="grid grid-cols-5 gap-2 overflow-y-auto max-h-48 pr-2 custom-scrollbar">
                            {petetesEmojis.map((emoji, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => buyPetete(emoji)}
                                    className="aspect-square rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:border-[#ff6b6b] hover:scale-105 transition-all relative group overflow-hidden"
                                >
                                    <span className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity">
                                        {emoji}
                                    </span>
                                    <div className="absolute inset-0 bg-[#ff6b6b]/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-black uppercase text-center leading-tight">Comprar</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {user?.myPetetes && user.myPetetes.length > 0 && (
                            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                                <h4 className="text-sm font-black text-white uppercase">Tus Códigos de Descuento (1%)</h4>
                                <p className="text-[10px] text-white/50 bg-black/20 p-2 rounded leading-relaxed">
                                    ⚠️ <strong>IMPORTANTE:</strong> Los códigos no son acumulables. Solo puedes usar un (1) código por compra. Una vez usado, el código quedará invalidado permanentemente.
                                </p>
                                
                                <div className="space-y-2 mt-3">
                                    {user.myPetetes.map((petete, i) => (
                                        <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/10">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{petete.emoji}</span>
                                                <span className="font-mono font-bold text-white tracking-widest text-sm">{petete.code}</span>
                                            </div>
                                            <span className={`text-xs font-black uppercase tracking-widest px-2 py-1 rounded ${petete.used ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                                {petete.used ? 'USADO' : 'ACTIVO'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
            
        </main>
    );
}

