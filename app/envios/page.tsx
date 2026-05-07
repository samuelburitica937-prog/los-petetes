


export default function ShippingPage() {
    return (
        <main className="min-h-screen bg-navy pt-32">
            
            <div className="max-w-5xl mx-auto px-6 py-12">
                <div className="mb-16">
                    <h1 className="text-5xl font-black text-gold uppercase tracking-tighter mb-4">Información de Envíos</h1>
                    <p className="text-white/60 text-lg">Distribución nacional desde el corazón del Eje Cafetero</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    <div className="glass-card p-8">
                        <div className="text-3xl mb-4">🚚</div>
                        <h2 className="text-2xl font-black text-white uppercase mb-4 tracking-tight">Eje Cafetero</h2>
                        <p className="text-white/70 mb-6">Cobertura preferencial en Manizales, Pereira, Armenia y municipios aledaños.</p>
                        <ul className="space-y-3 text-sm font-medium">
                            <li className="flex items-center gap-2 text-green-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                Envío Gratis por compras superiores a $300,000 COP
                            </li>
                            <li className="flex items-center gap-2 text-white/80">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                                Entrega en 24-48 horas hábiles
                            </li>
                            <li className="flex items-center gap-2 text-white/80">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                                Opción de Pago Contra Entrega disponible
                            </li>
                        </ul>
                    </div>

                    <div className="glass-card p-8">
                        <div className="text-3xl mb-4">✈️</div>
                        <h2 className="text-2xl font-black text-white uppercase mb-4 tracking-tight">Envios Nacionales</h2>
                        <p className="text-white/70 mb-6">Llegamos a cada rincón de Colombia a través de las mejores transportadoras.</p>
                        <ul className="space-y-3 text-sm font-medium">
                            <li className="flex items-center gap-2 text-white/80">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                                Alianzas con Servientrega, Interrapidisimo y Envia
                            </li>
                            <li className="flex items-center gap-2 text-white/80">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                                Seguimiento en tiempo real de tu guía
                            </li>
                            <li className="flex items-center gap-2 text-white/80">
                                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                                Cobro revertido o flete pagado según acuerdo
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="glass-card p-8 bg-white/5">
                    <h3 className="text-xl font-black text-gold uppercase mb-6 tracking-widest">Proceso de Despacho</h3>
                    <div className="grid sm:grid-cols-3 gap-8">
                        {[
                            { step: '01', title: 'Confirmación', desc: 'Validamos tu pago y disponibilidad de stock en bodega.' },
                            { step: '02', title: 'Embalaje', desc: 'Protegemos tus productos con empaque reforzado mayorista.' },
                            { step: '03', title: 'Ruta', desc: 'Se genera la guía y sale en el primer camión disponible.' }
                        ].map(item => (
                            <div key={item.step} className="relative">
                                <div className="text-4xl font-black text-white/5 absolute -top-4 -left-2 select-none">{item.step}</div>
                                <h4 className="font-bold text-white mb-2 relative z-10">{item.title}</h4>
                                <p className="text-sm text-white/50">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
        </main>
    );
}
