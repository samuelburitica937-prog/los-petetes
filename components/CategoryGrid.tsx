'use client';
import Link from 'next/link';
import { Category, CATEGORIES, getProductsByCategory } from '@/lib/data';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

const CATEGORY_IMAGES: Record<string, string> = {
    ferreteria: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=800&q=80',
    belleza: '/images/catalogos/belleza/cropped_Captura de pantalla 2026-03-24 143730.png',
    salud: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&q=80',
    hogar: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
    sexshop: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    petshop: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
    deportes: '/images/catalogos/deportes/cropped_Captura de pantalla 2026-03-24 151554.png',
    bebes: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
    electrodomesticos: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
    tecnologia: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
    papeleria: '/images/catalogos/papeleria/cropped_Captura de pantalla 2026-03-24 151419.png',
    escolar: '/images/escolar-premium.png',
    oficina: '/images/oficina-premium.png',
    horaloca: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    jugueteria: 'https://images.unsplash.com/photo-1532330393533-443990a51d10?w=800&q=80',
    all: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
};

const MAIN_CATS: (Category | 'all')[] = [
    'ferreteria', 'belleza', 'salud',
    'hogar', 'sexshop', 'petshop',
    'deportes', 'bebes', 'electrodomesticos',
    'tecnologia', 'papeleria', 'escolar',
    'oficina', 'horaloca', 'jugueteria', 'all',
];

export default function CategoryGrid() {
    return (
        <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto" id="categorias">
            <div className="text-center mb-8">
                <h2 className="text-4xl md:text-6xl font-dupla-black text-gold uppercase tracking-tighter mb-4">Nuestras Categorías</h2>
                <div className="h-1.5 w-32 bg-red mx-auto mb-6 rounded-full" />
                <p className="font-dupla-semibold text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    Distribución mayorista líder en todas las líneas de producto
                </p>
            </div>

            {/* Desktop Grid / Mobile Swiper */}
            <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {MAIN_CATS.map(cat => (
                    <CategoryItem key={cat} cat={cat} />
                ))}
            </div>

            {/* Mobile Only: Horizontal Swiper with freeMode */}
            <div className="md:hidden -mx-4 px-4">
                <Swiper
                    modules={[FreeMode]}
                    freeMode={true}
                    spaceBetween={12}
                    slidesPerView={2.4}
                    slidesOffsetBefore={0}
                    slidesOffsetAfter={16}
                    className="pb-4"
                >
                    {MAIN_CATS.map(cat => (
                        <SwiperSlide key={cat}>
                            <CategoryItem cat={cat} isMobile />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}

function CategoryItem({ cat, isMobile }: { cat: Category | 'all', isMobile?: boolean }) {
    const info = cat === 'all'
        ? { label: 'Ver Todas', icon: '🛒', color: '#FFD700', desc: 'Explore todo el catálogo' }
        : CATEGORIES[cat];
    const img = CATEGORY_IMAGES[cat] || CATEGORY_IMAGES.hogar;

    return (
        <Link
            href={cat === 'all' ? '/?cat=all' : `/categoria/${cat}`}
            className="category-card group relative block overflow-hidden rounded-3xl"
            style={{
                aspectRatio: '1',
            }}
        >
            <img
                src={img}
                alt={info.label}
                className="absolute inset-0 w-full h-full object-cover bg-white transition-transform duration-1000 group-hover:scale-125"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1586075010633-2470bbdb6ef8?w=800&q=80';
                }}
            />

            <div
                className="absolute inset-0 transition-all duration-700 opacity-80 group-hover:opacity-60"
                style={{
                    background: `linear-gradient(to top, rgba(0, 31, 63, 1) 0%, rgba(0, 31, 63, 0.4) 60%, transparent 100%)`
                }}
            />

            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-700"
                style={{ background: info.color }}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-end p-2 md:p-4 text-center z-20">
                <div className="mb-1 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                    <span className="text-2xl md:text-4xl">{info.icon}</span>
                </div>
                
                <h3
                    className={`font-dupla-black uppercase text-white mb-1 px-1 leading-[0.85] text-center w-full break-normal ${
                        info.label.length > 12 
                            ? 'text-[10px] md:text-sm lg:text-base tracking-[-0.05em]' 
                            : 'text-xs md:text-lg lg:text-xl tracking-tighter'
                    }`}
                    style={{ textShadow: '0 4px 15px rgba(0,0,0,0.9)' }}
                >
                    {info.label}
                </h3>
                
                {!isMobile && (
                    <div
                        className="w-8 h-1 my-1.5 bg-red rounded-full transition-all duration-500 group-hover:w-full group-hover:bg-gold shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                    />
                )}
                
                <span
                    className="text-[8px] md:text-[9px] font-dupla-black uppercase tracking-[0.2em] text-white/40 group-hover:text-gold transition-colors"
                >
                    [{getProductsByCategory(cat).length} PRODUCTOS]
                </span>
            </div>
            <div className="absolute inset-0 border-[2px] border-white/10 rounded-3xl group-hover:border-gold/30 transition-colors duration-500 pointer-events-none" />
        </Link>
    );
}
