'use client';

import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ALL_PRODUCTS, CATEGORIES, Category } from '@/lib/data';
import { generateCatalogPDF } from '@/lib/pdf-utils';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const MAIN_CATS: Category[] = [
    'ferreteria', 'belleza', 'salud',
    'hogar', 'sexshop', 'petshop',
    'deportes', 'bebes', 'electrodomesticos',
    'tecnologia', 'papeleria', 'escolar',
    'oficina', 'horaloca', 'jugueteria',
];

export default function ExportadorB2BPage() {
    const [generating, setGenerating] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleExport = async () => {
        setGenerating(true);
        setProgress(0);
        
        try {
            const zip = new JSZip();
            const dateStr = new Date().toLocaleDateString('es-CO').replace(/\//g, '-');
            
            for (let i = 0; i < MAIN_CATS.length; i++) {
                const cat = MAIN_CATS[i];
                const catInfo = CATEGORIES[cat];
                if (!catInfo) continue;

                // 1. Filtrar productos de esta categoria
                const items = ALL_PRODUCTS.filter(p => p.categoria === cat);
                if (items.length === 0) {
                    setProgress(((i + 1) / MAIN_CATS.length) * 100);
                    continue; // Skip categorias vacias
                }

                // 2. Mapear al Product interface completo requerido
                const catalogItems = items.map(p => ({
                    nombre: p.nombre,
                    referencia: p.id,
                    descripcion: p.descripcion,
                    precioMayorista: p.precioMayorista,
                    precioSugerido: p.precio,
                    unidadMinima: p.minMayorista,
                    disponible: p.stock > 0,
                    imagenes: p.imagenes,
                }));

                // 3. Generar PDF como Blob (returnBlob = true)
                const pdfBlob = await generateCatalogPDF(cat, catalogItems, true);
                
                // 4. Agregar al ZIP
                if (pdfBlob) {
                    const cleanName = catInfo.label.replace(/[^a-zA-Z0-9]/g, '_');
                    const fileName = `Catalogo_${cleanName}_Petetes.pdf`;
                    zip.file(fileName, pdfBlob);
                }

                setProgress(((i + 1) / MAIN_CATS.length) * 100);
            }

            // 5. Generar y descargar el ZIP
            setProgress(100);
            const content = await zip.generateAsync({ type: 'blob' });
            saveAs(content, `Catalogos_LosPetetes_${dateStr}.zip`);
            
        } catch (error) {
            console.error(error);
            alert("Hubo un error generando los catálogos.");
        } finally {
            setGenerating(false);
            setProgress(0);
        }
    };

    return (
        <main className="bg-navy min-h-screen">
            <Header />
            
            <div className="pt-40 pb-20 px-4 max-w-4xl mx-auto text-center">
                <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl -z-10 -translate-x-1/2 translate-y-1/2" />
                    
                    <span className="text-6xl mb-6 block">🗂️</span>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter mb-4">
                        Centro de <br /> Exportación B2B
                    </h1>
                    <p className="text-white/60 mb-12 max-w-xl mx-auto text-lg leading-relaxed">
                        Presiona el botón para empaquetar automáticamente los 15 catálogos con el diseño visual, el carrito de compras integrado y las líneas asignadas para **Johana y Laura**.
                    </p>

                    <button
                        onClick={handleExport}
                        disabled={generating}
                        className="relative mx-auto flex items-center justify-center gap-4 bg-gold text-navy font-black text-xl py-6 px-10 rounded-2xl uppercase hover:scale-105 active:scale-95 transition-all w-full md:w-auto shadow-[0_0_40px_rgba(255,215,0,0.3)] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                    >
                        {generating ? (
                            <>
                                <span className="animate-spin text-3xl">⚙️</span>
                                PROCESANDO Catálogos...
                            </>
                        ) : (
                            <>
                                <span className="text-3xl">🚀</span>
                                Descargar Carpeta ZIP (15 PDFs)
                            </>
                        )}
                        
                        {/* Progress Bar Background */}
                        {generating && (
                            <div className="absolute bottom-0 left-0 h-1.5 bg-green-500 transition-all duration-300 rounded-b-2xl" style={{ width: `${progress}%` }} />
                        )}
                    </button>
                    
                    {generating && (
                        <p className="mt-6 text-gold font-bold text-sm uppercase tracking-widest animate-pulse">
                            ¡Esto puede tomar un minuto recolectando todas las partes! ({Math.round(progress)}%)
                        </p>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
