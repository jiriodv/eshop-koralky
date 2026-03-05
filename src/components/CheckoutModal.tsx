import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import './CheckoutModal.css';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    totalAmount: number;
}

export const CheckoutModal = ({ isOpen, onClose, onSuccess, totalAmount }: CheckoutModalProps) => {
    const [step, setStep] = useState<1 | 2>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Nahraďte YOUR_SERVICE_ID, YOUR_TEMPLATE_ID a YOUR_PUBLIC_KEY svými údaji z EmailJS
            await emailjs.sendForm(
                'YOUR_SERVICE_ID',
                'YOUR_TEMPLATE_ID',
                e.currentTarget,
                'YOUR_PUBLIC_KEY'
            );

            setIsSubmitting(false);
            setStep(2);

            setTimeout(() => {
                onSuccess();
                setTimeout(() => setStep(1), 500);
            }, 3000);
        } catch (error) {
            console.error('Chyba při odesílání objednávky:', error);
            alert('Jejda, něco se pokazilo při odesílání objednávky. Zkuste to prosím znovu.');
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="modal-overlay">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="modal-backdrop"
                        onClick={step === 1 ? onClose : undefined}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="modal-content glass"
                    >
                        {step === 1 ? (
                            <>
                                <div className="modal-header">
                                    <h2>Dokončení objednávky</h2>
                                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                                </div>

                                <div className="modal-body">
                                    <div className="checkout-summary">
                                        <span>Celkem k úhradě:</span>
                                        <span className="checkout-total">{totalAmount} Kč</span>
                                    </div>

                                    <form onSubmit={handleSubmit} className="checkout-form">
                                        <input type="hidden" name="total_amount" value={`${totalAmount} Kč`} />
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="user_name">Jméno a příjmení *</label>
                                                <input type="text" id="user_name" name="user_name" required placeholder="Jan Novák" />
                                            </div>
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="user_email">E-mail *</label>
                                                <input type="email" id="user_email" name="user_email" required placeholder="jan.novak@email.cz" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="user_phone">Telefon *</label>
                                                <input type="tel" id="user_phone" name="user_phone" required placeholder="+420 123 456 789" />
                                            </div>
                                        </div>

                                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                            <label htmlFor="address">Doručovací adresa *</label>
                                            <input type="text" id="address" name="address" required placeholder="Ulice a číslo popisné" />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="city">Město *</label>
                                                <input type="text" id="city" name="city" required placeholder="Praha" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="zip">PSČ *</label>
                                                <input type="text" id="zip" name="zip" required placeholder="110 00" />
                                            </div>
                                        </div>

                                        <div className="form-group checkout-terms">
                                            <label className="checkbox-label">
                                                <input type="checkbox" required />
                                                Souhlasím s <a href="#obchodni-podminky">obchodními podmínkami</a> a beru na vědomí <a href="#gdpr">zpracování osobních údajů</a>.
                                            </label>
                                        </div>

                                        <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
                                            {isSubmitting ? 'Zpracovávám...' : 'Dokončit objednávku'}
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="modal-success-state">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", damping: 12 }}
                                >
                                    <CheckCircle size={80} className="success-icon" color="var(--accent-color)" />
                                </motion.div>
                                <h3>Objednávka byla úspěšně přijata!</h3>
                                <p>Na váš e-mail jsme zaslali potvrzení a platební údaje.</p>
                                <p className="redirect-note">Za malý okamžik vás přesměrujeme zpět...</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
