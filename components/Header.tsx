'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { useAuthStore } from '@/lib/auth';
import SearchBar from './SearchBar';
import { CATEGORIES } from '@/lib/data';

export default function Header() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const [mounted, setMounted] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const totalItems = useCartStore(s => s.totalItems());
    const openCart = useCartStore(s => s.openCart);

    useEffect(() => {
        setMounted(true);
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                background: scrolled
                    ? 'rgba(0,20,40,0.97)'
                    : 'rgba(0,31,63,0.98)',
                backdropFilter: 'blur(20px)',
                borderBottom: '2px solid rgba(255,215,0,0.25)',
                boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
            }}
        >
            {/* Top bar */}
            <div
                className="hidden md:flex items-center justify-between px-6 py-1 text-xs font-medium"
                style={{ background: 'rgba(255,0,0,0.15)', borderBottom: '1px solid rgba(255,0,0,0.3)' }}
            >
                <span style={{ color: '#FFD700' }}>
                    🏭 Venta exclusiva al por mayor — Envíos a todo el país | Sedes en Manizales, Pereira y Armenia
                </span>
                <div className="flex gap-4">
                    <a href="https://wa.me/573145090821" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366' }} className="flex items-center gap-1.5 hover:opacity-90">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
                        </svg>
                        WhatsApp: +57 314 509 0821
                    </a>
                    <a href="https://instagram.com/lospetetesmanizales7" target="_blank" rel="noopener noreferrer" style={{ color: '#E1306C' }} className="flex items-center gap-1.5 hover:opacity-90">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.20 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                        </svg>
                        @lospetetesmanizales7
                    </a>
                </div>
            </div>

            {/* Main nav */}
            <div className="flex items-center justify-between px-4 md:px-8 py-3 gap-4">
                {/* Logo */}
                <Link href="/" className="flex-shrink-0 select-none" aria-label="Los Petetes - Inicio">
                    <div className="flex items-center gap-2">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-dupla-black text-lg"
                            style={{ background: 'linear-gradient(135deg, #FFD700, #E6C200)', color: '#001F3F', boxShadow: '0 0 20px rgba(255,215,0,0.4)' }}
                        >
                            LP
                        </div>
                        <div className="flex flex-col">
                            <div className="font-dupla-black text-xl leading-none uppercase tracking-tighter" style={{ color: '#FFD700' }}>
                                Los Petetes
                            </div>
                            <div className="text-[9px] font-dupla-semibold uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                                Distribuidora Mayorista
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Search */}
                <div className="flex-1 max-w-xl hidden md:block">
                    <SearchBar />
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2">
                    {/* Auth Status */}
                    {mounted && isAuthenticated ? (
                        <div className="flex items-center gap-2">
                            <Link
                                href="/pedidos"
                                className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-dupla-black transition-all uppercase tracking-tighter"
                                style={{ background: 'rgba(255,215,0,0.1)', border: '1.5px solid rgba(255,215,0,0.2)', color: '#FFD700' }}
                            >
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Hola, {user?.nombre}
                            </Link>
                            <button 
                                onClick={logout}
                                className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-red-500"
                                title="Cerrar Sesión"
                            >
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="hidden lg:flex items-center gap-2">
                            <Link
                                href="/login"
                                className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-dupla-black transition-all uppercase tracking-widest"
                                style={{ background: 'rgba(255,215,0,0.1)', border: '1.5px solid rgba(255,215,0,0.3)', color: '#FFD700' }}
                            >
                                Ingresar
                            </Link>
                            <Link
                                href="/registro"
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-dupla-black transition-all uppercase tracking-widest shadow-lg shadow-gold/20"
                                style={{ background: '#FFD700', border: '1.5px solid #FFD700', color: '#001F3F' }}
                            >
                                Registrarse
                            </Link>
                        </div>
                    )}

                    {/* Cart button */}
                    <button
                        id="cart-btn"
                        onClick={openCart}
                        className="relative flex items-center gap-2 px-3 py-2 rounded-xl font-dupla-bold transition-all duration-200 cursor-pointer"
                        style={{ background: 'rgba(255,215,0,0.12)', border: '1.5px solid rgba(255,215,0,0.35)', color: '#FFD700' }}
                        aria-label={`Carrito (${totalItems} items)`}
                    >
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                        <span className="hidden sm:inline">Carrito</span>
                        {totalItems > 0 && (
                            <span
                                className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center text-xs font-dupla-black px-1 rounded-full"
                                style={{ background: '#FF0000', color: 'white' }}
                            >
                                {totalItems}
                            </span>
                        )}
                    </button>

                    {/* Admin link */}
                    <Link
                        href="/admin"
                        className="hidden lg:flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-bold transition-all"
                        style={{ background: 'rgba(255,0,0,0.12)', border: '1.5px solid rgba(255,0,0,0.3)', color: '#FF0000' }}
                    >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Admin
                    </Link>

                    {/* Mobile menu */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="md:hidden p-2 rounded-lg transition-all"
                        style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.2)', color: '#FFD700' }}
                        aria-label="Menu"
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? (
                            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile search */}
            <div className="md:hidden px-4 pb-3">
                <SearchBar />
            </div>

            {/* Nav links: 15 sections visible & centered */}
            <nav
                className="hidden md:flex flex-wrap items-center justify-center gap-x-2 gap-y-1 px-4 py-2"
                style={{ borderTop: '1px solid rgba(255,215,0,0.1)' }}
            >
                {Object.entries(CATEGORIES).map(([catId, info]) => (
                    <Link
                        key={catId}
                        href={`/categoria/${catId}`}
                        className="px-1.5 py-1 rounded-md text-[9px] lg:text-[10px] font-dupla-black whitespace-nowrap transition-all hover:text-gold hover:bg-gold/10 uppercase tracking-tighter"
                        style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                        {info.label}
                    </Link>
                ))}
            </nav>


            {/* Mobile menu dropdown */}
            {menuOpen && (
                <div
                    className="md:hidden flex flex-col px-4 pb-6 gap-2 bg-navy-dark overflow-y-auto max-h-[70vh] shadow-2xl"
                    style={{ borderTop: '1.5px solid rgba(255,215,0,0.2)' }}
                >
                    {/* Auth Section Mobile */}
                    <div className="py-4 grid grid-cols-2 gap-2 mb-2">
                        {mounted && isAuthenticated ? (
                            <>
                                <Link
                                    href="/pedidos"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-dupla-black bg-gold/10 border border-gold/20 text-gold uppercase"
                                >
                                    Mis Pedidos
                                </Link>
                                <button
                                    onClick={() => { logout(); setMenuOpen(false); }}
                                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-dupla-black bg-red-500/10 border border-red-500/20 text-red-500 uppercase"
                                >
                                    Salir
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center justify-center py-3 rounded-xl text-xs font-dupla-black bg-gold/10 border border-gold/20 text-gold uppercase"
                                >
                                    Ingresar
                                </Link>
                                <Link
                                    href="/registro"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center justify-center py-3 rounded-xl text-xs font-dupla-black bg-gold text-navy uppercase"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="text-[10px] font-dupla-black text-white/30 uppercase tracking-[0.2em] px-2 mb-1">Categorías</div>
                    {Object.entries(CATEGORIES).map(([catId, info]) => (
                        <Link
                            key={catId}
                            href={`/categoria/${catId}`}
                            onClick={() => setMenuOpen(false)}
                            className="px-4 py-3 rounded-xl text-xs font-dupla-semibold transition-all uppercase tracking-tight"
                            style={{ background: 'rgba(255,215,0,0.06)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,215,0,0.1)' }}
                        >
                            {info.label}
                        </Link>
                    ))}
                    <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="px-4 py-3 rounded-xl text-xs font-dupla-semibold transition-all uppercase tracking-tight"
                        style={{ background: 'rgba(255,215,0,0.06)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,215,0,0.1)' }}
                    >
                        🔐 Panel Admin
                    </Link>
                </div>
            )}
        </header>
    );
}
