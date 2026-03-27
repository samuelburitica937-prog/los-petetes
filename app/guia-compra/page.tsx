import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BuyingGuidePage() {
    return (
        <main className="min-h-screen bg-navy pt-32">
            <Header />
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-5xl font-black text-gold uppercase tracking-tighter mb-8">Guía de Compra Mayorista</h1>
                
                <div className="space-y-12">
                    <section className="glass-card p-8">
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-4">
                            <span className="w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center text-xl">1</span>
                            Registro de Cliente
                        </h2>
                        <p className="text-white/70 mb-4">
                            El primer paso para acceder a nuestros precios exclusivos es crear una cuenta. 
                            Asegúrate de marcar la opción <strong>"Soy Comprador Mayorista"</strong> durante el registro.
                        </p>
                        <a href="/registro" className="text-gold font-bold hover:underline">Ir a Registro →</a>
                    </section>

                    <section className="glass-card p-8 border-l-4 border-gold">
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-4">
                            <span className="w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center text-xl">2</span>
                            Selección de Productos
                        </h2>
                        <p className="text-white/70 mb-4">
                            Navega por nuestras categorías. Verás dos precios: el precio al detal y el <strong>Precio Mayorista</strong>. 
                            Para habilitar el precio mayorista, debes cumplir con la cantidad mínima (usualmente 6 o 12 unidades).
                        </p>
                    </section>

                    <section className="glass-card p-8">
                        <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-4">
                            <span className="w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center text-xl">3</span>
                            Finalizar y Pagar
                        </h2>
                        <p className="text-white/70 mb-4">
                            Una vez tengas todo en el carrito, dirígete al botón "Pagar". Podrás elegir entre transferencia bancaria directa (más rápido) o pago con tarjeta. 
                            Si estás en Manizales, puedes elegir <strong>Pago Contra Entrega</strong>.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    );
}
