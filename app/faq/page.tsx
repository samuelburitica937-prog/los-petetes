


export default function FAQPage() {
    const faqs = [
        {
            q: '¿Cómo puedo comprar al por mayor?',
            a: 'Para acceder a precios mayoristas, simplemente regístrate en nuestra plataforma. El sistema aplicará automáticamente los descuentos según el volumen de tu pedido (mínimo 6 unidades por referencia en la mayoría de productos).'
        },
        {
            q: '¿Cuál es el valor mínimo de compra para envíos?',
            a: 'Realizamos envíos a todo el país para pedidos superiores a $100,000 COP. En el Eje Cafetero (Manizales, Pereira, Armenia), los envíos son gratuitos para pedidos mayores a $300,000 COP.'
        },
        {
            q: '¿Qué medios de pago aceptan?',
            a: 'Aceptamos transferencias Bancolombia, Nequi, Daviplata, pagos con tarjeta de crédito vía Wompi y pagos contra entrega únicamente en áreas metropolitanas de Manizales.'
        },
        {
            q: '¿Cuánto tiempo demora mi pedido?',
            a: 'Los pedidos en el Eje Cafetero se entregan en un plazo de 24 a 48 horas hábiles. Para el resto del país, el tiempo estimado es de 3 a 5 días hábiles dependiendo de la transportadora.'
        },
        {
            q: '¿Tienen tienda física?',
            a: 'Sí, somos una distribuidora mayorista con sede principal en Manizales. Puedes visitarnos en nuestras bodegas para retirar pedidos directamente.'
        }
    ];

    return (
        <main className="min-h-screen bg-navy pt-32">
            
            <div className="max-w-4xl mx-auto px-6 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-gold uppercase tracking-tighter mb-4">Preguntas Frecuentes</h1>
                    <p className="text-white/60 text-lg">Todo lo que necesitas saber sobre Los Petetes Mayorista</p>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <div key={i} className="glass-card p-8 hover:border-gold/30 transition-all">
                            <h3 className="text-xl font-black text-white mb-4 flex gap-4">
                                <span className="text-gold">Q.</span> {faq.q}
                            </h3>
                            <p className="text-white/70 leading-relaxed pl-8 border-l-2 border-white/10">
                                {faq.a}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 glass-card p-8 bg-gold/5 border-gold/20 text-center">
                    <h3 className="font-black text-white uppercase mb-2">¿No encontraste lo que buscabas?</h3>
                    <p className="text-white/60 mb-6">Estamos listos para ayudarte personalmente.</p>
                    <a href="https://wa.me/573145090821" className="btn-primary px-10 py-4 font-black uppercase tracking-widest inline-block">
                        Hablar con un asesor
                    </a>
                </div>
            </div>
            
        </main>
    );
}
