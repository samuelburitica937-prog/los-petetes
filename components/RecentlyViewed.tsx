'use client';
import { useRecentStore, useWishlistStore } from '@/lib/store';
import ProductCard from './ProductCard';
import { ALL_PRODUCTS } from '@/lib/data';

export default function RecentlyViewed() {
    const products = useRecentStore(s => s.products);
    const wishlistIds = useWishlistStore(s => s.ids);
    const favoriteProducts = ALL_PRODUCTS.filter(p => wishlistIds.includes(p.id));

    if (products.length === 0 && favoriteProducts.length === 0) return null;

    return (
        <section className="py-10 px-4 md:px-8 max-w-7xl mx-auto" id="recientes">
            {products.length > 0 && (
                <>
                    <div className="flex items-center gap-4 mb-10 mt-12">
                        <div className="p-3 rounded-2xl bg-gold/10 text-2xl">⏳</div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-dupla-black text-white uppercase tracking-tighter">Vistos Recientemente</h2>
                            <div className="h-1 w-24 bg-gold rounded-full mt-2" />
                        </div>
                    </div>
                    <div className="overflow-x-auto pb-2">
                        <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
                            {products.slice(0, 8).map(product => (
                                <div key={product.id} className="w-48 md:w-56 flex-shrink-0">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {favoriteProducts.length > 0 && (
                <>
                    <div className="flex items-center gap-4 mb-10 mt-16">
                        <div className="p-3 rounded-2xl bg-red-500/10 text-2xl">❤️</div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-dupla-black text-white uppercase tracking-tighter">Tus Favoritos Pendientes</h2>
                            <p className="text-white/50 text-sm mt-1">Productos que te gustaron y podrías querer llevar hoy.</p>
                            <div className="h-1 w-24 bg-red-500 rounded-full mt-2" />
                        </div>
                    </div>
                    <div className="overflow-x-auto pb-2">
                        <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
                            {favoriteProducts.slice(0, 8).map(product => (
                                <div key={product.id} className="w-48 md:w-56 flex-shrink-0 border-2 border-red-500/20 rounded-xl overflow-hidden relative">
                                    <ProductCard product={product} />
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
