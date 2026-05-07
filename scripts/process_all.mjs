import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import sharp from 'sharp';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cagaxhhtizrfmhtvlkps.supabase.co';
const supabaseServiceRoleKey = 'sb_secret_SYffWUHhZlRHbMgQAMTC1g_lZi7rSkJ';
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const BASE_DIR = 'C:\\Users\\kabaru\\Desktop\\CATALOGO LO PETETES SUPABASE';
const BUCKET_NAME = 'catalogos';

const categoriesMap = {
    'PETETES - ASEO.csv': { slug: 'aseo', imgFolder: 'aseo-20260507T080427Z-3-001/aseo' },
    'PETETES - CACHARROS.csv': { slug: 'cacharros', imgFolder: 'cacharros-20260507T080430Z-3-001/cacharros' },
    'PETETES - DEPORTES.csv': { slug: 'deportes', imgFolder: 'deportes-20260507T080432Z-3-001/deportes' },
    'PETETES - FERRETERIA.csv': { slug: 'ferreteria', imgFolder: 'ferreteria-20260507T080433Z-3-001/ferreteria' },
    'PETETES - HOGAR .csv': { slug: 'hogar', imgFolder: 'hogar-20260507T080435Z-3-001/hogar' },
    'PETETES - PAPELERIA.csv': { slug: 'papeleria', imgFolder: 'papeleria-20260507T080436Z-3-001/papeleria' },
    'PETETES - PET SHOP.csv': { slug: 'petshop', imgFolder: 'pet-shop-20260507T080440Z-3-001/pet-shop' },
    'PETETES - VAPERS Y GRINDER.csv': { slug: 'vapers', imgFolder: 'vapers-y-grinder-20260507T080447Z-3-001/vapers-y-grinder' },
    'PETETES - VENENOS.csv': { slug: 'venenos', imgFolder: 'venenos-20260507T080449Z-3-001/venenos' }
};

function parseCSVLine(line) {
    const fields = [];
    let currentField = '';
    let insideQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && line[i+1] === '"') {
            currentField += '"';
            i++;
        } else if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            fields.push(currentField);
            currentField = '';
        } else {
            currentField += char;
        }
    }
    fields.push(currentField);
    return fields.map(f => f.trim());
}

