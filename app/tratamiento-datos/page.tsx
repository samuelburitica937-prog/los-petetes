


export default function TratamientoDatosPage() {
    return (
        <main className="bg-navy min-h-screen text-white pt-32">
            
            <div className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-black mb-2 text-gold uppercase tracking-tighter">Tratamiento de Datos Personales</h1>
                <p className="text-white/60 mb-8 italic">Autorización conforme a la Ley 1581 de 2012</p>

                <div className="space-y-8 text-white/80 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-red pl-4">Aviso de Privacidad</h2>
                        <p>
                            **LOS PETETES**, identificado con NIT vigente, comunica a todos sus clientes mayoristas, proveedores y aliados que somos los responsables
                            del tratamiento de sus datos personales. Al registrarse en nuestra plataforma, usted autoriza de manera previa, expresa e informada
                            el tratamiento de su información.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-red pl-4">Finalidades Destacadas</h2>
                        <p>El tratamiento de datos tiene como objetivo principal:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Gestión comercial de ventas por volumen.</li>
                            <li>Verificación de antecedentes comerciales y crediticios.</li>
                            <li>Gestión de cobranza y cartera.</li>
                            <li>Envío de facturación electrónica según DIAN.</li>
                            <li>Comunicaciones sobre promociones de temporada (Día del Padre, Escolar, etc.).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4 border-l-4 border-red pl-4">Procedimiento para el ejercicio de sus derechos</h2>
                        <p>
                            Usted puede consultar, actualizar, corregir o solicitar la supresión de sus datos en nuestra base de datos enviando un correo
                            electrónico indicando en el asunto "Derecho de Hábeas Data". Su solicitud será atendida en un plazo máximo de 10 días hábiles.
                        </p>
                    </section>

                    <div className="p-6 bg-white/5 rounded-2xl border border-white/10 mt-12">
                        <p className="text-sm italic">
                            Esta política hace parte integral del Manual de Procedimientos Internos de LOS PETETES para el cumplimiento de la Ley Estatuaria de Protección de Datos.
                        </p>
                    </div>
                </div>
            </div>
            
        </main>
    );
}
