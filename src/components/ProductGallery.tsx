import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import './ProductGallery.css';

interface ProductGalleryProps {
    onAddToCart: (productId: string) => void;
}

export const ProductGallery = ({ onAddToCart }: ProductGalleryProps) => {
    const [filter, setFilter] = useState('Vše');

    const categories = ['Vše', ...Array.from(new Set(mockProducts.map(p => p.category)))];

    const filteredProducts = filter === 'Vše'
        ? mockProducts
        : mockProducts.filter(p => p.category === filter);

    return (
        <section className="section gallery-section" id="kolekce">
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
                    <AnimatePresence>
                        {filteredProducts.map((product) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                                key={product.id}
                                className="product-card glass"
                            >
                                <div className="product-image-container">
                                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                                    {!product.inStock && <div className="out-of-stock-badge">Vyprodáno</div>}

                                    <div className="product-overlay">
                                        <button
                                            className="add-to-cart-btn btn btn-primary"
                                            onClick={() => onAddToCart(product.id)}
                                            disabled={!product.inStock}
                                        >
                                            <ShoppingBag size={18} /> Do košíku
                                        </button>
                                    </div>
                                </div>

                                <div className="product-info">
                                    <div>
                                        <span className="product-category">{product.category}</span>
                                        <h3 className="product-name">{product.name}</h3>
                                    </div>
                                    <span className="product-price">{product.price} Kč</span>
                                </div>
                                <p className="product-description">{product.description}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};
