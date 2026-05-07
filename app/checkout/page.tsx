'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/data';
import { useCartStore } from '@/lib/store';
import { useAuthStore } from '@/lib/auth';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const method = searchParams.get('method') || 'Nequi';
    const amountStr = searchParams.get('amount') || '0';
    const { total, totalItems, clearCart } = useCartStore();
    const { addOrder, isAuthenticated } = useAuthStore();
    const cartAmount = total();
    const amount = amountStr !== '0' ? parseInt(amountStr, 10) : cartAmount;

    const [status, setStatus] = useState<'loading' | 'sent' | 'approved'>('loading');

    useEffect(() => {
        // Simulate connecting to the payment gateway API
        const timer1 = setTimeout(() => {
            setStatus('sent');
            // Simulate the user accepting the push notification on their phone after 5 seconds
            const timer2 = setTimeout(() => {
                setStatus('approved');
                
                // Track order and clear cart
                if (amount > 0) {
                    const today = new Date();
                    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
                    addOrder({
                        id: 'PET-' + Math.floor(10000 + Math.random() * 90000),
                        fecha: formattedDate,
                        total: amount,
                        estado: 'En preparación',
                        items: totalItems() > 0 ? totalItems() : 1
                    });
                    clearCart();
                }
            }, 5000);
            return () => clearTimeout(timer2);
        }, 1500);

        return () => clearTimeout(timer1);
    }, [amount, addOrder, totalItems, clearCart]);

    const isNequi = method.toLowerCase() === 'nequi';
    const isBancolombia = method.toLowerCase() === 'bancolombia';

    const getThemeColors = () => {
        if (isNequi) return { bg: 'bg-[#1a0a21]', accent: 'text-[#d81b60]', button: 'bg-[#d81b60] text-white', border: 'border-[#d81b60]' };
        if (isBancolombia) return { bg: 'bg-[#fffdea]', accent: 'text-[#f5cd00]', button: 'bg-[#f5cd00] text-black', border: 'border-[#f5cd00]' };
        return { bg: 'bg-navy', accent: 'text-gold', button: 'bg-gold text-navy', border: 'border-gold' };
    };

    const theme = getThemeColors();

    return (
        <main className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${theme.bg}`}>
            <div className="glass-card p-8 w-full max-w-md text-center border-t-4 shadow-2xl relative overflow-hidden" style={{ borderTopColor: isNequi ? '#d81b60' : isBancolombia ? '#f5cd00' : '#FFD700' }}>
                
                <div className="mb-8">
                    <h1 className={`text-3xl font-black uppercase tracking-tighter ${theme.accent}`}>
                        Pasarela {method}
                    </h1>
                    <p className="text-white/60 mt-2 text-sm">Simulación de integración Push API</p>
                </div>

                <div className="text-5xl font-black text-white mb-8">
                    {formatPrice(amount)}
                </div>

                {status === 'loading' && (
                    <div className="animate-fade-in flex flex-col items-center">
                        <div className={`w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mb-4 ${theme.border}`}></div>
                        <p className="text-white/80 font-medium">Conectando con {method}...</p>
                    </div>
                )}

                {status === 'sent' && (
                    <div className="flex flex-col items-center animate-fade-in">
                        <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 relative">
                            <span className="text-4xl">📱</span>
                            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">¡Revisa tu celular!</h2>
                        <p className="text-white/70 text-sm mb-6">
                            Hemos enviado una notificación PUSH a tu app de {method}. <br/>
                            Abre la notificación para autorizar el pago por {formatPrice(amount)}.
                        </p>
                        <div className="w-full bg-white/5 rounded-full h-2 mb-2 overflow-hidden">
                            <div className={`h-full ${theme.button.split(' ')[0]} animate-[loading_5s_ease-in-out_forwards]`}></div>
                        </div>
                        <p className="text-xs text-white/40">Esperando autorización del usuario...</p>
                    </div>
                )}

                {status === 'approved' && (
                    <div className="flex flex-col items-center animate-fade-in">
                        <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 border-2 border-green-500">
                            <span className="text-4xl">✓</span>
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2">¡Pago Aprobado!</h2>
                        <p className="text-white/70 text-sm mb-8">
                            La transacción fue autorizada exitosamente desde tu celular. Tu pedido en Los Petetes ya está siendo procesado.
                        </p>
                        <Link href="/pedidos" className={`px-8 py-3 rounded-xl font-black uppercase tracking-widest transition-all hover:scale-105 ${theme.button}`}>
                            Ver mis pedidos
                        </Link>
                    </div>
                )}
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes loading {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out forwards;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}} />
        </main>
    );
}

export default function CheckoutSimulatorPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-navy flex items-center justify-center text-gold">Cargando pasarela...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
