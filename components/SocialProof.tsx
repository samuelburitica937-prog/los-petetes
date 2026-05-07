'use client';

import { useState, useEffect } from 'react';
import { ALL_PRODUCTS } from '@/lib/data';

const ACTIONS = [
    'Una ferretería en Pereira acaba de comprar 50 unidades de',
    'Distribuidora El Sol añadió a su carrito',
    'Alguien en Manizales aprovechó la oferta en',
    'Últimas 12 cajas disponibles de',
    'Un cliente en Armenia está viendo'
];

export default function SocialProof() {
    const [currentMsg, setCurrentMsg] = useState({ text: '', item: '' });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const showPopup = () => {
            const randomAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
            const randomProduct = ALL_PRODUCTS[Math.floor(Math.random() * ALL_PRODUCTS.length)].nombre;
            
            setCurrentMsg({ text: randomAction, item: randomProduct });
            setIsVisible(true);
            
            setTimeout(() => {
                setIsVisible(false);
            }, 4000); // hide after 4s
            
            setTimeout(showPopup, Math.random() * 10000 + 5000);
        };
        
        const timeout = setTimeout(showPopup, 3000); // first popup after 3s
        return () => clearTimeout(timeout);
    }, []);

    if (!isVisible || !currentMsg.text) return null;

    return (
        <div className="fixed bottom-6 left-6 z-50 animate-fade-in pointer-events-none">
            <div className="bg-navy/95 border border-gold/30 rounded-xl p-4 shadow-2xl flex items-center gap-4 max-w-xs backdrop-blur-md">
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-xl shrink-0 border border-gold/40">
                    ⚡
                </div>
                <div>
                    <p className="text-[10px] text-white/60 uppercase font-bold tracking-tight leading-tight mb-1">
                        {currentMsg.text}
                    </p>
                    <p className="text-xs text-gold font-black line-clamp-1">
                        {currentMsg.item}
                    </p>
                </div>
            </div>
        </div>
    );
}
