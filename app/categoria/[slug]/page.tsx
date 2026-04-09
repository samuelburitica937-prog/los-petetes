'use client';
import { useParams, useRouter } from 'next/navigation';
import { Category, CATEGORIES, formatPrice, ALL_PRODUCTS } from '@/lib/data';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import RecentlyViewed from '@/components/RecentlyViewed';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import CartSidebar from '@/components/CartSidebar';
import { Suspense, useState, useMemo } from 'react';
import { generateCatalogPDF } from '@/lib/pdf-utils';
import toast from 'react-hot-toast';

export default function CategoryPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as Category;
    const catInfo = CATEGORIES[slug];
    
    // Filtros de Segmentación
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1000000);
    const [sortBy, setSortBy] = useState<'pop' | 'price-asc' | 'price-desc'>('pop');

    const products = useMemo(() => {
        let items = ALL_PRODUCTS.filter(p => p.categoria === slug);
        
        // Aplicar filtros
        items = items.filter(p => p.precioMayorista >= minPrice && p.precioMayorista <= maxPrice);
        
        // Aplicar orden
        if (sortBy === 'price-asc') items.sort((a, b) => a.precioMayorista - b.precioMayorista);
        if (sortBy === 'price-desc') items.sort((a, b) => b.precioMayorista - a.precioMayorista);
        if (sortBy === 'pop') items.sort((a, b) => b.vendidos - a.vendidos);
        
        return items;
    }, [slug, minPrice, maxPrice, sortBy]);

    if (!catInfo) {
        return <div className="min-h-screen bg-navy flex items-center justify-center text-white font-black">CATEGORÍA NO ENCONTRADA</div>;
    }

    return (
        <main className="bg-navy min-h-screen">
            <Header />
            <CartSidebar />

            <div style={{ paddingTop: '160px' }} className="pb-20">
                {/* Dynamic Category Hero with Segmented UI */}
                <div className="px-4 md:px-8 max-w-7xl mx-auto mb-16">
                    <div
                        className="relative rounded-[40px] overflow-hidden p-12 md:p-20 border-2 shadow-[0_0_80px_rgba(0,0,0,0.5)] group transition-all duration-700"
                        style={{ 
                            borderColor: `${catInfo.color}30`,
                            background: `linear-gradient(135deg, ${catInfo.color}15 0%, #001f3f 100%)`
                        }}
                    >
                        {/* Interactive Sparkles / Particles background effect */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-1000" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                        
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                            <div className="flex-1 text-center md:text-left">
                                <span 
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 bg-white/5 border border-white/10"
                                    style={{ color: catInfo.color }}
                                >
                                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: catInfo.color }} />
                                    Segmento Especializado
                                </span>
                                
                                <h1 className="text-6xl md:text-8xl font-black text-white uppercase tracking-tighter mb-6 leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                                    {catInfo.label}
                                </h1>
                                
                                <p className="text-white/40 text-xl max-w-xl font-medium mb-10 leading-relaxed">
                                    {catInfo.desc}. Soluciones mayoristas premium para tu negocio con garantía **Los Petetes**.
                                </p>
                                
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Items</p>
                                        <p className="text-2xl font-black text-white">{products.length}</p>
                                    </div>
                                    <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                                        <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Desde</p>
                                        <p className="text-2xl font-black" style={{ color: catInfo.color }}>{formatPrice(Math.min(...products.map(p => p.precioMayorista), 0))}</p>
                                    </div>
                                    
                                    <button 
                                        onClick={() => {
                                            toast.promise(
                                                generateCatalogPDF(slug as string, products.map(p => ({
                                                    nombre: p.nombre,
                                                    referencia: p.id,
                                                    descripcion: p.descripcion,
                                                    precioMayorista: p.precioMayorista,
                                                    precioSugerido: p.precio,
                                                    unidadMinima: p.minMayorista,
                                                    disponible: p.stock > 0,
                                                    imagenes: p.imagenes,
                                                }))),
                                                {
                                                    loading: 'Generando catálogo PDF visual...',
                                                    success: '¡Catálogo descargado!',
                                                    error: 'Error al generar el catálogo.',
                                                }
                                            );
                                        }}
                                        className="px-6 py-3 rounded-2xl bg-gold text-navy font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform flex items-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.3)]"
                                    >
                                        📄 Descargar PDF
                                    </button>
                                </div>
                            </div>
                            
                            <div 
                                className="w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center text-[120px] md:text-[160px] relative transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6"
                                style={{ background: `radial-gradient(circle, ${catInfo.color}20 0%, transparent 70%)` }}
                            >
                                {catInfo.icon}
                                {/* Neon ring */}
                                <div className="absolute inset-0 rounded-full border-4 border-dashed animate-spin-slow opacity-20" style={{ borderColor: catInfo.color }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Segmented Catalog Layout */}
                <div className="px-4 md:px-8 max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-4 gap-12">
                    
                    {/* Sidebar Filters (Segmentation Control) */}
                    <aside className="lg:col-span-1 space-y-8">
                        <section className="glass-card p-8 border-gold/10">
                            <h3 className="text-xs font-black text-gold uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                                🏮 Segmentación
                                <span className="h-px flex-1 bg-white/5" />
                            </h3>
                            
                            <div className="space-y-8">
                                {/* Price Slider */}
                                <div>
                                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-4">Rango de Precio (Mayorista)</label>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="500000" 
                                        step="5000"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-gold"
                                    />
                                    <div className="flex justify-between mt-3 text-[10px] font-bold text-gold">
                                        <span>$0</span>
                                        <span className="bg-gold/10 px-2 py-0.5 rounded text-xs">{formatPrice(maxPrice)}</span>
                                    </div>
                                </div>

                                {/* Sorting */}
                                <div className="space-y-3">
                                    <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Ordenar por</label>
                                    {[
                                        { id: 'pop', label: 'Más Vendidos' },
                                        { id: 'price-asc', label: 'Menor Precio' },
                                        { id: 'price-desc', label: 'Mayor Precio' }
                                    ].map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setSortBy(opt.id as any)}
                                            className={`w-full text-left px-5 py-3 rounded-xl text-xs font-black uppercase tracking-tighter transition-all border ${
                                                sortBy === opt.id 
                                                    ? 'bg-gold border-gold text-navy shadow-[0_10px_20px_rgba(255,215,0,0.15)]' 
                                                    : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </section>

                        <div className="p-8 rounded-3xl bg-gradient-to-br from-gold/5 to-navy border border-gold/10 text-center">
                            <span className="text-4xl block mb-4">💎</span>
                            <p className="font-black text-white text-sm uppercase mb-2">Soporte Aliados</p>
                            <p className="text-[10px] text-white/40 mb-6 font-medium">Asesoría personalizada para pedidos a gran escala en {catInfo.label}.</p>
                            <button className="w-full py-3 bg-gold text-navy text-[10px] font-black rounded-xl uppercase hover:scale-105 active:scale-95 transition-transform">Contactar Experto</button>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div className="lg:col-span-3">
                        {products.length === 0 ? (
                            <div className="h-96 flex flex-col items-center justify-center text-center space-y-6">
                                <span className="text-6xl grayscale opacity-20">🔎</span>
                                <div>
                                    <p className="text-white font-black text-xl uppercase">Sin resultados en este rango</p>
                                    <p className="text-white/40 text-sm">Prueba ajustando los filtros de segmentación.</p>
                                </div>
                                <button onClick={() => {setMaxPrice(1000000); setMinPrice(0)}} className="px-8 py-3 bg-white/5 text-gold text-xs font-black border border-gold/20 rounded-xl uppercase">Reiniciar Filtros</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in-up">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <RecentlyViewed />
            <Footer />
            <FloatingWhatsApp />
        </main>
    );
}
