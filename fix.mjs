import fs from 'fs';
let content = fs.readFileSync('lib/data.ts', 'utf-8');
content = content.replace("ferreteria: {", "aseo: { nombres: ['Aseo'], basePrice: 1000 }, cacharros: { nombres: ['Cacharros'], basePrice: 1000 }, vapers: { nombres: ['Vapers'], basePrice: 1000 }, venenos: { nombres: ['Venenos'], basePrice: 1000 }, ferreteria: {");
fs.writeFileSync('lib/data.ts', content);
