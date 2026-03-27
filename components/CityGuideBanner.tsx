import Link from 'next/link';

export default function CityGuideBanner() {
    return (
        <section className="relative w-full py-40 overflow-hidden">
            {/* Background Image with Parallax Effect */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
                style={{ backgroundImage: `url('/images/manizales-bg.jpg')` }}
            />
            {/* Premium Gradient Overlay with Brand Accent */}
            <div 
                className="absolute inset-0 z-10 opacity-90 transition-opacity duration-1000 group-hover:opacity-80" 
                style={{ 
                    background: 'linear-gradient(135deg, rgba(0, 31, 63, 0.92) 0%, rgba(13, 108, 184, 0.8) 50%, rgba(106, 74, 140, 0.85) 100%)' 
                }} 
            />

            {/* Content */}
            <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center">
                <div className="mb-4 inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold font-dupla-black text-[10px] uppercase tracking-[0.3em] animate-fade-in">
                    Guía Local · Manizales
                </div>
                
                <h2 
                    className="text-4xl md:text-6xl font-dupla-black text-white mb-8 tracking-tighter leading-[0.9] max-w-2xl"
                    style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.5))' }}
                >
                    ¿Qué hacer en <span className="font-dupla-black-italic text-gold italic">Manizales?</span>
                </h2>

                <Link
                    href="/manizales-guia"
                    className="group relative px-10 py-4 overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 shadow-2xl"
                >
                    {/* Button Background & Border */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-md border border-white/20 group-hover:bg-white/20 transition-all duration-300" />
                    
                    {/* Animated Edge */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    
                    <span className="relative z-10 flex items-center gap-3 font-dupla-black text-sm text-white uppercase tracking-widest">
                        Descubre la Guía
                        <span className="text-gold transition-transform duration-300 group-hover:translate-x-2">→</span>
                    </span>
                </Link>
            </div>
        </section>
    );
}
