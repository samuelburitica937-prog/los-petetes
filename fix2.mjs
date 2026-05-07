import fs from 'fs';
let content = fs.readFileSync('lib/data.ts', 'utf-8');

// Ensure they are in CATEGORIES
if (!content.includes('aseo: { label: \'Aseo\'')) {
    content = content.replace(
        "export const CATEGORIES: Record<Category, { label: string; icon: string; color: string; desc: string }> = {",
        "export const CATEGORIES: Record<Category, { label: string; icon: string; color: string; desc: string }> = {\n  aseo: { label: 'Aseo', icon: '🧹', color: '#00BCD4', desc: 'Productos de aseo' },\n  cacharros: { label: 'Cacharros', icon: '📦', color: '#795548', desc: 'Cacharros varios' },\n  vapers: { label: 'Vapers', icon: '💨', color: '#9C27B0', desc: 'Vapers y afines' },\n  venenos: { label: 'Venenos', icon: '☠️', color: '#F44336', desc: 'Control de plagas' },"
    );
}

// Ensure they are in placeholderImages
if (!content.includes('aseo: [')) {
    content = content.replace(
        "const placeholderImages: Record<Category, string[]> = {",
        "const placeholderImages: Record<Category, string[]> = {\n  aseo: ['https://via.placeholder.com/600x600?text=Aseo'],\n  cacharros: ['https://via.placeholder.com/600x600?text=Cacharros'],\n  vapers: ['https://via.placeholder.com/600x600?text=Vapers'],\n  venenos: ['https://via.placeholder.com/600x600?text=Venenos'],"
    );
}

fs.writeFileSync('lib/data.ts', content);
