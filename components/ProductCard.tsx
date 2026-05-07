'use client';
import { useState } from 'react';
import { Product, formatPrice, CATEGORIES, Category, getProductQtyConfig, getLevelInfo } from '@/lib/data';
import { useCartStore, useWishlistStore, useRecentStore } from '@/lib/store';
import { useAuthStore } from '@/lib/auth';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    featured?: boolean;
}

export default function ProductCard({ product, featured }: ProductCardProps) {
    const [activeImg, setActiveImg] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const { min, step } = getProductQtyConfig(product);
    const [qty, setQty] = useState(min);
    const addItem = useCartStore(s => s.addItem);
    const openCart = useCartStore(s => s.openCart);
    const { toggle, has } = useWishlistStore();
    const addRecent = useRecentStore(s => s.add);
    const inWishlist = has(product.id);
    const { user, isAuthenticated } = useAuthStore();

    const handleAddCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        addItem(product, qty);
        addRecent(product);
        toast.success(`✅ ${product.nombre.slice(0, 25)}... agregado al carrito`);
        openCart();
    };

    const handleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggle(product.id);
        toast(inWishlist ? '💛 Eliminado de favoritos' : '❤️ Guardado en favoritos');
    };

    const catInfo = CATEGORIES[product.categoria as Category];
    const stockLevel = product.stock > 50 ? 'high' : product.stock > 10 ? 'mid' : 'low';
    const images = product.imagenes || [];

    return (
        <article
            className="product-card flex flex-col h-full group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => addRecent(product)}
            tabIndex={0}
            role="article"
            aria-label={product.nombre}
        >
            {/* Image & Gallery */}
            <div className="relative overflow-hidden bg-white rounded-t-xl" style={{ aspectRatio: '4/3' }}>
                {/* Always render first image */}
                <img
                    src={images[0]}
                    alt={`${product.nombre} 1`}
                    className={`absolute inset-0 w-full h-full object-contain p-2 transition-all duration-700 ${activeImg === 0 ? 'opacity-100 scale-105' : 'opacity-0'}`}
                    loading="lazy"
                    decoding="async"
                />

                {/* Only render other images if hovered to save bandwidth */}
                {isHovered && images.slice(1).map((img, i) => (
                    <img
                        key={i + 1}
                        src={img}
                        alt={`${product.nombre} ${i + 2}`}
                        className={`absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-500 ${activeImg === i + 1 ? 'opacity-100' : 'opacity-0'}`}
                        loading="lazy"
                        decoding="async"
                    />
                ))}

                {/* Visual Indicators - only if multiple images */}
                {images.length > 1 && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onMouseEnter={(e) => { e.stopPropagation(); setActiveImg(i); }}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${activeImg === i ? 'bg-yellow-400 w-4' : 'bg-white/40'}`}
                                aria-label={`Ver imagen ${i + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                    {product.nuevo && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-black" style={{ background: '#FFD700', color: '#001F3F' }}>
                            NUEVO
                        </span>
                    )}
                    {product.destacado && (
                        <span className="badge-mayorista">DESTACADO</span>
                    )}
                </div>
                {/* Stock badge */}
                <div className="absolute top-2 right-2 z-10">
                    <span className={stockLevel === 'high' ? 'badge-stock' : 'badge-stock-low'}>
                        {stockLevel === 'high' ? `✓ ${product.stock}` : stockLevel === 'mid' ? `⚠ ${product.stock}` : `🔴 ${product.stock}`}
                    </span>
                </div>
                {/* Wishlist */}
                <button
                    onClick={handleWishlist}
                    className="absolute top-10 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer z-10"
                    style={{
                        background: inWishlist ? 'rgba(255,0,0,0.9)' : 'rgba(0,0,0,0.6)',
                        border: '1px solid rgba(255,255,255,0.2)',
                    }}
                    aria-label={inWishlist ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                >
                    <svg width="14" height="14" fill={inWishlist ? 'white' : 'none'} viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-2 md:p-3">
                {/* Name */}
                <h3
                    className="font-dupla-bold text-[10px] md:text-sm leading-tight mb-2 flex-1"
                    style={{ color: 'white', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                >
                    {product.nombre}
                </h3>

                {/* Stars - Hidden on mobile */}
                <div className="hidden md:flex items-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            size={11}
                            fill={i < Math.floor(product.rating) ? '#FFD700' : 'none'}
                            stroke={i < Math.floor(product.rating) ? '#FFD700' : 'rgba(255,255,255,0.2)'}
                            strokeWidth={1.5}
                        />
                    ))}
                    <span className="text-xs font-dupla-semibold" style={{ color: 'rgba(255,255,255,0.5)' }}>({product.vendidos})</span>
                </div>

                {/* Price */}
                <div className="mb-2">
                    {isAuthenticated && user ? (() => {
                        const loyalty = getLevelInfo(user.totalCompras || 1700000); // 1.7M mock para asegurar tier ALÍADO o BRONCE
                        if (loyalty.descuento > 0) {
                            const discountedPrice = product.precioMayorista * (1 - loyalty.descuento);
                            const savings = product.precioMayorista - discountedPrice;
                            
                            return (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className="text-xs md:text-md price-tag font-dupla-black text-gold">{formatPrice(discountedPrice)}</div>
                                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold/20 text-gold font-black">
                                            -{Math.round(loyalty.descuento * 100)}% {loyalty.nivel}
                                        </span>
                                    </div>
                                    <div className="hidden md:block price-unit font-dupla-semibold">
                                        Te ahorras {formatPrice(savings)} extra
                                    </div>
                                    <div className="flex flex-col gap-0.5 mt-1">
                                        {[2000000, 5000000, 10000000, 20000000].map(threshold => {
                                            const tierInfo = getLevelInfo(threshold);
                                            if (tierInfo.descuento <= loyalty.descuento) return null;
                                            const tierPrice = product.precioMayorista * (1 - tierInfo.descuento);
                                            return (
                                                <div key={tierInfo.nivel} className="text-[8px] md:text-[9px] font-bold text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/10 leading-tight">
                                                    Si fueras <span style={{ color: tierInfo.color }}>{tierInfo.nivel}</span> te quedaría en <span className="text-white">{formatPrice(tierPrice)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="text-[8px] md:text-xs line-through font-dupla-semibold text-white/30 flex gap-2 pt-1">
                                        <span>P. Mayorista: {formatPrice(product.precioMayorista)}</span>
                                        <span className="opacity-50">Sugerido: {formatPrice(product.precio)}</span>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <>
                                <div className="text-xs md:text-md price-tag font-dupla-black">{formatPrice(product.precioMayorista)}</div>
                                <div className="hidden md:block price-unit font-dupla-semibold">Min. {min} uds · Precio mayorista</div>
                                
                                {(() => {
                                    // Gamification for non-logged-in / level 0
                                    return (
                                        <div className="flex flex-col gap-0.5 mt-1 mb-1">
                                            {[2000000, 5000000, 10000000, 20000000].map(threshold => {
                                                const tierInfo = getLevelInfo(threshold);
                                                const tierPrice = product.precioMayorista * (1 - tierInfo.descuento);
                                                return (
                                                    <div key={tierInfo.nivel} className="text-[8px] md:text-[9px] font-bold text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/10 leading-tight">
                                                        Si fueras <span style={{ color: tierInfo.color }}>{tierInfo.nivel}</span> te quedaría en <span className="text-white">{formatPrice(tierPrice)}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })()}
                                
                                <div className="text-[8px] md:text-xs line-through font-dupla-semibold text-white/30 pt-1">
                                    {formatPrice(product.precio)}
                                </div>
                            </>
                        );
                    })() : (
                        <>
                            <div className="text-xs md:text-md price-tag font-dupla-black">{formatPrice(product.precioMayorista)}</div>
                            <div className="hidden md:block price-unit font-dupla-semibold">Min. {min} uds · Precio mayorista</div>
                            
                            {(() => {
                                // Gamification for non-logged-in / level 0
                                return (
                                    <div className="flex flex-col gap-0.5 mt-1 mb-1">
                                        {[2000000, 5000000, 10000000, 20000000].map(threshold => {
                                            const tierInfo = getLevelInfo(threshold);
                                            const tierPrice = product.precioMayorista * (1 - tierInfo.descuento);
                                            return (
                                                <div key={tierInfo.nivel} className="text-[8px] md:text-[9px] font-bold text-white/50 bg-white/5 px-2 py-0.5 rounded border border-white/10 leading-tight">
                                                    Si fueras <span style={{ color: tierInfo.color }}>{tierInfo.nivel}</span> pagarías <span className="text-white">{formatPrice(tierPrice)}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })()}
                            
                            <div className="text-[8px] md:text-xs line-through font-dupla-semibold text-white/30">
                                {formatPrice(product.precio)}
                            </div>
                        </>
                    )}
                </div>

                {/* Qty + add to cart */}
                <div className="flex gap-1 md:gap-2 mt-auto">
                    {/* Qty Hidden on Mobile */}
                    <div
                        className="hidden md:flex items-center rounded-lg overflow-hidden"
                        style={{ border: '1.5px solid rgba(255,215,0,0.25)', background: 'rgba(0,0,0,0.2)' }}
                    >
                        <button
                            onClick={e => { e.stopPropagation(); setQty(q => Math.max(min, q - step)); }}
                            className="px-2 py-1 transition-colors cursor-pointer font-dupla-black"
                            style={{ color: '#FFD700' }}
                            aria-label="Reducir cantidad"
                        >−</button>
                        <span className="px-2 text-sm font-dupla-black" style={{ color: 'white' }}>{qty}</span>
                        <button
                            onClick={e => { e.stopPropagation(); setQty(q => q + step); }}
                            className="px-2 py-1 transition-colors cursor-pointer font-dupla-black"
                            style={{ color: '#FFD700' }}
                            aria-label="Aumentar cantidad"
                        >+</button>
                    </div>
                    {/* Add to Cart - Full width on mobile */}
                    <button
                        id={`add-cart-${product.id}`}
                        onClick={handleAddCart}
                        className="flex-1 py-1.5 md:py-2 rounded-lg text-[9px] md:text-xs font-dupla-black transition-all cursor-pointer uppercase tracking-tight"
                        style={{ background: '#FFD700', color: '#001F3F' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#E6C200')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#FFD700')}
                    >
                        <span className="md:hidden">AGREGAR</span>
                        <span className="hidden md:inline">+ Carrito</span>
                    </button>
                </div>
                {/* eBay style liquidation / Negociar Lote */}
                {product.stock > 30 && (
                    <button 
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            addOrder({
                                id: `#N${Math.floor(Math.random() * 10000)}`,
                                fecha: new Date().toISOString().split('T')[0],
                                total: product.precioMayorista * product.stock,
                                estado: 'NEGOCIANDO LOTE',
                                items: [{ productoId: product.id, cantidad: product.stock }]
                            });
                            toast.success(`Oferta de liquidación enviada. El administrador te contactará para negociar ${product.stock} uds.`); 
                        }}
                        className="w-full mt-2 py-1.5 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white"
                    >
                        🤝 Negociar Lote Completo ({product.stock} uds)
                    </button>
                )}
            </div>

        </article>
    );
}
