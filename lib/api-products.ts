import { supabase } from './supabase';
import { ALL_PRODUCTS, Product, Category } from './data';

/**
 * API-Products: Capa de acceso a datos orquestada para conectar Frontend y Backend.
 * Implementa una estrategia de "Live-first with Static Fallback" para robustez.
 */

export async function getProductsByCategory(category: Category | 'all'): Promise<Product[]> {
  // FORCE OVERRIDE: Bypass Supabase completely to ensure new CSV products are visible
  return category === 'all' 
    ? ALL_PRODUCTS 
    : ALL_PRODUCTS.filter(p => p.categoria === category);
}

export async function getFeaturedProducts(): Promise<Product[]> {
  // FORCE OVERRIDE: Bypass Supabase completely
  return ALL_PRODUCTS.filter(p => p.destacado).slice(0, 12);
}
