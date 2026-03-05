import { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminPanel() {
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployStatus, setDeployStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    // Tato hodnota by měla pocházet z .env, ale pro účely ukázky/UI zde máme zástupnou logiku, 
    // případně uživatel URL webhooku zadá přímo do .env souboru: VITE_CLOUDFLARE_DEPLOY_HOOK
    const deployHookUrl = import.meta.env.VITE_CLOUDFLARE_DEPLOY_HOOK;

    const handleUpdate = async () => {
        if (!deployHookUrl) {
            setDeployStatus('error');
            setErrorMessage('Deploy Hook URL není nastavena v proměnných prostředí (.env).');
            return;
        }

        setIsDeploying(true);
        setDeployStatus('idle');
        setErrorMessage('');

        try {
            const response = await fetch(deployHookUrl, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`Cloudflare odpověděl chybou: ${response.status}`);
            }

            setDeployStatus('success');
        } catch (err: any) {
            setDeployStatus('error');
            setErrorMessage(err.message || 'Při odesílání požadavku došlo k chybě.');
        } finally {
            setIsDeploying(false);
        }
    };

    return (
        <div style={{ padding: '6rem 2rem 2rem', maxWidth: '800px', margin: '0 auto', minHeight: '80vh' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                Administrace E-shopu
            </h1>

            <div style={{
                backgroundColor: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                boxShadow: '0 8px 32px var(--glass-shadow)'
            }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    Aktualizace produktů
                </h2>

                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                    Kliknutím na tlačítko níže odešlete signál do Cloudflare, aby provedl nové sestavení (build) webu.
                    Během tohoto procesu si web stáhne nejnovější data z vaší napojené Google Tabulky. <br /><br />
                    <strong>Pozor:</strong> Zpracování nového buildu může trvat přibližně 1-3 minuty. Změny se na webu projeví až po dokončení tohoto procesu.
                </p>

                <motion.button
                    whileHover={{ scale: isDeploying ? 1 : 1.02 }}
                    whileTap={{ scale: isDeploying ? 1 : 0.98 }}
                    onClick={handleUpdate}
                    disabled={isDeploying}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.8rem',
                        padding: '1rem 2rem',
                        backgroundColor: isDeploying ? 'var(--text-secondary)' : 'var(--accent-color)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                        cursor: isDeploying ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.3s ease'
                    }}
                >
                    <RefreshCw className={isDeploying ? 'spin-animation' : ''} size={20} />
                    {isDeploying ? 'Aktualizuje se...' : 'Aktualizovat web z Google Sheets'}
                </motion.button>

                {deployStatus === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)', borderRadius: 'var(--radius-md)', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <CheckCircle2 size={20} />
                        Signál byl úspěšně odeslán. Web bude za 1-3 minuty aktualizován. Zkuste pak obnovit stránku.
                    </motion.div>
                )}

                {deployStatus === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <AlertCircle size={20} />
                        Chyba: {errorMessage}
                    </motion.div>
                )}
            </div>

            <style>{`
        .spin-animation {
          animation: spin 1.5s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
