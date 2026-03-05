import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import './ProductGallery.css';

interface ProductGalleryProps {
    products: any[];
    onAddToCart: (productId: string) => void;
}

export const ProductGallery = ({ products, onAddToCart }: ProductGalleryProps) => {
    const [filter, setFilter] = useState('Vše');

    const categories = ['Vše', ...Array.from(new Set(products.map(p => p.category || 'Nezarazeno')))];

    const filteredProducts = filter === 'Vše'
        ? products
        : products.filter(p => p.category === filter);

    return (
        <section className="section gallery-section reveal active" id="kolekce">
            <div className="container">
                <div className="gallery-header">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="section-title"
                    >
                        Naše <span>Kolekce</span>
                    </motion.h2>

                    <div className="filter-tabs">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`filter-btn ${filter === cat ? 'active' : ''}`}
                                onClick={() => setFilter(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <motion.div layout className="product-grid">
                    <AnimatePresence mode="popLayout">
                        {filteredProducts.map((product) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                key={product.id}
                                className="product-card"
                            >
                                <div className="product-image-container">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="product-image"
                                        loading="lazy"
                                        referrerPolicy="no-referrer"
                                    />
                                    {!product.inStock && <div className="out-of-stock-badge">Vyprodáno</div>}

                                    <div className="product-overlay">
                                        <button
                                            className="add-to-cart-btn btn"
                                            onClick={() => onAddToCart(product.id)}
                                            disabled={!product.inStock}
                                        >
                                            <ShoppingBag size={18} /> Do košíku
                                        </button>
                                    </div>
                                </div>

                                <div className="product-info">
                                    <div className="product-top">
                                        <span className="product-category">{product.category || 'Nezarazeno'}</span>
                                        <span className="product-price">{product.price} Kč</span>
                                    </div>
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-description">{product.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};
