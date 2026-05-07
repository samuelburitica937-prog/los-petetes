'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Fuse from 'fuse.js';
import { ALL_PRODUCTS, Product, formatPrice, CATEGORIES, Category } from '@/lib/data';

const fuse = new Fuse(ALL_PRODUCTS, {
    keys: [
        { name: 'nombre', weight: 1.5 },
        { name: 'tags', weight: 1.0 },
    ],
    threshold: 0.1, // Extreme precision
    ignoreLocation: true, // Don't favor the start, find the word anywhere
    includeScore: true,
    useExtendedSearch: true,
    minMatchCharLength: 1, // For short words like 'perro', require more consistency
});

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [matchedCats, setMatchedCats] = useState<Category[]>([]);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const trQuery = query.trim().toLowerCase();
        if (trQuery.length < 1) { 
            setResults([]); 
            setMatchedCats([]);
            setOpen(false); 
            return; 
        }

        // Search products
        const r = fuse.search(trQuery).slice(0, 5).map(r => r.item);
        setResults(r);

        // Search categories
        const cats = (Object.keys(CATEGORIES) as Category[]).filter(c => 
            CATEGORIES[c].label.toLowerCase().includes(trQuery) || 
            c.includes(trQuery)
        );
        setMatchedCats(cats);

        setOpen(r.length > 0 || cats.length > 0);
    }, [query]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        router.push(`/?search=${encodeURIComponent(query.trim())}`);
        setOpen(false);
        setQuery('');
    };

    return (
        <div ref={ref} className="relative w-full group">
            <form onSubmit={handleSearch} className="relative z-[60]">
                <input
                    id="global-search"
                    type="search"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Buscar productos, herramientas, belleza..."
                    autoComplete="off"
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl font-dupla-bold text-white transition-all duration-300 outline-none backdrop-blur-md"
                    style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '2px solid rgba(255,215,0,0.15)',
                        fontSize: '0.95rem',
                        boxShadow: open ? '0 10px 40px rgba(0,0,0,0.5)' : 'none'
                    }}
                    onFocus={() => setOpen(query.trim().length >= 1)}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#FFD700' }}>
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                </div>
                {query && (
                    <button 
                        type="button" 
                        onClick={() => setQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                    >
                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </form>

            {/* Smart Search Results Dropdown */}
            {open && (
                <div
                    className="absolute top-0 left-0 right-0 pt-16 rounded-[2rem] overflow-hidden shadow-2xl z-50 animate-fade-in"
                    style={{ 
                        background: 'rgba(0, 20, 40, 0.98)', 
                        border: '1px solid rgba(255,215,0,0.2)',
                        backdropFilter: 'blur(20px)'
                    }}
                >
                    <div className="p-4 flex flex-col gap-6">
                        
                        {/* Categories Section */}
                        {matchedCats.length > 0 && (
                            <div className="px-2">
                                <h4 className="text-[10px] font-dupla-black uppercase tracking-[0.3em] text-white/40 mb-3 ml-1">Categorías Sugeridas</h4>
                                <div className="flex flex-wrap gap-2">
                                    {matchedCats.map(cat => (
                                        <Link
                                            key={cat}
                                            href={`/?cat=${cat}`}
                                            className="px-4 py-2 rounded-xl text-xs font-dupla-bold transition-all hover:scale-105"
                                            style={{ 
                                                background: `${CATEGORIES[cat].color}15`, 
                                                border: `1.5px solid ${CATEGORIES[cat].color}40`,
                                                color: CATEGORIES[cat].color
                                            }}
                                            onClick={() => setOpen(false)}
                                        >
                                            {CATEGORIES[cat].icon} {CATEGORIES[cat].label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Products Section */}
                        {results.length > 0 && (
                            <div className="px-2">
                                <h4 className="text-[10px] font-dupla-black uppercase tracking-[0.3em] text-white/40 mb-3 ml-1">Productos Encontrados</h4>
                                <div className="flex flex-col gap-2">
                                    {results.map(p => (
                                        <Link
                                            key={p.id}
                                            href={`/?cat=${p.categoria}`}
                                            className="flex items-center gap-4 p-3 hover:bg-white/5 transition-all rounded-2xl group"
                                            onClick={() => {
                                                setQuery('');
                                                setOpen(false);
                                            }}
                                        >
                                            <div className="w-14 h-14 bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
                                                <img
                                                    src={p.imagenes?.[0] || 'https://placehold.co/100'}
                                                    alt={p.nombre}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-dupla-black truncate text-white uppercase text-xs tracking-tight">{p.nombre}</div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] font-dupla-black px-1.5 py-0.5 rounded uppercase" style={{ background: `${CATEGORIES[p.categoria].color}20`, color: CATEGORIES[p.categoria].color }}>
                                                        {CATEGORIES[p.categoria].label}
                                                    </span>
                                                    <span className="text-[10px] text-white/30 font-dupla-bold uppercase tracking-widest">Min. {p.minMayorista} uds</span>
                                                </div>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <div className="font-dupla-black text-lg text-gold leading-none">{formatPrice(p.precioMayorista)}</div>
                                                <div className="text-[9px] text-white/30 font-dupla-black uppercase mt-1">Precio Mayorista</div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Helper Footer */}
                        <button 
                            onClick={handleSearch}
                            className="w-full py-4 text-[10px] font-dupla-black uppercase tracking-[0.4em] text-center border-t border-white/5 hover:text-white transition-colors"
                            style={{ color: 'rgba(255,215,0,0.6)' }}
                        >
                            Ver todos los resultados para "{query}" →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
