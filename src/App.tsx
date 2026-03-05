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

      <footer style={{ padding: '4rem 0 2rem', borderTop: '1px solid var(--glass-border)', backgroundColor: 'var(--bg-color)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem', justifyContent: 'space-between', marginBottom: '3rem' }}>
            <div style={{ flex: '1 1 300px' }} id="o-nas">
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '1rem' }}>Aurora Beads</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px' }}>
                Věříme, že každý šperk by měl vyprávět příběh. Z lásky k řemeslu a přírodním materiálům tvoříme unikátní kousky, které podtrhnou vaši jedinečnost.
              </p>
            </div>

            <div style={{ flex: '1 1 200px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>Informace</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-secondary)' }}>
                <li><a href="#obchodni-podminky" id="obchodni-podminky" style={{ textDecoration: 'underline' }}>Obchodní podmínky</a></li>
                <li><a href="#gdpr" id="gdpr" style={{ textDecoration: 'underline' }}>Ochrana osobních údajů</a></li>
                <li><a href="#doprava" style={{ textDecoration: 'underline' }}>Doprava a platba</a></li>
                <li><a href="#reklamace" style={{ textDecoration: 'underline' }}>Reklamační řád</a></li>
              </ul>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center' }}>
            &copy; 2026 Aurora Beads. Vytvořeno s láskou v ČR.
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
