'use client';
import { CATEGORIES, Category, getProductsByCategory } from '@/lib/data';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { useMemo, useState, useEffect, useRef } from 'react';

// Optimized category section to show only one featured product
const CategorySection = ({ id, info }: { id: string; info: any }) => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    const products = useMemo(() => {
        return getProductsByCategory(id as Category).slice(0, 1); // Only 1 featured product
    }, [id]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        }, { rootMargin: '200px' });
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const glowColor = info.color || '#FFD700';

    return (
        <section
            id={`section-${id}`}
            ref={sectionRef}
            className="py-12 px-4 md:px-8 relative overflow-hidden"
            style={{
                background: `radial-gradient(circle at 50% 50%, ${glowColor}03 0%, transparent 70%)`
            }}
        >
            {/* Glow Effect */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] blur-[120px] opacity-10 pointer-events-none"
                style={{ backgroundColor: glowColor }}
            />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-3xl">{info.icon}</span>
                            <span
                                className="text-[10px] font-dupla-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border"
                                style={{ color: glowColor, borderColor: `${glowColor}40` }}
                            >
                                Artículo Destacado
                            </span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-dupla-black text-white uppercase tracking-tighter">
                            Línea <span className="font-dupla-black-italic" style={{ color: glowColor }}>{info.label}</span>
                        </h2>
                    </div>
                    <Link
                        href={`/categoria/${id}`}
                        className="group flex items-center gap-2 px-6 py-3 rounded-xl font-dupla-black text-xs transition-all border-2"
                        style={{ color: glowColor, borderColor: `${glowColor}30` }}
                    >
                        CATÁLOGO COMPLETO
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>

                <div className="flex justify-center">
                    <div className="w-full max-w-[280px]">
                        {isVisible ? (
                            products.map(product => (
                                <div key={product.id} className="transition-transform hover:scale-[1.02]">
                                    <ProductCard product={product} />
                                </div>
                            ))
                        ) : (
                            <div className="aspect-[3/4] w-full rounded-2xl bg-white/5 animate-pulse" />
                        )}
                    </div>
                </div>

                {/* Mobile call to action */}
                <div className="mt-8 md:hidden">
                    <Link
                        href={`/categoria/${id}`}
                        className="block w-full text-center py-4 rounded-xl font-dupla-black text-sm border-2"
                        style={{ color: glowColor, borderColor: `${glowColor}30` }}
                    >
                        EXPLORAR CATEGORÍA
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default function CategorySections() {
    // Show all 14 categories with one featured product each
    const mainCategories = [
        'ferreteria', 'belleza', 'salud', 'hogar',
        'sexshop', 'petshop', 'tecnologia', 'electrodomesticos',
        'deportes', 'bebes', 'papeleria', 'escolar',
        'oficina', 'horaloca'
    ] as Category[];

    return (
        <div className="bg-navy divide-y divide-white/5">
            {mainCategories.map(cat => (
                <CategorySection key={cat} id={cat} info={CATEGORIES[cat]} />
            ))}
        </div>
    );
}
