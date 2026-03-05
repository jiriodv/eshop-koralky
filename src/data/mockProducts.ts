import productsData from './products.json'

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  inStock: boolean;
}

const defaultProducts: Product[] = [
  {
    id: 'p1',
    name: 'Nebeská harmonie',
    price: 349,
    description: 'Jemný náramek z modrého chalcedonu a kříšťálu, ručně navlečený pro klid a vyrovnanost.',
    category: 'Náramky',
    imageUrl: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 'p2',
    name: 'Zemský základ',
    price: 299,
    description: 'Sada přírodních dřevěných korálků a jaspisu, symbolizující spojení s přírodou.',
    category: 'Sady',
    imageUrl: 'https://images.unsplash.com/photo-1599643478524-fb524b0d510e?q=80&w=2069&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 'p3',
    name: 'Sluneční záře náhrdelník',
    price: 499,
    description: 'Výrazný náhrdelník se žlutým achátem doplněný drobnými zlatými perlami.',
    category: 'Náhrdelníky',
    imageUrl: 'https://images.unsplash.com/photo-1620021677334-927914e64573?q=80&w=1964&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 'p4',
    name: 'Ametystové štěstí',
    price: 389,
    description: 'Náramek na paměťovém drátu z broušeného ametystu. Podporuje vnitřní sílu.',
    category: 'Náramky',
    imageUrl: 'https://images.unsplash.com/photo-1602751584552-8ba7a54a01c8?q=80&w=2070&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 'p5',
    name: 'Minimalistická perla',
    price: 199,
    description: 'Jednoduchý stříbrný řetízek s jednou sladkovodní perlou ručně upravenou na zakázku.',
    category: 'Náhrdelníky',
    imageUrl: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?q=80&w=1974&auto=format&fit=crop',
    inStock: true
  },
  {
    id: 'p6',
    name: 'Královský set',
    price: 899,
    description: 'Exkluzivní sada náhrdelníku a náušnic z pečlivě vybraných skleněných vinutek a labradoritu.',
    category: 'Sady',
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop',
    inStock: false
  }
];

// Pokud existují data z Google Sheets, použijí se. Jinak se fallbackuje na default.
export const mockProducts: Product[] = (productsData && productsData.length > 0)
  ? productsData as Product[]
  : defaultProducts;
