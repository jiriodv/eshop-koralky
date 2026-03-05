import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import type { Product } from '../data/mockProducts';
import './CartSidebar.css';

interface CartItem extends Product {
    quantity: number;
}

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemoveItem: (id: string) => void;
    onCheckout: () => void;
}

export const CartSidebar = ({
    isOpen,
    onClose,
    cartItems,
    onUpdateQuantity,
    onRemoveItem,
    onCheckout
}: CartSidebarProps) => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="cart-overlay"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="cart-sidebar glass"
                    >
                        <div className="cart-header">
                            <h3>Váš Košík</h3>
                            <button className="close-btn" onClick={onClose}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="cart-content">
                            {cartItems.length === 0 ? (
                                <div className="empty-cart">
                                    <p>Váš košík je zatím prázdný.</p>
                                    <button className="btn btn-outline" onClick={onClose}>Pokračovat v nákupu</button>
                                </div>
                            ) : (
                                <div className="cart-items">
                                    <AnimatePresence>
                                        {cartItems.map(item => (
                                            <motion.div
                                                layout
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9, height: 0 }}
                                                key={item.id}
                                                className="cart-item"
                                            >
                                                <img src={item.imageUrl} alt={item.name} className="cart-item-img" />
                                                <div className="cart-item-info">
                                                    <h4>{item.name}</h4>
                                                    <span className="cart-item-price">{item.price} Kč</span>

                                                    <div className="cart-item-controls">
                                                        <div className="quantity-controls">
                                                            <button onClick={() => onUpdateQuantity(item.id, -1)}><Minus size={14} /></button>
                                                            <span>{item.quantity}</span>
                                                            <button onClick={() => onUpdateQuantity(item.id, 1)}><Plus size={14} /></button>
                                                        </div>
                                                        <button className="remove-btn" onClick={() => onRemoveItem(item.id)}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>

                        {cartItems.length > 0 && (
                            <div className="cart-footer">
                                <div className="cart-total">
                                    <span>Celkem:</span>
                                    <span>{total} Kč</span>
                                </div>
                                <button className="btn btn-primary checkout-btn" onClick={onCheckout}>
                                    Přejít k pokladně
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
