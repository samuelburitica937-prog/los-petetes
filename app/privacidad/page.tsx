


export default function PrivacidadPage() {
    return (
        <main className="bg-navy min-h-screen text-white pt-32">
            
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-black mb-2 text-gold uppercase tracking-tighter">Política de Privacidad</h1>
                <p className="text-white/60 mb-8 italic">Última actualización: 4 de marzo de 2026</p>

                <div className="space-y-8 text-white/80 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-red pl-4">1. Recolección de Información</h2>
                        <p>
                            En **LOS PETETES**, recolectamos información personal necesaria para procesar sus pedidos: nombre completo,
                            NIT o Cédula, dirección de envío, correo electrónico y número de contacto. Esta información es esencial para
                            la logística de distribución mayorista en el Eje Cafetero.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-red pl-4">2. Uso de los Datos</h2>
                        <p>Sus datos son utilizados exclusivamente para:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Procesar y despachar sus pedidos mayoristas.</li>
                            <li>Enviar actualizaciones de estado de envío vía WhatsApp o Email.</li>
                            <li>Informar sobre nuevas listas de precios y ofertas exclusivas para distribuidores.</li>
                            <li>Cumplir con obligaciones legales de facturación electrónica.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-red pl-4">3. Protección y Almacenamiento</h2>
                        <p>
                            Implementamos medidas de seguridad técnicas y administrativas para proteger sus datos contra acceso no autorizado,
                            alteración o pérdida. No vendemos ni compartimos sus bases de datos con terceros con fines publicitarios ajenos a nuestra actividad comercial.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-red pl-4">4. Derechos del Titular</h2>
                        <p>
                            En concordancia con la Ley 1581 de 2012, usted tiene derecho a conocer, actualizar y rectificar su información personal en cualquier momento
                            escribiéndonos a nuestro canal oficial de soporte.
                        </p>
                    </section>
                </div>
            </div>
            
        </main>
    );
}
