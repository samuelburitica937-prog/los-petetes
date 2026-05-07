


export default function TerminosPage() {
    return (
        <main className="bg-navy min-h-screen text-white pt-32">
            
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-black mb-2 text-gold uppercase tracking-tighter">Términos y Condiciones</h1>
                <p className="text-white/60 mb-8 italic">Última actualización: 4 de marzo de 2026</p>

                <div className="space-y-8 text-white/80 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-red pl-4">1. Relación Contractual</h2>
                        <p>
                            Los presentes Términos y Condiciones regulan el acceso y uso de la plataforma de comercio electrónico de **LOS PETETES**,
                            en adelante "La Empresa". Al utilizar nuestro sitio web, usted acepta cumplir cabalmente con estas disposiciones.
                            Si no está de acuerdo con alguna de ellas, debe abstenerse de realizar transacciones en nuestra plataforma.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-red pl-4">2. Modelo de Negocio Mayorista</h2>
                        <p>
                            LOS PETETES es una distribuidora mayorista. Todos los precios exhibidos están condicionados a la compra por volumen.
                            Cada producto especifica una **Cantidad Mínima de Pedido (MOQ)** necesaria para aplicar el precio mayorista.
                            Nos reservamos el derecho de cancelar pedidos que no cumplan con estas condiciones mínimas sin previo aviso.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-red pl-4">3. Precios y Disponibilidad</h2>
                        <p>
                            Todos los precios están sujetos a cambios sin previo aviso debido a la fluctuación de mercados internacionales o costos logísticos.
                            Aunque nos esforzamos por mantener el inventario actualizado, la disponibilidad de los productos se confirma al momento del despacho.
                            En caso de falta de stock, se ofrecerán alternativas o el reembolso correspondiente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-red pl-4">4. Envíos y Logística</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>**Cobertura:** Realizamos despachos directos a Armenia, Pereira y Manizales. Para otras ciudades, el envío se coordina con transportadoras externas.</li>
                            <li>**Tiempos:** El tiempo estimado de despacho es de 24 a 48 horas hábiles después de confirmado el pago o el pedido (en caso de contra-entrega).</li>
                            <li>**Costo de envío:** Los costos varían según el volumen y peso de la carga.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-red pl-4">5. Garantías y Devoluciones</h2>
                        <p>
                            Por la naturaleza de la venta mayorista, las devoluciones solo se aceptan por defectos de fábrica comprobados dentro de los 5 días hábiles
                            posteriores a la recepción. No se aceptan cambios por rotación de inventario o desestimación del producto por parte de los clientes finales del comprador.
                        </p>
                    </section>
                </div>
            </div>
            
        </main>
    );
}
