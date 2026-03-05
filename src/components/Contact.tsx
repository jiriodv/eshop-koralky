import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';
import emailjs from '@emailjs/browser';
import './Contact.css';

export const Contact = () => {
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await emailjs.sendForm(
                'YOUR_SERVICE_ID',
                'YOUR_CONTACT_TEMPLATE_ID',
                e.currentTarget,
                'YOUR_PUBLIC_KEY'
            );

            setSubmitted(true);
            setIsSubmitting(false);

            setTimeout(() => {
                setSubmitted(false);
                setFormState({ name: '', email: '', message: '' });
            }, 5000);
        } catch (error) {
            console.error('Chyba odeslání zprávy', error);
            alert('Zprávu se nepodařilo odeslat. Zkuste to prosím znovu.');
            setIsSubmitting(false);
        }
    };

    return (
        <section className="section contact-section" id="kontakt">
            <div className="container contact-container">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="contact-info"
                >
                    <h2 className="section-title">Ozvěte se <span>nám</span></h2>
                    <p className="contact-desc">
                        Máte dotaz ohledně materiálu, zakázkové výroby nebo potřebujete poradit s výběrem? Napište nám a rádi se vám budeme věnovat.
                    </p>

                    <div className="contact-details">
                        <div className="contact-item">
                            <div className="icon-wrap"><Mail size={20} /></div>
                            <div>
                                <h4>E-mail</h4>
                                <a href="mailto:ahoj@aurorabeads.cz">ahoj@aurorabeads.cz</a>
                            </div>
                        </div>
                        <div className="contact-item">
                            <div className="icon-wrap"><Phone size={20} /></div>
                            <div>
                                <h4>Telefon</h4>
                                <a href="tel:+420123456789">+420 123 456 789</a>
                            </div>
                        </div>
                        <div className="contact-item">
                            <div className="icon-wrap"><MapPin size={20} /></div>
                            <div>
                                <h4>Ateliér (po předchozí domluvě)</h4>
                                <p>Kreativní 123, 110 00 Praha 1</p>
                                <p className="ico">IČO: 12345678 (neplátce DPH)</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="contact-form-wrapper glass"
                >
                    <AnimatePresence mode="wait">
                        {submitted ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="form-success"
                            >
                                <h3>Zpráva odeslána!</h3>
                                <p>Děkujeme za váš dotaz. Ozveme se vám obratem zpět na zadaný e-mail.</p>
                            </motion.div>
                        ) : (
                            <motion.form
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleSubmit}
                                className="contact-form"
                            >
                                <div className="form-group">
                                    <label htmlFor="name">Jméno</label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formState.name}
                                        onChange={e => setFormState({ ...formState, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">E-mail</label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={formState.email}
                                        onChange={e => setFormState({ ...formState, email: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="message">Zpráva</label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        required
                                        value={formState.message}
                                        onChange={e => setFormState({ ...formState, message: e.target.value })}
                                    ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
                                    {isSubmitting ? 'Odesílám...' : 'Odeslat zprávu'}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};
