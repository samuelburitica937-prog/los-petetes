'use client';
import { CITIES, CATEGORIES, Category } from '@/lib/data';
import Link from 'next/link';

const CATEGORY_IMAGES: Record<string, string> = {
    ferreteria: 'https://images.unsplash.com/photo-1581147036324-c17ac41dfa6c?w=800&q=80',
    belleza: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    salud: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800&q=80',
    hogar: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
    sexshop: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    petshop: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80',
    deportes: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    bebes: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&q=80',
    electrodomesticos: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80',
    tecnologia: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80',
    papeleria: '/images/papeleria-premium.png',
    escolar: '/images/escolar-premium.png',
    oficina: '/images/oficina-premium.png',
    horaloca: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
};

const MAIN_CATS: Category[] = [
    'ferreteria', 'belleza', 'salud', 'hogar',
    'petshop', 'deportes', 'bebes', 'sexshop',
    'electrodomesticos', 'tecnologia', 'papeleria', 'escolar',
    'oficina', 'horaloca'
];

export default function CitiesSection() {
    return (
        <>
            {/* Cities section */}
            <section className="py-24 px-4 md:px-8 bg-navy-dark/50" id="ciudades">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-6xl font-dupla-black text-gold uppercase tracking-tighter mb-4">Nuestras Sedes</h2>
                        <div className="h-1.5 w-32 bg-gold mx-auto mb-6 rounded-full" />
                        <p className="text-white/60 font-dupla-semibold text-lg">Presencia física y logística nacional desde el corazón del Eje Cafetero</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {CITIES.map(city => (
                            <div
                                key={city.name}
                                className="glass-card p-10 text-center group relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="text-6xl mb-6 transform transition-transform group-hover:scale-110 duration-500">{city.emoji}</div>
                                <h3 className="font-dupla-black text-3xl mb-2 text-white">{city.name}</h3>
                                <div className="text-sm font-dupla-semibold mb-6 text-white/40 uppercase tracking-widest">{city.desc}</div>
                                
                                <div
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-dupla-black mb-8 uppercase tracking-widest transition-all"
                                    style={{ background: 'rgba(0,200,100,0.1)', color: '#00C864', border: '1px solid rgba(0,200,100,0.2)' }}
                                >
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    Operación Activa
                                </div>

                                <a
                                    href={city.mapUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-xs font-dupla-black transition-all bg-white/5 border border-white/10 text-white hover:bg-gold hover:text-navy hover:border-gold uppercase tracking-[0.2em]"
                                >
                                    Ubicación en Maps
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* Shipping info */}
                    <div
                        className="mt-20 p-10 rounded-[2.5rem] relative overflow-hidden bg-navy-light/30 border border-white/10"
                    >
                        <div className="absolute top-0 right-0 p-8 text-white/5 text-9xl font-dupla-black select-none pointer-events-none">LOGÍSTICA</div>
                        <h3 className="font-dupla-black text-3xl mb-8 text-gold uppercase tracking-tighter">Estándares de Distribución</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                            {[
                                { icon: '🚚', title: 'Flujo de Despacho', desc: 'Surtido en 24-48 horas hábiles' },
                                { icon: '📦', title: 'Unidades Mínimas', desc: 'Precios mayoristas por volumen' },
                                { icon: '💳', title: 'Canales de Pago', desc: 'Transferencia · Wompi · Corresponsal' },
                            ].map(item => (
                                <div key={item.title} className="flex flex-col items-start text-left">
                                    <div className="text-4xl mb-4 p-3 rounded-2xl bg-white/5">{item.icon}</div>
                                    <div className="font-dupla-black text-white text-lg uppercase tracking-tight mb-2">{item.title}</div>
                                    <div className="font-dupla-semibold text-white/50 leading-relaxed text-sm">{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
