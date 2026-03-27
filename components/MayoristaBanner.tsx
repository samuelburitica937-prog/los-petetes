'use client';
import { useState, useEffect, useRef } from 'react';
import { FEATURED_PRODUCTS, getProductsByCategory, CATEGORIES, Category } from '@/lib/data';
import ProductCard from './ProductCard';
import Link from 'next/link';

const CATEGORY_KEYS: Category[] = Object.keys(CATEGORIES) as Category[];

export default function MayoristaBanner() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % CATEGORY_KEYS.length);
                setIsAnimating(false);
            }, 500);
        }, 7000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const currentCatKey = CATEGORY_KEYS[currentIndex];
    const catData = CATEGORIES[currentCatKey];
    const products = getProductsByCategory(currentCatKey).slice(0, 6);

    return (
        <section
            className="py-24 px-4 md:px-8 relative overflow-hidden bg-navy min-h-[900px] flex items-center"
            style={{ 
                borderTop: '1px solid rgba(255,215,0,0.1)',
                borderBottom: '1px solid rgba(255,215,0,0.1)'
            }}
        >
            {/* dynamic background pulse */}
            <div 
                className="absolute inset-0 opacity-20 blur-[120px] transition-colors duration-1000"
                style={{ background: `radial-gradient(circle at 50% 50%, ${catData.color}40 0%, transparent 70%)` }}
            />
            
            <div className="max-w-[1600px] mx-auto relative z-10 w-full">
                <div className={`transition-all duration-700 ${isAnimating ? 'opacity-0 translate-y-4 filter blur-sm' : 'opacity-100 translate-y-0'}`}>
                    {/* Banner header */}
                    <div className="text-center mb-16">
                        <div
                            className="inline-flex items-center gap-3 px-6 py-2 rounded-full mb-8 text-[10px] font-dupla-black tracking-[0.4em] uppercase shadow-2xl"
                            style={{ background: 'rgba(0,0,0,0.4)', border: `1.5px solid ${catData.color}40`, color: catData.color }}
                        >
                            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: catData.color }} />
                            SOLO MAYORISTA · {catData.label.toUpperCase()}
                        </div>
                        
                        <h2
                            className="font-dupla-black leading-[0.85] mb-6 tracking-tighter text-white"
                            style={{ fontSize: 'clamp(3rem, 10vw, 7rem)' }}
                        >
                            Los <span className="font-dupla-black-italic text-gold">Petetes</span> <br />
                            <span style={{ color: catData.color }}>{catData.label}</span>
                        </h2>
                        
                        <p className="text-xl md:text-2xl font-dupla-semibold mb-12 text-white/60 max-w-3xl mx-auto leading-tight">
                            {catData.desc}. Los mejores márgenes del Eje Cafetero.
                        </p>

                        {/* Category Progress Bar */}
                        <div className="flex justify-center gap-2 mb-16">
                            {CATEGORY_KEYS.map((key, i) => (
                                <div 
                                    key={key} 
                                    className="h-1 rounded-full transition-all duration-300" 
                                    style={{ 
                                        width: i === currentIndex ? '40px' : '12px',
                                        backgroundColor: i === currentIndex ? catData.color : 'rgba(255,255,255,0.1)'
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Dashboard Style Stats */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 max-w-6xl mx-auto">
                        {[
                            { label: 'Categoría', value: catData.label, sub: 'Sección Activa', icon: catData.icon },
                            { label: 'Oportunidad', value: '65%', sub: 'Profit Margin', icon: '💰' },
                            { label: 'Stock', value: products.length + '+', sub: 'Refs Disponibles', icon: '📦' },
                            { label: 'Logística', value: '24h', sub: 'Despacho Local', icon: '🚚' },
                        ].map((stat, i) => (
                            <div key={i} className="glass-card p-6 flex flex-col items-center text-center group hover:scale-105 transition-transform duration-500">
                                <span className="text-4xl mb-4 transition-transform group-hover:scale-110 duration-500">{stat.icon}</span>
                                <div className="text-xs font-dupla-black text-white/40 uppercase tracking-widest mb-1">{stat.label}</div>
                                <div className="text-2xl font-dupla-black text-white">{stat.value}</div>
                                <div className="text-[10px] font-dupla-bold text-white/20 uppercase mt-2">{stat.sub}</div>
                            </div>
                        ))}
                    </div>

                    {/* Products grid focus */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16 px-4">
                        {products.map((product, i) => (
                            <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>

                    {/* Bottom Action */}
                    <div className="text-center">
                        <Link
                            href={`/?cat=${currentCatKey}`}
                            className="inline-flex items-center gap-4 px-12 py-6 bg-white text-navy font-dupla-black rounded-2xl transition-all hover:scale-110 shadow-2xl uppercase tracking-widest text-lg group"
                        >
                            Ver Todo {catData.label}
                            <span className="transition-transform group-hover:translate-x-2">→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
