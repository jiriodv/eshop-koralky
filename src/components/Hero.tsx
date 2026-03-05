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
                    className="hero-content"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                >
                    <motion.span
                        className="hero-subtitle"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                    >
                        Ruční výroba s láskou
                    </motion.span>

                    <motion.h1
                        className="hero-title"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 1 }}
                    >
                        Příběh v každém <br /><span>korálku</span>
                    </motion.h1>

                    <motion.p
                        className="hero-text"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7, duration: 1 }}
                    >
                        Objevte naši jedinečnou kolekci ručně dělaných šperků z kvalitních přírodních materiálů. Každý kus je originál stvořený pro vaši duši.
                    </motion.p>

                    <motion.div
                        className="hero-actions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                    >
                        <a href="#kolekce" className="btn btn-primary">Prozkoumat kolekci</a>
                        <a href="#o-nas" className="btn btn-outline">Náš příběh</a>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
