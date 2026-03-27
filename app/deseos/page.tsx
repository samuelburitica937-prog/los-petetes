'use client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWishlistStore } from '@/lib/store';
import { ALL_PRODUCTS, formatPrice } from '@/lib/data';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function WishlistPage() {
    const { ids } = useWishlistStore();
    const wishProducts = ALL_PRODUCTS.filter(p => ids.includes(p.id));

    return (
        <main className="min-h-screen bg-navy flex flex-col pt-32">
            <Header />
            <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
                <div className="flex items-end justify-between mb-12 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-5xl font-black text-gold uppercase tracking-tighter">Mi Lista de Deseos</h1>
                        <p className="text-white/60 mt-2">Tienes {wishProducts.length} productos guardados</p>
                    </div>
                    <Link href="/" className="btn-outline text-sm py-2 px-6 uppercase font-bold tracking-wider">
                        Continuar comprando
                    </Link>
                </div>

                {wishProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {wishProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 glass-card">
                        <div className="text-6xl mb-6">❤️</div>
                        <h2 className="text-2xl font-black text-white uppercase mb-4">Tu lista está vacía</h2>
                        <p className="text-white/50 mb-8 max-w-md mx-auto">
                            Guarda los productos que más te gustan para comprarlos más tarde. 
                            ¡No dejes pasar nuestras ofertas mayoristas!
                        </p>
                        <Link href="/" className="btn-primary px-10 py-4 font-black uppercase tracking-widest">
                            Ir a la Tienda
                        </Link>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
