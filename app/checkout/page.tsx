'use client';
import { useCartStore } from '@/lib/store';
import { formatPrice } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
    const { items, total, totalItems, clearCart } = useCartStore();
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (mounted && items.length === 0) {
            router.push('/');
        }
    }, [items, router, mounted]);

    if (!mounted) return null;

    const discount = totalItems() >= 100 ? 0.15 : totalItems() >= 50 ? 0.10 : totalItems() >= 20 ? 0.05 : 0;
    const finalTotal = total() * (1 - discount);

    const [isRedirecting, setIsRedirecting] = useState(false);
    const [redirectMethod, setRedirectMethod] = useState('');

    const handlePayment = async (method: string) => {
        setRedirectMethod(method);
        setIsRedirecting(true);
        
        // Simulación de respuesta de pasarela (Wompi/PayU)
        setTimeout(() => {
            setIsRedirecting(false);
            toast.success('¡Pago procesado con éxito!');
            clearCart();
            router.push('/pedidos');
        }, 5000); // 5 seconds for immersive redirection
    };

    if (isRedirecting) {
        return (
            <div className="fixed inset-0 z-[100] bg-navy flex flex-col items-center justify-center text-center p-8 overflow-hidden">
                {/* Background glow animation */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/10 rounded-full blur-[150px] animate-pulse" />
                
                <div className="relative z-10 glass-card p-12 max-w-xl w-full border-2 border-gold/30 shadow-[0_0_100px_rgba(255,215,0,0.2)]">
                    {/* Pulsing Bank Logos */}
                    <div className="flex justify-center gap-8 mb-12 animate-bounce-subtle">
                        <img src="https://seeklogo.com/images/W/wompi-logo-D3A635AE96-seeklogo.com.png" className="h-10" alt="Wompi" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/1/1a/Bancolombia_logo.svg" className="h-10" alt="Bancolombia" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Nequi_logo.svg" className="h-8" alt="Nequi" />
                    </div>

                    <div className="relative mb-8">
                        <div className="w-24 h-24 border-8 border-gold/20 border-t-gold rounded-full animate-spin mx-auto" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-gold font-black text-xl">🔒</span>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">
                        Conectando con <span className="text-gold">{redirectMethod}</span>
                    </h2>
                    
                    <p className="text-white/60 font-medium mb-8">
                        Estamos estableciendo una conexión segura con tu entidad bancaria para procesar tu pedido mayorista por <span className="text-white font-bold">{formatPrice(finalTotal)}</span>.
                    </p>

                    <div className="space-y-4">
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gold animate-progress-fast" />
                        </div>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">No cierres esta ventana</p>
                    </div>

                    {/* Progress details */}
                    <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 gap-4 text-left">
                        <div>
                            <p className="text-[8px] font-black text-white/30 uppercase mb-1">Cifrado</p>
                            <p className="text-[10px] text-white font-bold">AES-256 BANK GRADE</p>
                        </div>
                        <div>
                            <p className="text-[8px] font-black text-white/30 uppercase mb-1">Estado</p>
                            <p className="text-[10px] text-gold font-bold animate-pulse">AUTENTICANDO...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-navy pt-32">
            <Header />
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Summary & Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="glass-card p-8">
                            <h2 className="text-2xl font-black text-gold uppercase tracking-tighter mb-6">📦 Resumen del Pedido Mayorista</h2>
                            <div className="space-y-4">
                                {items.map(item => (
                                    <div key={item.product.id} className="flex justify-between items-center py-3 border-b border-white/5">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-12 bg-white/5 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                                                <img 
                                                    src={item.product.imagenes?.[0]} 
                                                    className="w-full h-full object-cover transition-transform hover:scale-110" 
                                                    alt="" 
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-bold text-white text-sm truncate">{item.product.nombre}</p>
                                                <p className="text-xs text-white/40">{item.quantity} unidades x {formatPrice(item.product.precioMayorista)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right ml-4">
                                            <span className="font-black text-gold block">{formatPrice(item.product.precioMayorista * item.quantity)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="glass-card p-8 group hover:border-gold/30 transition-all duration-500">
                            <h2 className="text-2xl font-black text-gold uppercase tracking-tighter mb-6 flex items-center gap-3">
                                👤 Datos de Facturación
                                <span className="h-px flex-1 bg-white/10" />
                            </h2>
                            {!isAuthenticated ? (
                                <div className="p-8 bg-gold/5 border-2 border-dashed border-gold/20 rounded-3xl text-center space-y-6">
                                    <div className="text-5xl">🔒</div>
                                    <div>
                                        <p className="text-white font-black text-lg mb-2">Acceso Restringido</p>
                                        <p className="text-white/40 text-sm max-w-sm mx-auto">Debes autenticar tu cuenta mayorista para acceder a las pasarelas de pago bancarias.</p>
                                    </div>
                                    <button 
                                        onClick={() => router.push('/login')} 
                                        className="btn-primary px-12 py-4 shadow-[0_0_30px_rgba(255,215,0,0.1)]"
                                    >
                                        Iniciar Sesión / Registrarse
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Nombre / Empresa</label>
                                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 text-white font-black text-lg shadow-inner">{user?.nombre}</div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Correo Electrónico</label>
                                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 text-white font-black text-lg shadow-inner">{user?.email}</div>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right: Payment Sidebar */}
                    <div className="space-y-6">
                        <div className="glass-card p-8 sticky top-32 border-2 border-gold/20 shadow-2xl shadow-gold/5 overflow-hidden">
                            {/* Decorative corner accent */}
                            <div className="absolute -top-12 -right-12 w-24 h-24 bg-gold/10 blur-3xl rounded-full" />
                            
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8 flex items-center justify-between">
                                Total a Pagar
                                <span className="text-[10px] px-2 py-1 bg-gold/10 text-gold rounded border border-gold/20">COP</span>
                            </h3>
                            
                            <div className="space-y-4 mb-10">
                                <div className="flex justify-between text-white/40 text-sm font-bold">
                                    <span>Subtotal Pedido</span>
                                    <span>{formatPrice(total())}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between items-center py-2 px-3 bg-green-500/10 rounded-xl border border-green-500/20">
                                        <span className="text-green-500 text-xs font-black uppercase tracking-tight">Descuento Mayorista ({discount * 100}%)</span>
                                        <span className="text-green-500 font-black">-{formatPrice(total() * discount)}</span>
                                    </div>
                                )}
                                <div className="pt-6 border-t border-white/5 flex flex-col gap-1">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Valor Neto Final</span>
                                        <span className="text-4xl font-black text-gold leading-none tracking-tighter drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                                            {formatPrice(finalTotal)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-px flex-1 bg-white/5" />
                                    <p className="text-[9px] font-black text-white/30 text-center uppercase tracking-[0.3em]">Pasarelas Seguras</p>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>
                                
                                <button
                                    onClick={() => handlePayment('Wompi')}
                                    disabled={!isAuthenticated}
                                    className="w-full py-5 rounded-2xl bg-gold text-navy font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-gold/20 disabled:opacity-30 disabled:grayscale disabled:hover:scale-100"
                                >
                                    <span className="text-xl">🏦</span>
                                    BANCOLOMBIA / WOMPI
                                </button>
                                
                                <button
                                    onClick={() => handlePayment('Nequi/Daviplata')}
                                    disabled={!isAuthenticated}
                                    className="w-full py-5 rounded-2xl bg-[#FF1493] text-white font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-pink-500/20 disabled:opacity-30 disabled:grayscale disabled:hover:scale-100"
                                >
                                    <span className="text-xl">📱</span>
                                    NEQUI / DAVIPLATA
                                </button>

                                <div className="pt-8 text-center">
                                    <div className="flex items-center justify-center gap-6 opacity-40 mb-6 group-hover:opacity-100 transition-opacity">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" className="h-3" alt="Visa" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-5" alt="Mastercard" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c3/Nequi_logo.svg" className="h-5" alt="Nequi" />
                                    </div>
                                    <div className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
                                        <span className="text-[8px] text-white/40 uppercase font-black tracking-widest">🔒 Cifrado Bancario 256 bits</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
