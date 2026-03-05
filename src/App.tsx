import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductGallery } from './components/ProductGallery';
import { CartSidebar } from './components/CartSidebar';
import { Contact } from './components/Contact';
import { CheckoutModal } from './components/CheckoutModal';
import { CookieBanner } from './components/CookieBanner';
import { AdminPanel } from './components/AdminPanel';
import { mockProducts } from './data/mockProducts';

function MainShop() {
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{ id: string; quantity: number }[]>([]);

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
    const product = mockProducts.find(p => p.id === item.id)!;
    return { ...product, quantity: item.quantity };
  });

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="app-container">
      <Navbar cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

      <main>
        <Hero />
        <ProductGallery onAddToCart={handleAddToCart} />
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
