import Link from 'next/link';

export default function CityGuideBanner() {
    return (
        <section className="relative w-full py-40 overflow-hidden">
            {/* Background Image with Parallax Effect + color fallback */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
                style={{
                    backgroundImage: `url('/images/manizales-bg.jpg')`,
                    backgroundColor: '#001428',
                }}
            />
            {/* Premium Gradient Overlay with Brand Accent */}
            <div
                className="absolute inset-0 z-10 opacity-90"
                style={{
                    background: 'linear-gradient(135deg, rgba(0, 31, 63, 0.95) 0%, rgba(13, 108, 184, 0.85) 50%, rgba(106, 74, 140, 0.9) 100%)'
                }}
            />

            {/* Decorative glowing orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full z-10 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,215,0,0.08) 0%, transparent 70%)' }} />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full z-10 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(255,0,0,0.06) 0%, transparent 70%)' }} />

            {/* Content */}
            <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center">
                <div className="mb-4 inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold font-dupla-black text-[10px] uppercase tracking-[0.3em] animate-fade-in">
                    🏙️ Guía Local · Eje Cafetero
                </div>

                <h2
                    className="text-4xl md:text-6xl font-dupla-black text-white mb-8 tracking-tighter leading-[0.9] max-w-3xl"
                    style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.5))' }}
                >
                    ¿Qué hay para hacer en <span className="font-dupla-black-italic text-gold italic">Manizales?</span>
                </h2>

                <div className="flex flex-wrap gap-4 justify-center">
                    {[
                        { title: 'Hoteles', icon: '🏨', href: '/turismo?q=hoteles' },
                        { title: 'Restaurantes', icon: '🍽️', href: '/turismo?q=restaurantes' },
                        { title: 'Bares', icon: '🍸', href: '/turismo?q=bares' },
                        { title: 'Museos', icon: '🏛️', href: '/turismo?q=museos' }
                    ].map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.href}
                            className="group relative px-6 py-3 overflow-hidden rounded-xl transition-all duration-500 hover:scale-105 shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-all duration-300" />
                            <span className="relative z-10 flex items-center gap-2 font-dupla-black text-xs text-white uppercase tracking-widest">
                                <span>{item.icon}</span>
                                {item.title}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
