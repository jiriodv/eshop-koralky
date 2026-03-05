import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Získejte URL z argumentů příkazové řádky nebo .env (pro lokální vývoj lze zadat sem)
// Předpokládáme, že URL Google tabulky je v proměnné prostředí VITE_GOOGLE_SHEETS_CSV_URL
const CSV_URL = process.env.VITE_GOOGLE_SHEETS_CSV_URL || '';

async function fetchAndSaveProducts() {
  console.log('Spouštím stahování produktů z Google Sheets...');

  if (!CSV_URL) {
    console.warn('⚠️ Není nastavena proměnná VITE_GOOGLE_SHEETS_CSV_URL. Produkty se nestáhnou.');
    // Můžeme vytvořit prázdný JSON soubor nebo zachovat původní, pokud existuje.
    createEmptyJsonIfMissing();
    return;
  }

  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`Chyba při stahování: ${response.status} ${response.statusText}`);
    }
    const csvText = await response.text();

    console.log('CSV data stažena, začínám parsovat...');

    // Parsování CSV dat pomocí PapaParse
    Papa.parse(csvText, {
      header: true, // Předpokládáme, že první řádek v tabulce jsou názvy sloupců (id, name, price, atd.)
      skipEmptyLines: true,
      complete: (results) => {
        // Formátování dat do očekávané struktury
        const products = results.data.map((row: any) => {
          // Bezpečné parsování id
          const id = row.id ? String(row.id).trim() : `p_${Math.random().toString(36).substr(2, 9)}`;

          // Bezpečné parsování ceny
          let price = 0;
          if (row.price) {
            const cleanedPrice = String(row.price).replace(/[^0-9.,]/g, '').replace(',', '.');
            price = parseFloat(cleanedPrice) || 0;
          }

          // Bezpečné parsování boolean hodnoty inStock
          let inStock = true;
          if (row.inStock !== undefined) {
            // Odstraníme bílé znaky a neviditelné znaky (jako \r na konci řádku z Google Sheets)
            const stockStr = String(row.inStock).toLowerCase().replace(/[\r\n\s]+/g, '');
            inStock = stockStr === 'true' || stockStr === '1' || stockStr === 'ano';
          }

          // Ošetření imageUrl (Google sheets může na konec posledního sloupce přidat \r)
          let imageUrl = row.imageUrl ? String(row.imageUrl).trim() : '';

          return {
            id: id,
            name: row.name || 'Neznámý produkt',
            price: price,
            description: row.description || '',
            category: row.category || 'Nezarazeno',
            imageUrl: imageUrl || 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop',
            inStock: inStock
          };
        });

        const outputPath = path.resolve(__dirname, '../src/data/products.json');

        // Zajištění, že složka existuje
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Uložení do JSON souboru
        fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf-8');
        console.log(`✅ Úspěšně uloženo ${products.length} produktů do ${outputPath}`);
      },
      error: (error: any) => {
        console.error('❌ Chyba při parsování CSV:', error);
        createEmptyJsonIfMissing();
      }
    });

  } catch (error) {
    console.error('❌ Nastala chyba při stahování dat:', error);
    createEmptyJsonIfMissing();
  }
}

function createEmptyJsonIfMissing() {
  const outputPath = path.resolve(__dirname, '../src/data/products.json');
  if (!fs.existsSync(outputPath)) {
    console.log('Vytvářím prázdný soubor products.json jako fallback.');
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, '[]', 'utf-8');
  } else {
    console.log('Soubor products.json už existuje, ponechávám stávající data.');
  }
}

fetchAndSaveProducts();
