'use client';
import Link from 'next/link';
import { CITIES } from '@/lib/data';

export default function Footer() {
    return (
        <footer style={{ background: '#001428', borderTop: '3px solid #FF0000' }}>
            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 mb-3">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl"
                            style={{ background: 'linear-gradient(135deg, #FFD700, #E6C200)', color: '#001F3F', boxShadow: '0 0 30px rgba(255,215,0,0.5)' }}
                        >
                            LP
                        </div>
                        <div>
                            <div className="font-black text-3xl leading-none" style={{ color: '#FFD700' }}>
                                Los <span style={{ color: '#FF0000' }}>Petetes</span>
                            </div>
                            <div className="font-semibold" style={{ color: 'rgba(255,255,255,0.6)' }}>Distribuidora Mayorista</div>
                        </div>
                    </div>
                    <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Tu aliado mayorista con más de 30,000 productos. Estamos en Armenia, Pereira y Manizales con envíos a todo el país.
                    </p>
                    <hr className="divider-red" style={{ maxWidth: '200px', margin: '16px auto 0' }} />
                </div>

                {/* Columns */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {/* Ayuda */}
                    <div>
                        <h3 className="font-black text-base mb-4 flex items-center gap-2" style={{ color: '#FFD700' }}>
                            <span className="w-6 h-6 rounded bg-yellow-400/10 flex items-center justify-center text-xs">?</span>
                            Ayuda
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Guía de compra', href: '/guia-compra', icon: '📖' },
                                { label: 'Información de envíos', href: '/envios', icon: '🚚' },
                                { label: 'Devoluciones', href: '/devoluciones', icon: '🔄' },
                                { label: 'Garantías', href: '/garantias', icon: '🛡️' },
                                { label: 'Preguntas frecuentes', href: '/faq', icon: '💬' },
                            ].map(l => (
                                <li key={l.label}>
                                    <Link href={l.href} className="nav-link text-sm flex items-center gap-2 hover:text-yellow-400 transition-colors">
                                        <span className="opacity-50 text-xs">{l.icon}</span>
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Cuenta */}
                    <div>
                        <h3 className="font-black text-base mb-4 flex items-center gap-2" style={{ color: '#FFD700' }}>
                            <span className="w-6 h-6 rounded bg-yellow-400/10 flex items-center justify-center text-xs">👤</span>
                            Mi Cuenta
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Iniciar sesión', href: '/login', icon: '🔑' },
                                { label: 'Registrarse', href: '/registro', icon: '📝' },
                                { label: 'Mis pedidos', href: '/pedidos', icon: '📦' },
                                { label: 'Lista de deseos', href: '/deseos', icon: '❤️' },
                                { label: 'Panel Admin', href: '/admin', icon: '🔐' },
                            ].map(l => (
                                <li key={l.label}>
                                    <Link href={l.href} className="nav-link text-sm flex items-center gap-2 hover:text-yellow-400 transition-colors">
                                        <span className="opacity-50 text-xs">{l.icon}</span>
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Ciudades */}
                    <div>
                        <h3 className="font-black text-base mb-4" style={{ color: '#FFD700' }}>Ciudades</h3>
                        <div className="space-y-3">
                            {CITIES.map(city => (
                                <a
                                    key={city.name}
                                    href={city.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 group"
                                >
                                    <span className="text-lg">{city.emoji}</span>
                                    <div>
                                        <div className="font-bold text-sm group-hover:text-yellow-400 transition-colors" style={{ color: 'white' }}>
                                            {city.name}
                                        </div>
                                        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{city.desc}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* PQRS + WhatsApp */}
                    <div>
                        <h3 className="font-black text-base mb-4" style={{ color: '#FFD700' }}>Contáctenos</h3>
                        <div className="space-y-3">
                            <a
                                href="https://wa.me/576068840248"
                                target="_blank"
                                rel="noopener noreferrer"
                                id="footer-whatsapp"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-sm transition-all"
                                style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', color: '#25D366' }}
                            >
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                +57 606 884 0248
                            </a>
                            <a
                                href="https://instagram.com/lospetetesmanizales7"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-pink-400"
                                style={{ color: 'rgba(255,255,255,0.7)' }}
                            >
                                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                                @lospetetesmanizales7
                            </a>
                            <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                                <div>📧 PQRS y sugerencias</div>
                                <a href="mailto:contacto@lospetetes.com" className="hover:text-yellow-400 transition-colors">
                                    contacto@lospetetes.com
                                </a>
                            </div>
                        </div>
                        {/* Payment & Trust */}
                        <div>
                            <h3 className="font-black text-base mb-4" style={{ color: '#FFD700' }}>Pagos Seguros</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {['Wompi', 'Nequi', 'Bancolombia', 'Daviplata', 'PSE', 'Visa', 'Mastercard', 'Efecty', 'PayPal'].map(p => (
                                    <span key={p} className="text-[10px] font-bold px-2 py-1 rounded border border-white/10 bg-white/5 text-white/70 uppercase">
                                        {p}
                                    </span>
                                ))}
                            </div>
                            <div className="p-3 rounded-lg bg-yellow-400/5 border border-yellow-400/20">
                                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                                    <span className="text-yellow-400 font-bold">✓ SSL Protegido</span><br />
                                    Tus transacciones son 100% seguras con nosotros.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-black text-base mb-4 flex items-center gap-2" style={{ color: '#FFD700' }}>
                            <span className="w-6 h-6 rounded bg-yellow-400/10 flex items-center justify-center text-xs">⚖</span>
                            Legal
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { label: 'Términos y Condiciones', href: '/terminos', icon: '📄' },
                                { label: 'Política de Privacidad', href: '/privacidad', icon: '🔒' },
                                { label: 'Política de Cookies', href: '/cookies', icon: '🍪' },
                                { label: 'Tratamiento de Datos', href: '/tratamiento-datos', icon: '📋' },
                            ].map(l => (
                                <li key={l.label}>
                                    <Link href={l.href} className="nav-link text-sm flex items-center gap-2 hover:text-yellow-400 transition-colors">
                                        <span className="opacity-50 text-xs">{l.icon}</span>
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div
                className="px-4 py-4 text-center text-sm"
                style={{ background: 'rgba(0,0,0,0.4)', borderTop: '1px solid rgba(255,215,0,0.1)' }}
            >
                <div style={{ color: 'rgba(255,255,255,0.5)' }}>
                    © 2026{' '}
                    <span className="font-bold" style={{ color: '#FFD700' }}>Los Petetes Mayorista</span>
                    {' '}— Manizales, Caldas, Colombia. Todos los derechos reservados.
                </div>
                <div className="mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Distribuidora Mayorista · Cámara de Comercio de Manizales · +57 606 884 0248
                </div>
            </div>
        </footer>
    );
}
