import { createClient } from '@supabase/supabase-js';

// Inicializa el cliente usando Service Role Key para poder sobreescribir RLS en un script de backend
// IMPORTANTE: Asegúrate de tener estas variables en tu entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://tu-proyecto.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'tu-service-role-key';
const supabase = createClient(supabaseUrl, supabaseKey);

const SUPABASE_BUCKET_NAME = 'products'; // Asegúrate de tener un bucket público llamado 'products'

/**
 * Función optimizada para importar un array masivo de objetos a Supabase
 * @param csvProducts Array de hasta 50,000 objetos provenientes del CSV
 */
export async function uploadProductsToSupabase(csvProducts: any[]) {
    const BATCH_SIZE = 1000; // Procesamos en lotes de 1000 para no saturar la red ni la base de datos

    console.log(`Iniciando carga de ${csvProducts.length} productos a Supabase...`);

    for (let i = 0; i < csvProducts.length; i += BATCH_SIZE) {
        const batch = csvProducts.slice(i, i + BATCH_SIZE);
        
        // Transformar los objetos del CSV al esquema de la tabla 'products'
        const productsToInsert = batch.map(product => {
            
            // OPTIMIZACIÓN LAZY LOADING Y BUCKET URL:
            // Al construir la URL de la imagen, generamos directamente la URL pública de Supabase Storage.
            // Esto permite que el frontend use esta URL directamente en etiquetas <img loading="lazy" /> 
            // o <Image /> de Next.js sin necesidad de descargar el archivo internamente.
            const imageUrls = product.imagenes?.map((imgName: string) => {
                const { data } = supabase.storage.from(SUPABASE_BUCKET_NAME).getPublicUrl(imgName);
                return data.publicUrl;
            }) || [];

            return {
                id: product.id,
                nombre: product.nombre,
                precio: product.precio,
                precio_mayorista: product.precioMayorista || Math.round(product.precio * 0.7), // Asumiendo margen
                stock: product.stock || 10,
                categoria: product.categoria || 'sexshop',
                imagenes: imageUrls,
                descripcion: product.descripcion || '',
                min_mayorista: product.minMayorista || 3,
                rating: product.rating || 5.0,
                vendidos: product.vendidos || 0,
                nuevo: product.nuevo || true,
                destacado: product.destacado || false
            };
        });

        // Upsert en bloque optimizado
        const { error } = await supabase
            .from('products')
            .upsert(productsToInsert, {
                onConflict: 'id', // Llave primaria para no duplicar datos
                ignoreDuplicates: false // Actualiza si ya existe
            });

        if (error) {
            console.error(`Error insertando el lote ${i} - ${i + BATCH_SIZE}:`, error.message);
        } else {
            console.log(`Lote ${i} - ${i + BATCH_SIZE} procesado e insertado exitosamente con upsert.`);
        }
    }

    console.log('✅ Carga completa a la tabla "products".');
}

// Ejemplo de uso:
// import { parseCSV } from './alguna-libreria-csv';
// const data = parseCSV('PETETES - SEX SHOP (1).csv');
// uploadProductsToSupabase(data);
