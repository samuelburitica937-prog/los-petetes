'use client';

import { useAuthStore } from '@/lib/auth';
import { CATEGORIES } from '@/lib/data';


import Link from 'next/link';
import { useCartStore, useRecentStore, useWishlistStore } from '@/lib/store';
import { ALL_PRODUCTS } from '@/lib/data';

export default function CatalogosPage() {
    const { user } = useAuthStore();
    const cartItems = useCartStore(s => s.items);
    const recentProducts = useRecentStore(s => s.products);
    const wishlistIds = useWishlistStore(s => s.ids);
    
    // Determine implicit interests based on session
    const sessionCategoryCounts: Record<string, number> = {};
    const addWeight = (category: string, weight: number) => {
        sessionCategoryCounts[category] = (sessionCategoryCounts[category] || 0) + weight;
    };

    // Weight from profile
    const userInterests = user?.intereses || [];
    userInterests.forEach(cat => addWeight(cat, 5));

    // Weight from cart (high intent)
    cartItems.forEach(item => addWeight(item.product.categoria, 10));

    // Weight from wishlist
    wishlistIds.forEach(id => {
        const product = ALL_PRODUCTS.find(p => p.id === id);
        if (product) addWeight(product.categoria, 3);
    });

    // Weight from recent views
    recentProducts.forEach(product => addWeight(product.categoria, 1));

    // Sort categories by score descending
    const sortedCategories = Object.entries(CATEGORIES)
        .map(([key, cat]) => ({ key, cat, score: sessionCategoryCounts[key] || 0 }))
        .sort((a, b) => b.score - a.score);

    // Get the top 2-4 categories with a score > 0, or just fallback to top 2 if everything is 0
    let topCount = sortedCategories.filter(c => c.score > 0).length;
    topCount = Math.max(2, Math.min(topCount, 4));

    const priorityCategories = sortedCategories.slice(0, topCount).map(c => [c.key, c.cat] as const);
    const otherCategories = sortedCategories.slice(topCount).map(c => [c.key, c.cat] as const);

    return (
        <main className="min-h-screen bg-navy flex flex-col pt-32">
            
            
            <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-black mb-4 text-white uppercase tracking-tighter">
                        Explorar <span className="text-gold">Catálogos</span>
                    </h1>
                    <p className="text-white/60 text-lg">Encuentra los mejores productos mayoristas para tu negocio</p>
                </div>

                {/* PRIORIDAD - GRANDES */}
                {priorityCategories.length > 0 && (
                    <div className="mb-16">
                        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gold/10 border border-gold/30 text-gold font-black text-xs uppercase tracking-widest">
                            🌟 Recomendados para ti
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {priorityCategories.map(([key, cat]) => (
                                <Link href={`/categoria/${key}`} key={key} className="block group">
                                    <div className="relative aspect-video md:aspect-[16/7] rounded-3xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:border-gold/50">
                                        {/* Background gradient based on category color */}
                                        <div 
                                            className="absolute inset-0 opacity-20 transition-opacity duration-500 group-hover:opacity-40"
                                            style={{ background: `radial-gradient(circle at top right, ${cat.color}, transparent 70%)` }}
                                        />
                                        
                                        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-transparent" />
                                        
                                        <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                            <div className="flex items-center gap-4 mb-3">
                                                <span className="text-4xl">{cat.icon}</span>
                                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-gold transition-colors">{cat.label}</h2>
                                            </div>
                                            <p className="text-white/60 text-sm max-w-md">Descubre los productos más rentables para tu nicho. Clic para explorar.</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* OTROS CATÁLOGOS - PEQUEÑOS */}
                <div>
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/5 border border-white/10 text-white/50 font-black text-xs uppercase tracking-widest">
                        📦 Todo el inventario
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {otherCategories.map(([key, cat]) => (
                            <Link href={`/categoria/${key}`} key={key} className="block group">
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/30 group-hover:-translate-y-1">
                                    <span className="text-4xl block mb-3 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">{cat.icon}</span>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-tight line-clamp-2">{cat.label}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>

            
        </main>
    );
}
