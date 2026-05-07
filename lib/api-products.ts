import { supabase } from './supabase';
import { ALL_PRODUCTS, Product, Category } from './data';

/**
 * API-Products: Capa de acceso a datos orquestada para conectar Frontend y Backend.
 * Implementa una estrategia de "Live-first with Static Fallback" para robustez.
 */

export async function getProductsByCategory(category: Category | 'all'): Promise<Product[]> {
  try {
    let query = supabase.from('products').select('*');
    if (category !== 'all') {
      query = query.eq('categoria', category);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map(p => ({
        id: p.id,
        nombre: p.nombre,
        precio: parseFloat(p.precio),
        precioMayorista: parseFloat(p.precio_mayorista),
        stock: p.stock,
        categoria: p.categoria as Category,
        imagenes: (p.imagenes || []).map((img: string) => {
          if (img.includes('supabase.co/storage') && img.includes('/sexshop/')) {
            const fileName = img.split('/').pop();
            return `/images/catalogos/sexshop/${fileName}`;
          }
          if (img.startsWith('http') || img.startsWith('/')) return img;
          return `/images/catalogos/sexshop/${img}`;
        }),
        descripcion: p.descripcion,
        minMayorista: p.min_mayorista,
        rating: p.rating,
        vendidos: p.vendidos,
        tags: [p.categoria], // Basic tagging
        destacado: p.destacado
      }));
    }
  } catch (err) {
    console.warn("Supabase Fetch Failed, falling back to static data", err);
  }
  
  // Static Fallback
  return category === 'all' 
    ? ALL_PRODUCTS 
    : ALL_PRODUCTS.filter(p => p.categoria === category);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('destacado', true)
      .limit(12);
      
    if (error) throw error;
    
    if (data && data.length > 0) {
      return data.map(p => ({
        id: p.id,
        nombre: p.nombre,
        precio: parseFloat(p.precio),
        precioMayorista: parseFloat(p.precio_mayorista),
        stock: p.stock,
        categoria: p.categoria as Category,
        imagenes: (p.imagenes || []).map((img: string) => {
          if (img.includes('supabase.co/storage') && img.includes('/sexshop/')) {
            const fileName = img.split('/').pop();
            return `/images/catalogos/sexshop/${fileName}`;
          }
          if (img.startsWith('http') || img.startsWith('/')) return img;
          return `/images/catalogos/sexshop/${img}`;
        }),
        descripcion: p.descripcion,
        minMayorista: p.min_mayorista,
        rating: p.rating,
        vendidos: p.vendidos,
        tags: [p.categoria],
        destacado: p.destacado
      }));
    }
  } catch (err) {
     console.warn("Supabase Featured Fetch Failed, falling back to static data", err);
  }
  
  return ALL_PRODUCTS.filter(p => p.destacado).slice(0, 12);
}
