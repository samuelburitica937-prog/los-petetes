import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function GarantiasPage() {
    return (
        <main className="min-h-screen bg-navy pt-32">
            <Header />
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <h1 className="text-5xl font-black text-gold uppercase tracking-tighter mb-4">Garantías de Producto</h1>
                    <p className="text-white/60 text-lg italic">Respaldamos la calidad de cada artículo que distribuimos</p>
                </div>

                <div className="space-y-10">
                    <section className="glass-card p-8 border-l-4 border-gold">
                        <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Tiempos de Cobertura</h2>
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <h4 className="text-gold font-black text-sm uppercase mb-2">Electrónicos y Herramientas</h4>
                                <p className="text-white/60 text-xs">Cuentan con una garantía de 3 a 6 meses según el fabricante por defectos técnicos.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                <h4 className="text-gold font-black text-sm uppercase mb-2">Hogar y Otros</h4>
                                <p className="text-white/60 text-xs">Garantía de 30 días por imperfecciones en materiales o acabados.</p>
                            </div>
                        </div>
                    </section>

                    <section className="glass-card p-8">
                        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">¿Qué cubre la garantía?</h2>
                        <div className="space-y-4">
                            {[
                                { title: 'Defectos de fabricación', desc: 'Fallos en el ensamble o componentes internos que impidan el uso correcto.' },
                                { title: 'Daños de origen', desc: 'Si el artículo llega quebrado o incompleto desde nuestra bodega.' },
                                { title: 'Mal funcionamiento técnico', desc: 'Especialmente para la línea de electrodomésticos y tecnología.' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 hover:bg-white/5 rounded-xl transition-colors group">
                                    <div className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-black group-hover:bg-gold group-hover:text-navy transition-all">
                                        ✓
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-white text-sm">{item.title}</h5>
                                        <p className="text-white/50 text-xs">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="glass-card p-8 bg-red/5 border-red/20">
                        <h2 className="text-xl font-black text-red mb-4 uppercase tracking-tight">Exclusiones</h2>
                        <ul className="list-disc pl-6 space-y-2 text-white/60 text-xs leading-relaxed">
                            <li>Daños causados por mal uso o negligencia en el manejo por parte del cliente.</li>
                            <li>Modificaciones o aperturas del producto no autorizadas.</li>
                            <li>Desgaste natural por el tiempo o uso intensivo.</li>
                            <li>Daños eléctricos por sobrecargas en equipos de tecnología.</li>
                        </ul>
                    </section>

                    <div className="text-center p-8 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-white/40 text-sm">¿Deseas reportar un fallo técnico? <a href="https://wa.me/576068840248" className="text-gold font-bold hover:underline">Iniciar trámite de garantía</a></p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
