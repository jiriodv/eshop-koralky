import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CookieBanner.css';

export const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Ukážeme lištu jen pokud uživatel ještě nesouhlasil
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            setTimeout(() => setIsVisible(true), 1500);
        }
    }, []);

    const acceptCookies = (type: 'all' | 'essential') => {
        localStorage.setItem('cookie-consent', type);
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 150, opacity: 0 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="cookie-banner"
                >
                    <div className="cookie-content">
                        <h4>Tento web používá soubory cookies 🍪</h4>
                        <p>
                            Pro personalizaci obsahu, poskytování funkcí sociálních médií a analýzu naší návštěvnosti využíváme soubory cookie.
                            Vážíme si vašeho soukromí, proto nám záleží na tom, s čím souhlasíte. Podrobnější informace naleznete na stránce o <a href="#gdpr">ochraně osobních údajů</a>.
                        </p>
                    </div>
                    <div className="cookie-actions">
                        <button className="btn btn-outline" onClick={() => acceptCookies('essential')}>
                            Pouze nezbytné
                        </button>
                        <button className="btn btn-primary" onClick={() => acceptCookies('all')}>
                            Přijmout všechny
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
