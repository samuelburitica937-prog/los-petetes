'use client';
import { useState, useMemo, useEffect } from 'react';
import { ALL_PRODUCTS, CATEGORIES, Category, Product } from '@/lib/data';
import { getProductsByCategory } from '@/lib/api-products';
import ProductCard from './ProductCard';
import Fuse from 'fuse.js';
import { useSearchParams } from 'next/navigation';

const ITEMS_PER_PAGE = 24;

interface Props {
    categoryId?: Category | 'all';
    title?: string;
}

export default function ProductsSection({ categoryId, title }: Props) {
    const searchParams = useSearchParams();
    const searchParam = searchParams.get('search');

    const [activeCategory, setActiveCategory] = useState<Category | 'all'>(categoryId || 'all');
    const [sortBy, setSortBy] = useState<'relevancia' | 'precio-asc' | 'precio-desc' | 'stock' | 'rating'>('relevancia');
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (categoryId) setActiveCategory(categoryId);
    }, [categoryId]);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const data = await getProductsByCategory(activeCategory);
                setProducts(data);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
            setLoading(false);
        };
        fetchItems();
    }, [activeCategory]);

    const fuse = useMemo(() => new Fuse(products.length > 0 ? products : ALL_PRODUCTS, {
        keys: ['nombre', 'categoria', 'tags', 'descripcion'],
        threshold: 0.4,
    }), [products]);

    const filteredProducts = useMemo(() => {
        let items = searchParam
            ? fuse.search(searchParam).map(r => r.item)
            : products;
        
        // If we are searching but have no DB results yet or searchParam specifically needs initial data
        if (searchParam && items.length === 0 && products.length === 0) {
            items = fuse.search(searchParam).map(r => r.item);
        }

        switch (sortBy) {
            case 'precio-asc': items = [...items].sort((a, b) => a.precioMayorista - b.precioMayorista); break;
            case 'precio-desc': items = [...items].sort((a, b) => b.precioMayorista - a.precioMayorista); break;
            case 'stock': items = [...items].sort((a, b) => b.stock - a.stock); break;
            case 'rating': items = [...items].sort((a, b) => b.rating - a.rating); break;
        }
        return items;
    }, [activeCategory, searchParam, sortBy, fuse, products]);

    const currentProducts = useMemo(() => {
        return filteredProducts.slice(0, page * ITEMS_PER_PAGE);
    }, [filteredProducts, page]);

    return (
        <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-black text-yellow-500 uppercase tracking-tighter">
                        {title || (searchParam ? `Buscando: ${searchParam}` : CATEGORIES[activeCategory as Category]?.label || 'Catálogo Completo')}
                    </h2>
                    <p className="text-sm font-bold text-white/40">{filteredProducts.length} Artículos en esta sección</p>
                </div>

                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black text-white/30 uppercase">Ordenar por:</span>
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as any)}
                        className="bg-navy-light px-4 py-2 rounded-lg text-sm font-bold text-yellow-400 border border-white/10 outline-none cursor-pointer"
                    >
                        <option value="relevancia">Relevancia</option>
                        <option value="precio-asc">Precio Menor</option>
                        <option value="precio-desc">Precio Mayor</option>
                        <option value="stock">Más Stock</option>
                    </select>
                </div>
            </div>

            {loading && products.length === 0 ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
            ) : currentProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <span className="text-6xl mb-4">🔍</span>
                    <h3 className="text-2xl font-black text-white">No hay productos en esta sección</h3>
                    <p className="text-white/40">Intenta con otra categoría o término de búsqueda</p>
                </div>
            ) : (
                <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 transition-opacity duration-500 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                    {currentProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {currentProducts.length < filteredProducts.length && (
                <div className="mt-12 text-center">
                    <button
                        onClick={() => setPage(p => p + 1)}
                        className="px-12 py-4 rounded-xl bg-yellow-400 text-navy font-black text-sm hover:scale-105 transition-all cursor-pointer shadow-xl shadow-yellow-400/20"
                    >
                        MOSTRAR MÁS PRODUCTOS (+{filteredProducts.length - currentProducts.length})
                    </button>
                </div>
            )}
        </section>
    );
}
