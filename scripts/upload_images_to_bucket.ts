import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Asegúrate de correr este script con permisos si es necesario
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cagaxhhtizrfmhtvlkps.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);
const SUPABASE_BUCKET_NAME = 'products'; 

async function uploadImages() {
    const dirPath = path.join(process.cwd(), 'public', 'images', 'catalogos', 'sexshop');
    
    if (!fs.existsSync(dirPath)) {
        console.error('La carpeta no existe:', dirPath);
        return;
    }

    const files = fs.readdirSync(dirPath);
    console.log(`Encontrados ${files.length} archivos para subir al bucket...`);

    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const fileData = fs.readFileSync(filePath);
        
        // Vamos a subir los archivos al bucket en la ruta 'images/catalogos/sexshop/nombre.png'
        const destinationPath = `images/catalogos/sexshop/${file}`;

        const { data, error } = await supabase.storage
            .from(SUPABASE_BUCKET_NAME)
            .upload(destinationPath, fileData, {
                upsert: true,
                contentType: 'image/png' // Asumiendo que son PNG
            });

        if (error) {
            console.error(`Error subiendo ${file}:`, error.message);
        } else {
            console.log(`✅ Subido: ${file}`);
        }
    }
    
    console.log('Finalizada la subida de imágenes al bucket de Supabase.');
}

uploadImages();
