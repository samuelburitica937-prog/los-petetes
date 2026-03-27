'use client';
import { useRecentStore } from '@/lib/store';
import ProductCard from './ProductCard';

export default function RecentlyViewed() {
    const products = useRecentStore(s => s.products);
    if (products.length === 0) return null;

    return (
        <section className="py-10 px-4 md:px-8 max-w-7xl mx-auto" id="recientes">
            <div className="flex items-center gap-4 mb-10">
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
        </section>
    );
}
