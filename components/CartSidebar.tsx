'use client';
import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '@/lib/store';
import { useAuthStore } from '@/lib/auth';
import { formatPrice, getProductQtyConfig, getLevelInfo } from '@/lib/data';
import { generateQuotePDF } from '@/lib/pdf-utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CartSidebar() {
    const { items, isOpen, closeCart, removeItem, updateQty, total, totalItems, clearCart } = useCartStore();
    const router = useRouter();
    const overlayRef = useRef<HTMLDivElement>(null);
    const [peteteCode, setPeteteCode] = useState('');
    const [peteteApplied, setPeteteApplied] = useState(false);
    
    const { user, usePetete } = useAuthStore();
    
    // Derived from auth store
    const availablePetetes = user?.myPetetes?.filter(p => !p.used).map(p => p.code) || [];
    const usedPetetes = user?.myPetetes?.filter(p => p.used).map(p => p.code) || [];
    
    const [showPSEModal, setShowPSEModal] = useState(false);
    
    const pseBanks = [
        { name: 'Bancolombia', url: 'https://www.bancolombia.com/personas' },
        { name: 'Nequi', url: 'https://www.nequi.com.co/' },
        { name: 'Daviplata', url: 'https://daviplata.com/' },
        { name: 'Banco Davivienda', url: 'https://www.davivienda.com/' },
        { name: 'Banco de Bogotá', url: 'https://www.bancodebogota.com/' },
        { name: 'Banco Agrario', url: 'https://www.bancoagrario.gov.co/' },
        { name: 'BBVA Colombia', url: 'https://www.bbva.com.co/' },
        { name: 'Scotiabank Colpatria', url: 'https://www.scotiabankcolpatria.com/' },
        { name: 'Banco Falabella', url: 'https://www.bancofalabella.com.co/' },
        { name: 'Banco de Occidente', url: 'https://www.bancodeoccidente.com.co/' },
        { name: 'Banco Popular', url: 'https://www.bancopopular.com.co/' },
        { name: 'Banco Caja Social', url: 'https://www.bancocajasocial.com/' },
        { name: 'Lulo Bank', url: 'https://www.lulobank.com/' },
        { name: 'RappiPay', url: 'https://www.rappipay.co/' },
        { name: 'Banco AV Villas', url: 'https://www.bancoavvillas.com.co/' },
        { name: 'Itaú', url: 'https://www.itau.co/' },
        { name: 'Banco Pichincha', url: 'https://www.bancopichincha.com.co/' }
    ];

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleCheckout = () => {
        if (items.length === 0) {
            toast.error('El carrito está vacío');
            return;
        }
        closeCart();
        router.push('/checkout');
    };

    const handlePayment = (method: string) => {
        if (method === 'PSE') {
            setShowPSEModal(true);
            return;
        }
        
        toast.loading(`Redirigiendo a ${method}...`);
        setTimeout(() => {
            closeCart();
            router.push('/checkout');
        }, 1500);
    };

    const handleBankRedirect = (bankName: string, bankUrl?: string) => {
        toast.loading(`Conectando con ${bankName}...`);
        setTimeout(() => {
            closeCart();
            toast.success(`Abriendo portal de ${bankName}`);
            if (bankUrl) {
                window.open(bankUrl, '_blank');
            } else {
                // Fallback si no hay URL (Paypal/Payoneer mock)
                router.push('/checkout');
            }
        }, 1500);
    };

    const baseDiscount = totalItems() >= 100 ? 0.15 : totalItems() >= 50 ? 0.10 : totalItems() >= 20 ? 0.05 : 0;
    const discount = peteteApplied ? baseDiscount + 0.01 : baseDiscount;
    const finalTotal = total() * (1 - discount);

    const handleApplyPetete = () => {
        if (peteteCode && availablePetetes.includes(peteteCode)) {
            setPeteteApplied(true);
            usePetete(peteteCode);
            setPeteteCode('');
            toast.success('¡Código Petete aplicado! Tienes 1% extra.');
        } else {
            toast.error('Selecciona un código Petete válido');
        }
    };

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    ref={overlayRef}
                    className="sidebar-overlay"
                    onClick={closeCart}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`cart-sidebar ${isOpen ? 'open' : ''}`}
                role="dialog"
                aria-label="Carrito de compras"
                aria-modal="true"
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-5 py-4 sticky top-0"
                    style={{ background: '#001428', borderBottom: '2px solid rgba(255,215,0,0.2)' }}
                >
                    <div>
                        <h2 className="font-black text-lg" style={{ color: '#FFD700' }}>🛒 Carrito Mayorista</h2>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{totalItems()} artículos</p>
                    </div>
                    <button
                        onClick={closeCart}
                        className="w-9 h-9 flex items-center justify-center rounded-full cursor-pointer transition-all"
                        style={{ background: 'rgba(255,0,0,0.15)', color: '#FF0000', border: '1px solid rgba(255,0,0,0.3)' }}
                        aria-label="Cerrar carrito"
                    >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-4 py-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="text-6xl mb-4">🛒</div>
                            <p className="font-bold text-lg mb-2" style={{ color: '#FFD700' }}>¡Carrito vacío!</p>
                            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                Agrega productos mayoristas para comenzar tu pedido
                            </p>
                            <button
                                onClick={() => {
                                    closeCart();
                                    router.push('/catalogos');
                                }}
                                className="btn-primary px-6 py-2 text-sm"
                            >
                                Explorar Catálogo
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {items.map(({ product, quantity }) => (
                                <div
                                    key={product.id}
                                    className="flex gap-3 p-3 rounded-xl"
                                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.1)' }}
                                >
                                    <img
                                        src={product.imagenes?.[0] || (product as any).imagen || 'https://placehold.co/100'}
                                        alt={product.nombre}
                                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm leading-tight truncate" style={{ color: 'white' }}>
                                            {product.nombre}
                                        </p>
                                        <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                            Min. {product.minMayorista} uds
                                        </p>
                                        {/* Qty controls */}
                                        <div className="flex items-center justify-between">
                                            <div
                                                className="flex items-center rounded-lg overflow-hidden"
                                                style={{ border: '1px solid rgba(255,215,0,0.25)' }}
                                            >
                                                <button
                                                    onClick={() => {
                                                        const { min, step } = getProductQtyConfig(product);
                                                        updateQty(product.id, quantity - step);
                                                    }}
                                                    className="px-2 py-1 text-sm font-bold cursor-pointer transition-colors hover:bg-yellow-400/10"
                                                    style={{ color: '#FFD700' }}
                                                >−</button>
                                                <span className="px-2 text-sm font-bold" style={{ color: 'white' }}>{quantity}</span>
                                                <button
                                                    onClick={() => {
                                                        const { step } = getProductQtyConfig(product);
                                                        updateQty(product.id, quantity + step);
                                                    }}
                                                    className="px-2 py-1 text-sm font-bold cursor-pointer transition-colors hover:bg-yellow-400/10"
                                                    style={{ color: '#FFD700' }}
                                                >+</button>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-black text-sm" style={{ color: '#FFD700' }}>
                                                    {formatPrice(product.precioMayorista * quantity)}
                                                </div>
                                                <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                                    {formatPrice(product.precioMayorista)} c/u
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeItem(product.id)}
                                        className="self-start w-6 h-6 flex items-center justify-center rounded-full cursor-pointer flex-shrink-0"
                                        style={{ background: 'rgba(255,0,0,0.15)', color: '#FF0000' }}
                                        aria-label="Eliminar"
                                    >
                                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                            <path d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div
                        className="px-5 py-4 sticky bottom-0"
                        style={{ background: '#001428', borderTop: '2px solid rgba(255,215,0,0.2)' }}
                    >
                        {/* Discount */}
                        {discount > 0 && (
                            <div
                                className="flex items-center justify-between px-3 py-2 rounded-lg mb-3 text-sm"
                                style={{ background: 'rgba(0,200,100,0.15)', border: '1px solid rgba(0,200,100,0.3)' }}
                            >
                                <span style={{ color: '#00C864' }}>🎉 Descuento mayorista {(discount * 100).toFixed(0)}%</span>
                                <span className="font-bold" style={{ color: '#00C864' }}>-{formatPrice(total() * discount)}</span>
                            </div>
                        )}

                        {/* Volume discount info */}
                        {discount === 0 && (
                            <div
                                className="text-xs px-3 py-2 rounded-lg mb-3"
                                style={{ background: 'rgba(255,215,0,0.08)', color: 'rgba(255,215,0,0.7)' }}
                            >
                                💡 +20 uds → 5% | +50 uds → 10% | +100 uds → 15% descuento
                            </div>
                        )}

                        <div className="flex justify-between mb-1">
                            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Subtotal:</span>
                            <span className="font-semibold" style={{ color: 'white' }}>{formatPrice(total())}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between mb-1">
                                <span style={{ color: '#00C864' }}>Descuento:</span>
                                <span className="font-semibold" style={{ color: '#00C864' }}>-{formatPrice(total() * discount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between mb-2 border-b border-white/5 pb-4">
                            <span className="font-bold text-lg" style={{ color: '#FFD700' }}>Total a pagar:</span>
                            <span className="font-black text-xl" style={{ color: '#FFD700' }}>{formatPrice(finalTotal)}</span>
                        </div>
                        
                        {/* Gamification del Total */}
                        <div className="flex flex-col gap-1 mb-4">
                            <div className="text-[10px] font-black text-pink-500 bg-pink-500/10 px-3 py-1.5 rounded border border-pink-500/20 flex justify-between items-center mb-1">
                                <span>🪙 Petete Coins Acumuladas</span>
                                <span className="text-xs">+{Math.floor(finalTotal / 50000)} Puntos</span>
                            </div>
                            {[2000000, 5000000, 10000000, 20000000].map(threshold => {
                                const tierInfo = getLevelInfo(threshold);
                                const currentLoyalty = user ? getLevelInfo(user.totalCompras || 1700000).descuento : 0;
                                if (tierInfo.descuento <= currentLoyalty) return null;
                                
                                const totalWithTierDiscount = finalTotal * (1 - tierInfo.descuento);
                                return (
                                    <div key={tierInfo.nivel} className="text-xs font-bold text-white/50 bg-white/5 px-3 py-1.5 rounded border border-white/10 flex justify-between items-center">
                                        <span>Si fueras <span style={{ color: tierInfo.color }}>{tierInfo.nivel}</span></span>
                                        <span>Pagarías <span className="text-white">{formatPrice(totalWithTierDiscount)}</span></span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Delivery Option */}
                        <div className="mb-6 text-xs">
                            <div className="font-bold text-white/50 mb-2 uppercase tracking-widest text-[9px]">📍 Método de Entrega</div>
                            <select className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-gold appearance-none font-bold">
                                <option className="bg-navy">📦 Envío Nacional (Transportadora)</option>
                                <option className="bg-navy">🏪 Recoger en Sede Manizales (Principal)</option>
                                <option className="bg-navy">🏪 Recoger en Sede Pereira (En 45 min)</option>
                                <option className="bg-navy">🏪 Recoger en Sede Armenia</option>
                            </select>
                        </div>

                        {/* Petete Code Input */}
                        <div className="mb-4">
                            {!peteteApplied && availablePetetes.length > 0 && (
                                <div className="flex gap-2 mb-2">
                                    <select 
                                        value={peteteCode}
                                        onChange={(e) => setPeteteCode(e.target.value)}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-gold appearance-none"
                                    >
                                        <option value="" disabled className="bg-navy">Tus Llaves Petete Disponibles...</option>
                                        {availablePetetes.map(code => (
                                            <option key={code} value={code} className="bg-navy">🔑 {code} (1% extra)</option>
                                        ))}
                                    </select>
                                    <button 
                                        onClick={handleApplyPetete}
                                        disabled={!peteteCode}
                                        className="bg-gold text-navy font-bold px-3 py-2 rounded-xl text-xs hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Aplicar
                                    </button>
                                </div>
                            )}
                            
                            {!peteteApplied && availablePetetes.length === 0 && (
                                <div className="text-center mb-2">
                                    <p className="text-[10px] text-white/40 italic">No tienes llaves Petete disponibles.</p>
                                </div>
                            )}

                            {/* Mostrar códigos usados explícitamente */}
                            {usedPetetes.length > 0 && (
                                <div className="mt-2 space-y-1">
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Códigos Petete Usados</p>
                                    <div className="flex gap-2 flex-wrap">
                                        {usedPetetes.map(code => (
                                            <div key={code} className="px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-[10px] text-green-500 flex items-center gap-1">
                                                <span>✓</span> {code}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Professional Checkout Action */}
                        <div className="space-y-3 mb-6">
                            <button
                                onClick={handleCheckout}
                                className="w-full flex items-center justify-center gap-3 px-4 py-5 rounded-2xl font-black text-lg transition-all hover:scale-[1.03] cursor-pointer shadow-2xl shadow-gold/20"
                                style={{ background: '#FFD700', color: '#001F3F' }}
                            >
                                💳 FINALIZAR COMPRA
                            </button>

                            {showPSEModal ? (
                                <div className="mt-4 p-4 rounded-xl border border-blue-400/30 animate-fade-in relative" style={{ background: 'rgba(79, 195, 247, 0.05)' }}>
                                    <button 
                                        onClick={() => setShowPSEModal(false)}
                                        className="absolute -top-3 right-2 bg-navy border border-white/10 rounded-full px-3 py-1 text-[10px] font-black text-white/50 hover:text-white transition-colors"
                                    >
                                        Volver
                                    </button>
                                    <h4 className="text-xs font-black text-[#4FC3F7] uppercase mb-4 flex items-center gap-2">
                                        🏛️ Selecciona tu banco PSE
                                    </h4>
                                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {pseBanks.map(bank => (
                                            <button
                                                key={bank.name}
                                                onClick={() => handleBankRedirect(bank.name, bank.url)}
                                                className="w-full text-left px-3 py-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#4FC3F7]/50 text-xs font-bold text-white transition-all flex justify-between items-center group"
                                            >
                                                {bank.name}
                                                <span className="opacity-0 group-hover:opacity-100 text-[#4FC3F7] transition-opacity">→</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-[10px] text-center text-white/30 uppercase font-black tracking-widest mt-4">O paga directo vía:</p>

                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleBankRedirect('Bancolombia', 'https://www.bancolombia.com/personas')}
                                            className="flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] transition-all hover:scale-[1.02] cursor-pointer hover:shadow-[0_0_15px_rgba(255,215,0,0.4)] border border-yellow-400/20"
                                            style={{ background: '#FFD700', color: '#001F3F' }}
                                        >
                                            🏦 BANCOLOMBIA
                                        </button>
                                        <button
                                            onClick={() => handleBankRedirect('Nequi', 'https://www.nequi.com.co/')}
                                            className="flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] transition-all hover:scale-[1.02] cursor-pointer hover:shadow-[0_0_15px_rgba(255,20,147,0.5)] border border-pink-500/30"
                                            style={{ background: '#FF1493', color: 'white' }}
                                        >
                                            📱 NEQUI
                                        </button>
                                        <button
                                            onClick={() => handlePayment('PSE')}
                                            className="flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] transition-all hover:scale-[1.02] cursor-pointer border border-blue-400/30 hover:shadow-[0_0_15px_rgba(79,195,247,0.3)]"
                                            style={{ background: 'rgba(79, 195, 247, 0.1)', color: '#4FC3F7' }}
                                            title="Otros bancos con PSE"
                                        >
                                            🏛️ PAGO PSE
                                        </button>
                                        <button
                                            onClick={() => handleBankRedirect('PayPal', 'https://www.paypal.com/')}
                                            className="flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] transition-all hover:scale-[1.02] cursor-pointer border border-blue-600/30 hover:shadow-[0_0_15px_rgba(0,121,193,0.3)]"
                                            style={{ background: 'rgba(0, 48, 135, 0.2)', color: '#0079C1' }}
                                        >
                                            P PAYPAL
                                        </button>
                                        <button
                                            onClick={() => handleBankRedirect('Payoneer', 'https://www.payoneer.com/')}
                                            className="flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] transition-all hover:scale-[1.02] cursor-pointer border border-orange-400/30 hover:shadow-[0_0_15px_rgba(255,69,0,0.3)] col-span-2"
                                            style={{ background: 'rgba(255, 69, 0, 0.1)', color: '#FF4500' }}
                                        >
                                            🟠 PAYONEER
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Trust Badges */}
                        <div className="flex items-center justify-center gap-4 py-3 bg-white/5 rounded-xl border border-white/10 mb-4 text-[10px] font-bold text-white/50 uppercase">
                            <span className="flex items-center gap-1"><svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" /></svg> PAGOS SSL</span>
                            <span className="flex items-center gap-1"><svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" /></svg> 100% SEGURO</span>
                        </div>

                        <button
                            onClick={() => {
                                toast.promise(
                                    new Promise((resolve) => {
                                        setTimeout(() => {
                                            generateQuotePDF(items, finalTotal, user);
                                            resolve(true);
                                        }, 1000);
                                    }),
                                    {
                                        loading: 'Generando cotización...',
                                        success: '¡Cotización descargada!',
                                        error: 'Error al generar PDF',
                                    }
                                );
                            }}
                            className="w-full flex items-center justify-center gap-2 py-3 mb-3 rounded-xl font-black text-sm transition-all hover:bg-white/10 border-2 border-dashed border-white/20 cursor-pointer"
                            style={{ color: '#FFD700' }}
                        >
                            📄 DESCARGAR COTIZACIÓN PDF
                        </button>

                        <button
                            onClick={clearCart}
                            className="w-full py-2 text-xs font-black rounded-lg cursor-pointer transition-all hover:text-red-500 uppercase tracking-tighter"
                            style={{ color: 'rgba(255,255,255,0.2)', background: 'transparent' }}
                        >
                            🗑 VACIAR TODO EL CARRITO
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}
