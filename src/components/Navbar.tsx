import { useState, useEffect } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import './Navbar.css';

interface NavbarProps {
    cartCount: number;
    onCartClick: () => void;
}

export const Navbar = ({ cartCount, onCartClick }: NavbarProps) => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
            <div className="container navbar-container">
                <a href="/" className="logo">
                    Aurora <span>Beads</span>
                </a>

                <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
                    <a href="#kolekce" onClick={() => setMobileMenuOpen(false)}>Kolekce</a>
                    <a href="#o-nas" onClick={() => setMobileMenuOpen(false)}>O nás</a>
                    <a href="#kontakt" onClick={() => setMobileMenuOpen(false)}>Kontakt</a>
                </nav>

                <div className="nav-actions">
                    <button className="cart-btn" aria-label="Nákupní košík" onClick={onCartClick}>
                        <ShoppingBag size={24} />
                        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                    </button>

                    <button
                        className="mobile-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Menu"
                    >
                        {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
                </div>
            </div>
        </header>
    );
};
