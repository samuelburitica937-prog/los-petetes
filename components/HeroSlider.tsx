'use client';
import { useEffect, useRef, useState } from 'react';
import { HERO_SLIDES, getProductsByCategory, getCurrentCampaign } from '@/lib/data';
import Link from 'next/link';

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const timeRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
    
    // Get the dynamic campaign based on current date
    const campaign = getCurrentCampaign();

    const goTo = (idx: number) => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrent(idx);
        setTimeout(() => setIsAnimating(false), 600);
    };

    const next = () => goTo((current + 1) % HERO_SLIDES.length);
    const prev = () => goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

    useEffect(() => {
        timeRef.current = setInterval(next, 7000);
        return () => clearInterval(timeRef.current);
    }, [current]);

    const slide = HERO_SLIDES[current];

    return (
        <section className="bg-navy pt-6 pb-12 px-4 md:px-8">
            <div className="max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-6">
                
                {/* Main Action Banner (8 columns) */}
                <div 
                    className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-2xl group border border-white/5"
                    style={{ height: 'min(35vh, 580px)', minHeight: '220px' }}
                >
                    {/* Background images container */}
                    <div className="absolute inset-0 z-0">
                        {HERO_SLIDES.map((s, i) => {
                            const products = getProductsByCategory(s.category as any);
                            const bgImg = products.length > 0 ? products[0].imagenes[0] : 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80';

                            return (
                                <div
                                    key={s.id}
                                    className={`absolute inset-0 transition-all duration-1000 ease-in-out ${i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                                >
                                    <img
                                        src={bgImg}
                                        alt={s.tag}
                                        className="w-full h-full object-cover"
                                        style={{ filter: 'brightness(0.5) saturate(1.1)' }}
                                    />
                                    {/* Glass Overlay for Text Area */}
                                    <div className="absolute inset-y-0 left-0 w-full md:w-2/3 bg-gradient-to-r from-navy via-navy/40 to-transparent z-10" />
                                </div>
                            );
                        })}
                    </div>

                    <div className="relative z-20 flex flex-col justify-center h-full p-8 md:p-16 max-w-2xl text-left">
                        <div 
                            key={`tag-${current}`}
                            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-dupla-black mb-6 animate-fade-in uppercase tracking-[0.2em]"
                            style={{ background: slide.accent + '20', border: `1.5px solid ${slide.accent}50`, color: slide.accent }}
                        >
                            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                            {slide.tag}
                        </div>

                        <h1 
                            key={`title-${current}`}
                            className="text-4xl md:text-6xl lg:text-7xl font-dupla-black text-white leading-[0.9] mb-6 animate-fade-in tracking-tighter"
                            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
                        >
                            {slide.title.split(' ').map((word, i) => (
                                <span key={i} className={i === 0 ? 'text-gold font-dupla-black-italic block mb-2' : 'inline-block mr-3'}>
                                    {word}
                                </span>
                            ))}
                        </h1>

                        <p className="text-lg md:text-xl text-white/70 font-dupla-semibold mb-10 max-w-lg leading-relaxed animate-fade-in">
                            {slide.subtitle}
                        </p>

                        <div className="flex flex-wrap gap-4 animate-fade-in">
                            <Link
                                href={`/?cat=${slide.category}`}
                                className="px-10 py-4 bg-gold text-navy font-dupla-black rounded-xl transition-all hover:scale-105 shadow-xl shadow-gold/20 uppercase tracking-widest text-sm"
                            >
                                {slide.cta}
                            </Link>
                            <Link
                                href="/registro"
                                className="px-10 py-4 bg-white/5 border border-white/20 text-white font-dupla-black rounded-xl transition-all hover:bg-white/10 backdrop-blur-md uppercase tracking-widest text-sm"
                            >
                                Ser Distribuidor
                            </Link>
                            <button
                                onClick={() => {
                                    alert('Preparando tu catálogo PDF...');
                                    // Aquí luego lo conectamos con la función real
                                }}
                                className="px-10 py-4 bg-red-600/20 border border-red-500/50 text-white font-dupla-black rounded-xl transition-all hover:bg-red-600/40 backdrop-blur-md uppercase tracking-widest text-sm flex items-center gap-2"
                            >
                                📄 Catálogo PDF
                            </button>
                        </div>

                    </div>

                    {/* Navigation Mini */}
                    <div className="absolute bottom-8 right-8 z-30 flex items-center gap-4 bg-navy/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl">
                        <button onClick={prev} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M15 18l-6-6 6-6" /></svg>
                        </button>
                        <div className="flex gap-1.5">
                            {HERO_SLIDES.map((_, i) => (
                                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-gold' : 'w-2 bg-white/20'}`} />
                            ))}
                        </div>
                        <button onClick={next} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-white">
                            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 18l6-6-6-6" /></svg>
                        </button>
                    </div>
                </div>

                {/* Side Focus Cards (4 columns) */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    {/* Dynamic Seasonal Campaign Card */}
                    <Link 
                        href={campaign.category === 'all' ? '/?cat=all' : `/categoria/${campaign.category}`} 
                        className="flex-1 rounded-3xl overflow-hidden relative group border border-white/5 shadow-xl"
                    >
                        <div 
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                            style={{ backgroundImage: `url('${campaign.image}')` }} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent opacity-100" />
                        <div className="relative z-10 h-full flex flex-col justify-end p-8">
                            <div 
                                className="inline-flex items-center gap-2 mb-3 font-dupla-black tracking-[0.4em] uppercase text-[11px]" 
                                style={{ 
                                    color: campaign.accent,
                                    textShadow: '0 2px 10px rgba(0,0,0,0.5)'
                                }}
                            >
                                <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                                {campaign.tag}
                            </div>
                            <h3 
                                className="text-4xl md:text-5xl font-dupla-black leading-[0.85] uppercase mb-4 tracking-tighter"
                                style={{ 
                                    filter: 'drop-shadow(0 12px 12px rgba(0,0,0,0.4))',
                                    textShadow: '2px 2px 0px rgba(0,0,0,0.2)'
                                }}
                            >
                                {campaign.title.split(' ').map((word, i) => (
                                    <span key={i} className={i % 2 !== 0 ? 'block font-dupla-black-italic text-gold' : 'block'}>
                                        {word}
                                    </span>
                                ))}
                            </h3>
                            <p 
                                className="text-sm font-dupla-semibold text-white/80 mb-6 max-w-[220px] leading-tight"
                                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
                            >
                                {campaign.subtitle}
                            </p>
                            <div className="w-14 h-14 rounded-full flex items-center justify-center text-navy transition-all group-hover:scale-110 group-hover:rotate-12 shadow-[0_0_30px_rgba(255,215,0,0.3)]" style={{ backgroundColor: campaign.accent }}>
                                <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>
                    </Link>

                    {/* Bottom Split Cards */}
                    <div className="grid grid-cols-2 gap-6 h-[220px]">
                        <Link href="/faq" className="rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-6 text-center hover:bg-white/10 transition-all group">
                            <div className="text-3xl mb-3 transition-transform group-hover:-translate-y-1">💬</div>
                            <div className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-1">Dudas?</div>
                            <div className="text-sm font-bold text-white uppercase italic">Preguntas</div>
                        </Link>
                        <Link href="/envios" className="rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-6 text-center hover:bg-white/10 transition-all group">
                            <div className="text-3xl mb-3 transition-transform group-hover:-translate-y-1">🚚</div>
                            <div className="text-[10px] font-black text-gold uppercase tracking-[0.2em] mb-1">País</div>
                            <div className="text-sm font-bold text-white uppercase italic">Envíos</div>
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}
