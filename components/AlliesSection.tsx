'use client';
import { ALLIES } from '@/lib/data';
import Link from 'next/link';

export default function AlliesSection() {
    return (
        <section className="py-24 px-4 md:px-8 bg-navy relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl text-left">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-red/10 border border-red/20 text-red font-dupla-black text-[10px] uppercase tracking-[0.3em] mb-6">
                            Red de Distribución
                        </div>
                        <h2 className="text-4xl md:text-6xl font-dupla-black text-white uppercase tracking-tighter leading-[0.9] mb-6">
                            Busca al detal con nuestros <span className="text-gold italic font-dupla-black-italic">Mejores Aliados</span>
                        </h2>
                        <p className="text-white/60 font-dupla-semibold text-lg leading-relaxed">
                            ¿No eres mayorista? No te preocupes. Encuentra nuestros productos en las tiendas más exclusivas del país. Nosotros les proveemos, ellos te atienden con la mejor calidad.
                        </p>
                    </div>
                    
                    <Link
                        href="/aliados"
                        className="group relative px-10 py-4 overflow-hidden rounded-2xl bg-gold text-navy transition-all duration-500 hover:scale-105 shadow-2xl self-start md:self-auto flex items-center gap-3 font-dupla-black text-xs uppercase tracking-widest hover:bg-gold-light"
                    >
                        Comprar al Detal Ahora
                        <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
                    </Link>
                </div>

                {/* Allies Grid/Carousel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {ALLIES.map(ally => (
                        <div 
                            key={ally.id}
                            className="group relative h-[300px] rounded-[2rem] overflow-hidden border border-white/5 bg-navy-light/20 flex flex-col justify-end p-8 transition-all duration-500 hover:border-gold/30"
                        >
                            {/* Ally Image */}
                            <img 
                                src={ally.image} 
                                alt={ally.name}
                                className="absolute inset-0 w-full h-full object-cover opacity-40 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-60"
                            />
                            
                            {/* Card Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
                            
                            {/* Card Content */}
                            <div className="relative z-10">
                                <div className="text-[10px] font-dupla-black text-gold uppercase tracking-[0.2em] mb-2">
                                    {ally.category} · {ally.city}
                                </div>
                                <h3 className="text-2xl font-dupla-black text-white uppercase tracking-tighter mb-4 group-hover:text-gold transition-colors">
                                    {ally.name}
                                </h3>
                                
                                <div className="flex items-center gap-2 text-white/40 font-dupla-semibold text-xs">
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {ally.address}
                                </div>
                            </div>

                            {/* Corner Accent */}
                            <div className="absolute top-0 right-0 w-2 h-2 bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    ))}
                </div>

                <div className="mt-20 p-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
        </section>
    );
}
