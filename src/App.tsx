import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductGallery } from './components/ProductGallery';
import { CartSidebar } from './components/CartSidebar';
import { Contact } from './components/Contact';
import { CheckoutModal } from './components/CheckoutModal';
import { CookieBanner } from './components/CookieBanner';
import { AdminPanel } from './components/AdminPanel';

// Pomocná funkce pro převod Google Drive odkazů na přímé (drive.google.com/thumbnail)
const fixDriveUrl = (url: string) => {
  if (!url) return url;
  if (url.includes('drive.google.com/thumbnail')) return url;

  const idMatch = url.match(/id=([a-zA-Z0-9_-]{25,})/);
  const pathMatch = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
  const match = url.match(/[a-zA-Z0-9_-]{25,}/);

  const fileId = idMatch ? idMatch[1] : (pathMatch ? pathMatch[1] : (match ? match[0] : null));

  if (fileId && fileId.length >= 25) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
  }
  return url;
};

function MainShop() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{ id: string; quantity: number }[]>([]);

  // Inicializace z localStorage pro okamžité zobrazení
  const [products, setProducts] = useState<any[]>(() => {
    const cached = localStorage.getItem('shop_products_cache');
    return cached ? JSON.parse(cached) : [];
  });

  const [loading, setLoading] = useState(() => {
    const cached = localStorage.getItem('shop_products_cache');
    return !cached; // Loading jen pokud nemáme nic v cache
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
      if (!scriptUrl) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(scriptUrl);
        const data = await response.json();
        if (data && data.products) {
          const fixedProducts = data.products.map((p: any) => ({ ...p, imageUrl: fixDriveUrl(p.imageUrl) }));
          setProducts(fixedProducts);
          localStorage.setItem('shop_products_cache', JSON.stringify(fixedProducts));
        }
        setLoading(false);
      } catch (err) {
        console.error('Chyba načítání produktů pro web:', err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (productId: string) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item => item.id === productId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id: productId, quantity: 1 }];
    });
    setCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const cartItemsWithData = cartItems.map(item => {
    const product = products.find(p => p.id === item.id);
    if (!product) return null;
    return { ...product, quantity: item.quantity };
  }).filter((item): item is any => item !== null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app-container">
      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

      <main>
        <Hero />
        {loading ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>Načítám kolekci...</div>
        ) : (
          <ProductGallery products={products} onAddToCart={handleAddToCart} />
        )}
        <Contact />
      </main>

      <CartSidebar
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItemsWithData}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={() => {
          setCartItems([]);
          setCheckoutOpen(false);
        }}
        totalAmount={cartItemsWithData.reduce((acc, item) => acc + item.price * item.quantity, 0)}
      />

      <CookieBanner />

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand" id="o-nas">
              <h2 className="footer-logo">Aurora Beads</h2>
              <p className="footer-tagline">
                Věříme, že každý šperk by měl vyprávět příběh. Z lásky k řemeslu a přírodním materiálům tvoříme unikátní kousky, které podtrhnou vaši jedinečnost.
              </p>
            </div>

            <div className="footer-links-group">
              <h3 className="footer-title">Informace</h3>
              <ul className="footer-links">
                <li><a href="#obchodni-podminky" id="obchodni-podminky">Obchodní podmínky</a></li>
                <li><a href="#gdpr" id="gdpr">Ochrana osobních údajů</a></li>
                <li><a href="#doprava">Doprava a platba</a></li>
                <li><a href="#reklamace">Reklamační řád</a></li>
                <li className="footer-admin-link"><Link to="/admin">Administrace</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            &copy; {new Date().getFullYear()} Aurora Beads. Vytvořeno s láskou v ČR.
          </div>
        </div>
      </footer>
    </div >
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainShop />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
