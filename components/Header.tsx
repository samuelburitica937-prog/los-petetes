'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { useAuthStore } from '@/lib/auth';
import SearchBar from './SearchBar';

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
                    <a href="https://wa.me/576068840248" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366' }} className="hover:opacity-90">
                        📲 WhatsApp: +57 606 884 0248
                    </a>
                    <a href="https://instagram.com/lospetetesmanizales7" target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700' }}>
                        📸 @lospetetesmanizales7
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
                {[
                    { href: '/#section-ferreteria', label: '🔧 Ferretería' },
                    { href: '/#section-belleza', label: '💄 Belleza' },
                    { href: '/#section-salud', label: '💊 Salud' },
                    { href: '/#section-hogar', label: '🏠 Hogar' },
                    { href: '/#section-petshop', label: '🐾 Pet' },
                    { href: '/#section-deportes', label: '⚡ Deporte' },
                    { href: '/#section-bebes', label: '🍼 Bebés' },
                    { href: '/#section-sexshop', label: '❤️ Íntimo' },
                    { href: '/#section-electrodomesticos', label: '📺 Electro' },
                    { href: '/#section-tecnologia', label: '📱 Tec' },
                    { href: '/#section-papeleria', label: '📝 Papel' },
                    { href: '/#section-escolar', label: '🎒 Escolar' },
                    { href: '/#section-oficina', label: '💼 Ofi' },
                    { href: '/#section-horaloca', label: '🥳 H. Loca' },
                    { href: '/#section-jugueteria', label: '🧸 Juguete' },
                ].map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className="px-1.5 py-1 rounded-md text-[9px] lg:text-[10px] font-dupla-black whitespace-nowrap transition-all hover:text-gold hover:bg-gold/10 uppercase tracking-tighter"
                        style={{ color: 'rgba(255,255,255,0.7)' }}
                    >
                        {label}
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
                    {[
                        { href: '/#section-ferreteria', label: '🔧 Ferretería' },
                        { href: '/#section-belleza', label: '💄 Belleza' },
                        { href: '/#section-salud', label: '💊 Salud' },
                        { href: '/#section-hogar', label: '🏠 Hogar' },
                        { href: '/#section-petshop', label: '🐾 Pet Shop' },
                        { href: '/#section-deportes', label: '⚡ Deportes' },
                        { href: '/#section-bebes', label: '🍼 Bebés' },
                        { href: '/#section-sexshop', label: '❤️ Íntimos' },
                        { href: '/#section-electrodomesticos', label: '📺 Electrodomésticos' },
                        { href: '/#section-tecnologia', label: '📱 Tecnología' },
                        { href: '/#section-papeleria', label: '📝 Papelería' },
                        { href: '/#section-escolar', label: '🎒 Escolar' },
                        { href: '/#section-oficina', label: '💼 Oficina' },
                        { href: '/#section-horaloca', label: '🥳 Hora Loca' },
                        { href: '/#section-jugueteria', label: '🧸 Juguetería' },
                        { href: '/admin', label: '🔐 Panel Admin' },
                    ].map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMenuOpen(false)}
                            className="px-4 py-3 rounded-xl text-xs font-dupla-semibold transition-all uppercase tracking-tight"
                            style={{ background: 'rgba(255,215,0,0.06)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,215,0,0.1)' }}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            )}
        </header>
    );
}
