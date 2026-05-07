


export default function CookiesPage() {
    return (
        <main className="bg-navy min-h-screen text-white pt-32">
            
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-black mb-2 text-gold uppercase tracking-tighter">Política de Cookies</h1>
                <p className="text-white/60 mb-8 italic">Última actualización: 4 de marzo de 2026</p>

                <div className="space-y-8 text-white/80 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-red pl-4">¿Qué son las cookies?</h2>
                        <p>
                            Las cookies son pequeños archivos de texto que se almacenan en su navegador cuando visita nuestra tienda.
                            Ayudan a que el sitio web funcione correctamente y nos permiten recordar sus preferencias de compra mayorista.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-red pl-4">Tipos de Cookies que utilizamos</h2>
                        <ul className="list-disc pl-6 space-y-4">
                            <li><strong>Cookies Técnicas:</strong> Esenciales para que el carrito de compras funcione y pueda mantener su sesión activa.</li>
                            <li><strong>Cookies de Personalización:</strong> Permiten recordar su ciudad de entrega (Armenia, Pereira o Manizales) para mostrarle costos de envío precisos.</li>
                            <li><strong>Cookies de Análisis:</strong> Nos ayudan a entender qué categorías de productos son las más buscadas (ej. Ferretería o Pet Shop) para mejorar nuestro inventario.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-red pl-4">Control de Cookies</h2>
                        <p>
                            Usted puede configurar su navegador para bloquear o ser alertado sobre estas cookies, pero algunas partes del sitio no funcionarán.
                            La mayoría de los navegadores permiten gestionar las preferencias de cookies a través de su menú de configuración.
                        </p>
                    </section>
                </div>
            </div>
            
        </main>
    );
}
