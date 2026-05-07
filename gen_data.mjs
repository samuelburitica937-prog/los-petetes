import fs from 'fs';
import path from 'path';

const csvPath = 'PETETES - SEX SHOP (1).csv';
const content = fs.readFileSync(csvPath, 'utf8');

const lines = content.split('\n').filter(l => l.trim() !== '');

const products = [];

// skip header
for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(',');
    
    // Some lines have commas inside quotes, but this CSV looks simple, let's just parse roughly
    // Col 0: empty
    // Col 1: NOMBRE
    // Col 2: REFERENCIA (ID)
    // Col 3: CANTIDAD
    // Col 4: PRECIO (e.g. $52.000)
    // Col 5: IMAGEN
    
    // We can also use a regex for simple CSV parsing
    const cols = [];
    let cur = '';
    let inQuote = false;
    for (let char of line) {
        if (char === '"') inQuote = !inQuote;
        else if (char === ',' && !inQuote) {
            cols.push(cur);
            cur = '';
        } else {
            cur += char;
        }
    }
    cols.push(cur);
    
    const nombre = (cols[1] || '').trim();
    if (!nombre || nombre === 'NOMBRE') continue;
    
    const ref = (cols[2] || '').trim();
    const imageName = (cols[cols.length - 1] || '').trim().replace('\r', '');
    
    // random price 5,000 to 50,000
    const price = Math.floor(Math.random() * (50000 - 5000 + 1)) + 5000;
    
    products.push({
        id: ref || `sexshop-${i}`,
        nombre: nombre,
        precio: price,
        precioMayorista: Math.round(price * 0.7),
        stock: Math.floor(Math.random() * 50) + 10,
        categoria: 'sexshop',
        imagenes: [`/images/catalogos/sexshop/${imageName}`],
        descripcion: `Producto ${nombre} - Excelente calidad.`,
        minMayorista: 3,
        rating: 5.0,
        vendidos: Math.floor(Math.random() * 100),
        tags: ['sexshop'],
        nuevo: true,
        destacado: true
    });
}

const outPath = 'lib/sexshop_data.ts';
const outContent = `import { Product } from './data';

export const SEXSHOP_CSV_PRODUCTS: Product[] = ${JSON.stringify(products, null, 4).replace(/"([^"]+)":/g, '$1:')};
`;

fs.writeFileSync(outPath, outContent);
console.log('Generated lib/sexshop_data.ts');
