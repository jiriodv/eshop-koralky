import { createClient } from '@supabase/supabase-js';
import type { Product } from '../data/mockProducts';

// Tyto hodnoty by v reálném světě měly být v souboru .env jako VITE_SUPABASE_URL a VITE_SUPABASE_ANON_KEY
const supabaseUrl = 'https://yuacjwtdgovitpqsyydt.supabase.co';
const supabaseAnonKey = 'sb_publishable_MxGLWm85gGnULU6hwxgXZQ_f7NjbXfl';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getProductsFromSupabase = async (): Promise<Product[]> => {
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*');

        if (error) {
            console.error('Chyba při dotazu na Supabase:', error.message);
            throw error;
        }

        if (!products || products.length === 0) {
            console.warn('V databázi Supabase (tabulka "products") zatím nejsou žádné produkty.');
            // Fallback pro ukázku vizualizací, pokud uživatel ještě nevytvořil tabulku
            const { mockProducts } = await import('../data/mockProducts');
            return mockProducts;
        }

        // Mapování dat ze Supabase na lokální typ Product
        return products.map((row) => ({
            id: row.id ? row.id.toString() : (row.name || Math.random().toString()),
            name: row.name || 'Neznámý produkt',
            price: row.price || 0,
            description: row.description || '',
            category: row.category || 'Ostatní',
            imageUrl: row.image_url || 'https://images.unsplash.com/photo-1599643478524-fb524b0d510e?q=80&w=600&auto=format&fit=crop',
            inStock: row.in_stock === undefined ? true : Boolean(row.in_stock)
        }));
    } catch (error) {
        console.error('Vyskytla se chyba při komunikaci se Supabase:', error);
        const { mockProducts } = await import('../data/mockProducts');
        return mockProducts;
    }
};
