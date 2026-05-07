'use client';

import { useState, useEffect } from 'react';

const MESSAGES = [
    { text: 'Una ferretería en Pereira acaba de comprar 50 unidades de', item: 'Martillo De Goma' },
    { text: 'Distribuidora El Sol añadió a su carrito', item: 'Kit De Belleza Pro' },
    { text: 'Alguien en Manizales aprovechó la oferta en', item: 'Reloj Inteligente Ultra' },
    { text: 'Últimas 12 cajas disponibles de', item: 'Audífonos Inalámbricos' },
];

export default function SocialProof() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Random intervals between 5s and 15s
        const showPopup = () => {
            setCurrentIndex(prev => (prev + 1) % MESSAGES.length);
            setIsVisible(true);
            
            setTimeout(() => {
                setIsVisible(false);
            }, 4000); // hide after 4s
            
            setTimeout(showPopup, Math.random() * 10000 + 5000);
        };
        
        const timeout = setTimeout(showPopup, 3000); // first popup after 3s
        return () => clearTimeout(timeout);
    }, []);

    if (!isVisible) return null;

    const msg = MESSAGES[currentIndex];

    return (
        <div className="fixed bottom-6 left-6 z-50 animate-fade-in pointer-events-none">
            <div className="bg-navy/95 border border-gold/30 rounded-xl p-4 shadow-2xl flex items-center gap-4 max-w-xs backdrop-blur-md">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-xl shrink-0 border border-gold/40">
                    ⚡
                </div>
                <div>
                    <p className="text-[10px] text-white/60 uppercase font-bold tracking-tight leading-tight mb-1">
                        {msg.text}
                    </p>
                    <p className="text-xs text-gold font-black">
                        {msg.item}
                    </p>
                </div>
            </div>
        </div>
    );
}
