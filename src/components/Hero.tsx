import { motion } from 'framer-motion';
import './Hero.css';

export const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-bg">
                <img
                    src="https://images.unsplash.com/photo-1599643478524-fb524b0d510e?q=80&w=2069&auto=format&fit=crop"
                    alt="Hands making beaded jewelry"
                    className="hero-image"
                />
                <div className="hero-overlay"></div>
            </div>

            <div className="container hero-container">
                <motion.div
                    className="hero-content glass"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.span
                        className="hero-subtitle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                    >
                        Ruční výroba s láskou
                    </motion.span>

                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1, duration: 0.8 }}
                    >
                        Příběh v každém <br /><span>korálku</span>
                    </motion.h1>

                    <motion.p
                        className="hero-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                    >
                        Objevte naši jedinečnou kolekci ručně dělaných šperků z kvalitních přírodních materiálů. Každý kus je originál stvořený pro vaši duši.
                    </motion.p>

                    <motion.div
                        className="hero-actions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                    >
                        <a href="#kolekce" className="btn btn-primary">Prozkoumat kolekci</a>
                        <a href="#o-nas" className="btn btn-outline">Náš příběh</a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
