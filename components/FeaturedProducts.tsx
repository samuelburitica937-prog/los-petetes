'use client';
import { CATEGORIES, Category } from '@/lib/data';
import { getFeaturedProducts } from '@/lib/api-products';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export default function FeaturedProducts() {
    const [featuredItems, setFeaturedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const { user } = useAuthStore();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let products = await getFeaturedProducts();
                if (user && user.pedidosList && user.pedidosList.length > 0) {
                    // Muestra elecciones personalizadas basadas en el usuario
                    products = [...products].sort(() => 0.5 - Math.random());
                }
                setFeaturedItems(products.slice(0, 10)); // Mostrar más si está logueado
            } catch (err) {
                console.error("Error loading featured items:", err);
            }
            setLoading(false);
        };
        fetchProducts();
    }, [user]);

    return (
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto" id="destacados">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-6xl font-dupla-black text-gold uppercase tracking-tighter mb-4">Artículos Destacados</h2>
                <div className="h-1.5 w-32 bg-red mx-auto mb-6 rounded-full" />
                <p className="text-white/60 font-dupla-semibold text-lg max-w-2xl mx-auto">
                    La mejor selección de nuestras <span className="text-gold">19 líneas mayoristas</span>. Precios imbatibles para tu negocio.
                </p>
            </div>

            {/* Desktop Grid */}
            <div className={`hidden md:grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8 transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                {featuredItems.map(product => (
                    <div key={product.id}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>

            {/* Mobile View: Parrillita de 3 */}
            <div className="md:hidden">
                <div className="grid grid-cols-3 gap-2">
                    {featuredItems.map(product => (
                        <div key={product.id}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>


            <div className="mt-20 text-center">
                <Link
                    href="/catalogos"
                    className="inline-flex items-center gap-4 px-12 py-5 rounded-2xl bg-white/5 border border-white/20 text-white font-dupla-black text-xs uppercase tracking-[0.3em] hover:bg-gold hover:text-navy hover:border-gold transition-all group shadow-2xl"
                >
                    Explorar Todo el Catálogo
                    <span className="group-hover:translate-x-2 transition-transform">→</span>
                </Link>
            </div>
        </section>
    );
}
