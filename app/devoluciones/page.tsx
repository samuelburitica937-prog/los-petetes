import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DevolucionesPage() {
    return (
        <main className="min-h-screen bg-navy pt-32">
            <Header />
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="mb-12">
                    <h1 className="text-5xl font-black text-gold uppercase tracking-tighter mb-4">Política de Devoluciones</h1>
                    <p className="text-white/60 text-lg italic">Garantizamos la satisfacción de nuestros aliados mayoristas</p>
                </div>

                <div className="space-y-10">
                    <section className="glass-card p-8 border-l-4 border-red">
                        <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Condiciones Generales</h2>
                        <p className="text-white/70 leading-relaxed mb-4">
                            En Los Petetes, entendemos la dinámica del comercio mayorista. Por ello, aceptamos devoluciones bajo las siguientes premisas:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-white/60 text-sm">
                            <li>El producto debe estar en su empaque original y sin señales de uso.</li>
                            <li>La solicitud debe realizarse dentro de los primeros 5 días hábiles tras recibir el pedido.</li>
                            <li>No se aceptan devoluciones de productos en promoción o liquidación, salvo por defectos de fábrica.</li>
                        </ul>
                    </section>

                    <section className="glass-card p-8 bg-white/5">
                        <h2 className="text-2xl font-black text-gold mb-4 uppercase tracking-tight">Proceso de Devolución</h2>
                        <div className="grid gap-6">
                            <div className="flex gap-4">
                                <div className="font-black text-gold text-2xl">01</div>
                                <div>
                                    <h4 className="font-bold text-white uppercase text-sm">Notificación</h4>
                                    <p className="text-white/50 text-xs">Escríbenos a nuestra línea de atención mayorista con el número de factura y fotos del producto.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="font-black text-gold text-2xl">02</div>
                                <div>
                                    <h4 className="font-bold text-white uppercase text-sm">Verificación</h4>
                                    <p className="text-white/50 text-xs">Nuestro equipo de auditoría revisará el caso en un plazo de 24 horas.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="font-black text-gold text-2xl">03</div>
                                <div>
                                    <h4 className="font-bold text-white uppercase text-sm">Resolución</h4>
                                    <p className="text-white/50 text-xs">Podrás elegir entre el cambio por otra referencia o saldo a favor para tu próxima compra.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="text-center p-8 bg-gold/5 rounded-2xl border border-gold/10">
                        <p className="text-white/40 text-sm">¿Necesitas iniciar una devolución? <a href="https://wa.me/576068840248" className="text-gold font-bold hover:underline">Habla con un asesor por WhatsApp</a></p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
