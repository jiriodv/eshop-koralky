import { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminPanel() {
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployStatus, setDeployStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [password, setPassword] = useState('');
    const [showPasswordError, setShowPasswordError] = useState(false);

    const deployHookUrl = import.meta.env.VITE_CLOUDFLARE_DEPLOY_HOOK;
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

    const isAuthorized = password === adminPassword;

    const handleUpdate = async () => {
        if (!isAuthorized) {
            setShowPasswordError(true);
            return;
        }

        if (!deployHookUrl) {
            setDeployStatus('error');
            setErrorMessage('Deploy Hook URL není nastavena v proměnných prostředí (.env).');
            return;
        }

        setIsDeploying(true);
        setDeployStatus('idle');
        setErrorMessage('');
        setShowPasswordError(false);

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
        <div className="admin-container">
            <h1 className="admin-title">Administrace E-shopu</h1>

            <div className="admin-card">
                <h2 className="admin-subtitle">Aktualizace produktů</h2>

                <p className="admin-text">
                    Kliknutím na tlačítko níže odešlete signál do Cloudflare, aby provedl nové sestavení (build) webu.
                    Během tohoto procesu si web stáhne nejnovější data z vaší napojené Google Tabulky. <br /><br />
                    <strong>Pozor:</strong> Zabezpečený přístup. Pro aktivaci tlačítka zadejte administrační heslo.
                </p>

                <div style={{ marginBottom: '2.5rem', maxWidth: '300px' }}>
                    <label style={{
                        display: 'block',
                        marginBottom: '0.8rem',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        color: 'var(--text-secondary)'
                    }}>
                        Administrační heslo
                    </label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setShowPasswordError(false);
                        }}
                        placeholder="Zadejte heslo..."
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            border: showPasswordError ? '2px solid #dc2626' : '1.5px solid rgba(0,0,0,0.05)',
                            backgroundColor: 'var(--bg-color)',
                            color: 'var(--text-primary)',
                            fontSize: '1rem',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                        }}
                    />
                    {showPasswordError && (
                        <span style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '0.5rem', display: 'block' }}>
                            Nesprávné heslo
                        </span>
                    )}
                </div>

                <motion.button
                    whileHover={{ scale: (isDeploying || !isAuthorized) ? 1 : 1.02 }}
                    whileTap={{ scale: (isDeploying || !isAuthorized) ? 1 : 0.98 }}
                    onClick={handleUpdate}
                    disabled={isDeploying || !isAuthorized}
                    className="btn btn-primary"
                    style={{
                        width: 'fit-content',
                        padding: '1rem 2.5rem',
                        opacity: isAuthorized ? 1 : 0.4,
                        cursor: isAuthorized ? 'pointer' : 'not-allowed',
                        filter: isAuthorized ? 'none' : 'grayscale(1)'
                    }}
                >
                    <RefreshCw className={isDeploying ? 'spin-animation' : ''} size={20} />
                    {isDeploying ? 'Aktualizuje se...' : 'Aktualizovat web z Google Sheets'}
                </motion.button>

                {deployStatus === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="admin-status-box status-success"
                    >
                        <CheckCircle2 size={20} />
                        Signál byl úspěšně odeslán. Web bude za 1-3 minuty aktualizován. Zkuste pak obnovit stránku.
                    </motion.div>
                )}

                {deployStatus === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="admin-status-box status-error"
                    >
                        <AlertCircle size={20} />
                        Chyba: {errorMessage}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
