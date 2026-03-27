'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function InfoBanners() {
    const [isTopVisible, setIsTopVisible] = useState(false);
    const [isBottomVisible, setIsBottomVisible] = useState(false);

    const topRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.target === topRef.current && entry.isIntersecting) setIsTopVisible(true);
                if (entry.target === bottomRef.current && entry.isIntersecting) setIsBottomVisible(true);
            });
        }, { threshold: 0.2 });

        if (topRef.current) observer.observe(topRef.current);
        if (bottomRef.current) observer.observe(bottomRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <section className="w-full flex flex-col">
            {/* Top Banner - Wholesale (Los Petetes) */}
            <div ref={topRef} className="relative w-full py-48 overflow-hidden group">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] group-hover:scale-105"
                    style={{ 
                        backgroundImage: "url('/images/wholesale-bg.jpg')",
                        backgroundAttachment: 'scroll'
                    }}
                />

                {/* Dark Blue Gradient Overlay - Adjusted for better background visibility */}
                <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#030B2E]/85 via-[#0A1024]/70 to-[#151F3D]/75" />

                {/* Yellow accent line on the right, matching the reference screenshot area */}
                <div className="absolute top-0 right-0 bottom-0 w-1 bg-[#FFD700] z-10 opacity-60 shadow-[0_0_15px_rgba(255,215,0,0.5)]" />

                <div className={`relative z-20 flex flex-col items-center justify-center h-full px-4 text-center text-white transition-all duration-1000 ${isTopVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="mb-6 px-4 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold font-dupla-black text-[10px] uppercase tracking-[0.4em]">
                        Ventaja Competitiva
                    </div>
                    <h2 className="text-3xl md:text-5xl lg:text-7xl font-dupla-black tracking-tighter max-w-5xl leading-[0.85] mb-10 uppercase" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
                        ¿Por qué comprar al <span className="font-dupla-black-italic text-gold italic">por mayor</span> es el mejor bien para tu negocio?
                    </h2>
                    <Link
                        href="/mayoristas"
                        className="group relative px-12 py-5 overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 shadow-2xl"
                    >
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-all duration-300" />
                        <span className="relative z-10 flex items-center gap-3 font-dupla-black text-sm text-white uppercase tracking-widest">
                            Descubre los beneficios
                            <span className="text-gold transition-transform duration-300 group-hover:translate-x-2">→</span>
                        </span>
                    </Link>
                </div>
            </div>

            {/* Bottom Banner - Tarjeta Cliente */}
            <div ref={bottomRef} className="relative w-full py-48 overflow-hidden bg-navy group">
                {/* Small, non-invasive holographic card in background */}
                <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[60%] h-full opacity-40 pointer-events-none group-hover:opacity-60 transition-all duration-1000 transform rotate-[-8deg] scale-110">
                    <img 
                        src="/images/petetes-card-bg-v3.png" 
                        alt="Tarjeta Fondo" 
                        className="w-full h-full object-contain"
                    />
                </div>

                {/* Precise Metallic Overlay requested: Yellow to Blue @ 37% Opacity */}
                <div 
                    className="absolute inset-0 z-10 pointer-events-none" 
                    style={{ 
                        background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.37) 0%, rgba(0, 45, 94, 0.37) 50%, rgba(0, 31, 63, 0.37) 100%)',
                    }} 
                />

                <div className={`relative z-20 flex flex-col items-start justify-center h-full px-8 md:px-20 transition-all duration-1000 ${isBottomVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    {/* Glass Container to protect text and highlight the button */}
                    <div className="max-w-xl p-10 md:p-14 rounded-[3rem] bg-navy/60 backdrop-blur-2xl border border-white/10 shadow-2xl">
                        <div className="mb-6 inline-flex px-4 py-1.5 rounded-full bg-gold/10 border border-gold/40 text-gold font-dupla-black text-[10px] uppercase tracking-[0.4em]">
                            Club Exclusivo · Los Petetes
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-dupla-black tracking-tighter text-white uppercase italic mb-6 leading-[0.85]">
                            Consigue tu <br />
                            <span className="text-gold">Tarjeta Cliente</span>
                        </h2>
                        <p className="text-lg md:text-xl font-dupla-semibold text-white/80 mb-10 leading-relaxed max-w-sm">
                            Únete al círculo mayorista más grande del Eje Cafetero. Accede a precios de fábrica inmediatos.
                        </p>
                        <Link
                            href="/registro"
                            className="inline-block px-12 py-5 rounded-2xl bg-gold text-navy font-dupla-black text-lg uppercase tracking-[0.2em] transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl border-none hover:bg-gold-light"
                        >
                            Solicitar Beneficios
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