async function uploadImage(catSlug, imgName, fullImgPath) {
    const cleanName = imgName.replace(/[^a-zA-Z0-9_\-\.]/g, '_');
    const storagePath = `${catSlug}/${cleanName}`;
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${storagePath}`;
    
    try {
        const buffer = await sharp(fullImgPath)
            .resize({ width: 600, withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();
            
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(storagePath, buffer, {
                contentType: 'image/webp',
                upsert: true
            });
            
        if (error) {
            console.error(`Error uploading ${storagePath}:`, error.message);
            return null;
        }
        return publicUrl;
    } catch (err) {
        console.error(`Error processing image ${fullImgPath}:`, err.message);
        return null;
    }
}

async function processCategory(csvFile, mapping) {
    console.log(`\n--- Processing ${mapping.slug} ---`);
    const csvPath = path.join(BASE_DIR, csvFile);
    if (!fs.existsSync(csvPath)) {
        console.log(`CSV not found: ${csvPath}`);
        return [];
    }

    const imgDir = path.join(BASE_DIR, mapping.imgFolder);
    let availableImages = [];
    if (fs.existsSync(imgDir)) {
        availableImages = fs.readdirSync(imgDir);
    }

    const content = fs.readFileSync(csvPath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim().length > 0);
    // skip headers (2 rows usually)
    const dataLines = lines.slice(2);
    
    const products = [];
    const dbRows = [];

    for (let line of dataLines) {
        const fields = parseCSVLine(line);
        if (fields.length < 5) continue;
        
        let nombre = fields[1];
        let id = fields[2];
        let precioMayoristaStr = fields[4] || '';
        let imagenesField = fields[5] || '';
        
        let precioMayorista = parseInt(precioMayoristaStr.replace(/[^\d]/g, '')) || 0;
        let minMayorista = 3;
        let stock = 100;
        let p_publico = Math.round(precioMayorista * 1.4);
        let descripcion = `Referencia: ${id}. Venta mínima: ${minMayorista} uds.`;

        if (precioMayorista === 0 || !id || !nombre) continue;

        let finalImageUrls = [];
        let firstImg = imagenesField.split(',')[0].trim();
        if (firstImg) {
            if (!firstImg.toLowerCase().endsWith('.png') && !firstImg.toLowerCase().endsWith('.jpg') && !firstImg.toLowerCase().endsWith('.jpeg')) {
                firstImg += '.png';
            }
            
            let cleanExpected = firstImg.replace(/\*/g, '').replace(/\//g, '_');
            if (cleanExpected.includes(' (C23009)')) cleanExpected = cleanExpected.replace(' (C23009)', '');

            let matchedFile = availableImages.find(f => f === cleanExpected || f.toLowerCase() === cleanExpected.toLowerCase());
            if (!matchedFile) {
                // Try partial
                matchedFile = availableImages.find(f => {
                    const fName = f.replace(/\.(png|jpg|jpeg)$/i, '');
                    const cName = cleanExpected.replace(/\.(png|jpg|jpeg)$/i, '');
                    return fName.includes(cName) || cName.includes(fName);
                });
            }

            if (matchedFile) {
                const fullImgPath = path.join(imgDir, matchedFile);
                const webpName = matchedFile.replace(/\.(png|jpg|jpeg)$/i, '.webp');
                const uploadedUrl = await uploadImage(mapping.slug, webpName, fullImgPath);
                if (uploadedUrl) {
                    finalImageUrls.push(uploadedUrl);
                }
            } else {
                console.log(`Image not found for ${id}: ${firstImg} (Expected: ${cleanExpected})`);
                finalImageUrls.push(`https://via.placeholder.com/600x600?text=${encodeURIComponent(nombre)}`);
            }
        } else {
            finalImageUrls.push(`https://via.placeholder.com/600x600?text=${encodeURIComponent(nombre)}`);
        }

        const productObj = {
            id: `${mapping.slug}-${id.replace(/[^a-zA-Z0-9]/g, '')}`, 
            nombre: nombre,
            descripcion: descripcion,
            precio: p_publico,
            precioMayorista: precioMayorista,
            minMayorista: minMayorista,
            categoria: mapping.slug,
            imagenes: finalImageUrls,
            stock: stock,
            destacado: Math.random() > 0.8
        };
        products.push(productObj);

        dbRows.push({
            id: productObj.id,
            nombre: productObj.nombre,
            descripcion: productObj.descripcion,
            precio: productObj.precio,
            precio_mayorista: productObj.precioMayorista,
            min_mayorista: productObj.minMayorista,
            categoria: productObj.categoria,
            imagenes: productObj.imagenes,
            stock: productObj.stock,
            destacado: productObj.destacado
        });
    }

    if (dbRows.length > 0) {
        console.log(`Upserting ${dbRows.length} products to Supabase for ${mapping.slug}...`);
        const { error } = await supabase.from('productos').upsert(dbRows, { onConflict: 'id' });
        if (error) {
            console.error(`Error upserting DB for ${mapping.slug}:`, error.message);
        }
    }

    return products;
}

async function main() {
    console.log("Starting master import process...");
    let allProducts = [];

    for (const [csvFile, mapping] of Object.entries(categoriesMap)) {
        const catProducts = await processCategory(csvFile, mapping);
        allProducts = allProducts.concat(catProducts);
    }

    console.log(`\nFinished importing ${allProducts.length} products total!`);
    
    const content = `// Auto-generated by script
import { Product } from './types';

export const IMPORTED_PRODUCTS: Product[] = ${JSON.stringify(allProducts, null, 2)};
`;
    fs.writeFileSync('C:\\Users\\kabaru\\Desktop\\WEB LOS PETETES\\lospetetes\\lib\\imported_data.ts', content);
    console.log("Saved static fallback array to lib/imported_data.ts");
}

main();
