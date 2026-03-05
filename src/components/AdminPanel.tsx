import { useState, useEffect, useRef } from 'react';
import {
    RefreshCcw,
    LayoutDashboard,
    Package,
    Tag,
    Plus,
    Pencil,
    Trash2,
    Search,
    X,
    Save,
    Download,
    Upload,
    ImageIcon,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Pomocná funkce pro převod Google Drive odkazů na přímé, které prohlížeč spolehlivě zobrazí
const fixDriveUrl = (url: string) => {
    if (!url) return url;
    if (typeof url !== 'string') return url;

    // Pokud už je to náš thumbnail formát, nic neděláme
    if (url.includes('drive.google.com/thumbnail')) return url;

    let fileId = '';

    // 1. Zkusíme běžné ID parametry
    const idMatch = url.match(/id=([a-zA-Z0-9_-]{25,})/);
    const pathMatch = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
    const ucMatch = url.match(/uc\?export=view&id=([a-zA-Z0-9_-]{25,})/);

    if (idMatch) fileId = idMatch[1];
    else if (pathMatch) fileId = pathMatch[1];
    else if (ucMatch) fileId = ucMatch[1];
    else {
        // Poslední záchrana - jakýkoliv dlouhý řetězec, který vypadá jako ID, ale není doména
        const match = url.match(/[a-zA-Z0-9_-]{25,}/);
        if (match && !url.includes('googleusercontent') && !url.includes('drive.google.com')) {
            fileId = match[0];
        } else if (match && url.includes('lh3.googleusercontent.com')) {
            // Pokud je to lh3 link co jsme vytvořili minule
            fileId = match[0];
        }
    }

    if (fileId && fileId.length >= 25) {
        // Thumbnail formát je nejméně náchylný k blokování a CORS problémům
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
    }
    return url;
};

export function AdminPanel() {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [password, setPassword] = useState('');
    const [showPasswordError, setShowPasswordError] = useState(false);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'sync'>('dashboard');

    // Data states
    const [products, setProducts] = useState<any[]>(() => {
        const cached = localStorage.getItem('shop_products_cache');
        return cached ? JSON.parse(cached) : [];
    });
    const [categories, setCategories] = useState<string[]>(() => {
        const cached = localStorage.getItem('shop_categories_cache');
        return cached ? JSON.parse(cached) : [];
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [newCategoryName, setNewCategoryName] = useState('');

    // Modal state for editing/adding products
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Status states
    const [deployStatus, setDeployStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [crudStatus, setCrudStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [fetchStatus, setFetchStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [isImageUploading, setIsImageUploading] = useState(false);

    // Funkce pro načtení produktů z Google Sheets
    const fetchProducts = async () => {
        const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
        if (!scriptUrl) {
            alert('Chyba: Není nastavena URL Google skriptu v .env souboru.');
            return;
        }

        setFetchStatus('loading');
        try {
            const response = await fetch(scriptUrl);
            const data = await response.json();

            if (data && data.products && Array.isArray(data.products)) {
                setProducts(data.products);
                localStorage.setItem('shop_products_cache', JSON.stringify(data.products));
            }
            if (data && data.categories && Array.isArray(data.categories)) {
                setCategories(data.categories);
                localStorage.setItem('shop_categories_cache', JSON.stringify(data.categories));
            }

            setFetchStatus('success');
            setTimeout(() => setFetchStatus('idle'), 3000);
        } catch (err) {
            console.error('Chyba při načítání dat:', err);
            setFetchStatus('error');
        }
    };

    // Kontrola sezení při spuštění
    useEffect(() => {
        const session = localStorage.getItem('admin_session');
        const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;
        if (session === correctPassword) {
            setIsAuthorized(true);
        }
    }, []);

    // Automatické načtení dat při autorizaci
    useEffect(() => {
        if (isAuthorized) {
            fetchProducts();
        }
    }, [isAuthorized]);

    const handleLogin = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const correctPassword = import.meta.env.VITE_ADMIN_PASSWORD;
        if (password === correctPassword) {
            setIsAuthorized(true);
            setShowPasswordError(false);
            localStorage.setItem('admin_session', correctPassword);
        } else {
            setShowPasswordError(true);
        }
    };

    const handleLogout = () => {
        setIsAuthorized(false);
        localStorage.removeItem('admin_session');
    };

    const handleDeploy = async () => {
        const deployHook = import.meta.env.VITE_CLOUDFLARE_DEPLOY_HOOK;
        if (!deployHook) {
            alert('Chyba: Není nastavena URL deploy hooku v .env souboru.');
            return;
        }

        setDeployStatus('loading');
        try {
            await fetch(deployHook, { method: 'POST' });
            setDeployStatus('success');
            setTimeout(() => setDeployStatus('idle'), 5000);
            alert('Synchronizace spuštěna! Cloudflare nyní sestavuje novou verzi webu s aktuálními daty. Trvá to obvykle 1-2 minuty.');
        } catch (err) {
            console.error('Chyba při deployi:', err);
            setDeployStatus('error');
        }
    };

    const handleSaveProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
        if (!scriptUrl) {
            alert('Chyba: Není nastavena URL Google skriptu.');
            return;
        }

        setCrudStatus('loading');
        const action = editingProduct.id_original ? 'update' : 'add';

        try {
            const formData = new URLSearchParams();
            formData.append('action', action);
            Object.keys(editingProduct).forEach(key => {
                formData.append(key, editingProduct[key]);
            });

            await fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            });

            setCrudStatus('success');
            setIsModalOpen(false);
            alert(`Produkt byl úspěšně ${action === 'add' ? 'přidán' : 'upraven'}. Pro projevení změn na webu nezapomeňte na synchronizaci.`);
            fetchProducts();
        } catch (err) {
            setCrudStatus('error');
            alert('Chyba při ukládání produktu.');
        } finally {
            setCrudStatus('idle');
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm('Opravdu chcete smazat tento produkt?')) return;

        const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
        if (!scriptUrl) return;

        try {
            const formData = new URLSearchParams();
            formData.append('action', 'delete');
            formData.append('id', id);

            await fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            });

            alert('Produkt byl smazán.');
            setProducts(products.filter(p => p.id !== id));
            fetchProducts();
        } catch (err) {
            alert('Chyba při mazání produktu.');
        }
    };

    const openEditModal = (product: any) => {
        setEditingProduct({ ...product, id_original: product.id });
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        // Najdeme nejvyšší číslo ID a přičteme 1
        const maxId = products.reduce((max, p) => {
            const idNum = parseInt(p.id);
            return !isNaN(idNum) ? Math.max(max, idNum) : max;
        }, 0);

        const nextId = maxId + 1;
        setEditingProduct({
            id: nextId.toString(),
            name: '',
            price: '',
            description: '',
            category: categories[0] || '',
            imageUrl: '',
            inStock: true
        });
        setIsModalOpen(true);
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;
        const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
        if (!scriptUrl) {
            alert('Chyba: Není nastavena URL Google skriptu.');
            return;
        }

        try {
            const formData = new URLSearchParams();
            formData.append('action', 'addCategory');
            formData.append('name', newCategoryName.trim());

            await fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            });

            const addedName = newCategoryName.trim();
            setCategories([...categories, addedName]);
            setNewCategoryName('');
            alert(`Kategorie "${addedName}" byla přidána.`);
            fetchProducts();
        } catch (err) {
            alert('Chyba při přidávání kategorie.');
        }
    };

    const handleDeleteCategory = async (name: string) => {
        if (!confirm(`Opravdu chcete smazat kategorii "${name}"?`)) return;
        const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
        if (!scriptUrl) return;

        try {
            const formData = new URLSearchParams();
            formData.append('action', 'deleteCategory');
            formData.append('name', name);

            await fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            });

            setCategories(categories.filter(c => c !== name));
            alert('Kategorie byla smazána.');
            fetchProducts();
        } catch (err) {
            alert('Chyba při mazání kategorie.');
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const scriptUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
        if (!scriptUrl) {
            alert('Chyba: Není nastavena URL Google skriptu.');
            return;
        }

        setIsImageUploading(true);

        try {
            const reader = new FileReader();
            reader.onload = async () => {
                const base64String = (reader.result as string).split(',')[1];

                const formData = new URLSearchParams();
                formData.append('action', 'uploadImage');
                formData.append('base64Data', base64String);
                formData.append('contentType', file.type);
                formData.append('fileName', file.name);

                const response = await fetch(scriptUrl, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();
                if (result.status === 'success') {
                    // Uložíme už "opravenou" URL pro maximální stabilitu
                    const stableUrl = fixDriveUrl(result.url);
                    console.log('Nový obrázek nahrán:', stableUrl);

                    // Použijeme funkcionální update, abychom se vyhnuli problémům se starým stavem (closure)
                    setEditingProduct((prev: any) => {
                        const updated = { ...prev, imageUrl: stableUrl };
                        console.log('Aktualizuji stav produktu:', updated);
                        return updated;
                    });

                    alert('Obrázek byl úspěšně nahrán!');
                } else {
                    alert('Chyba při nahrávání: ' + result.message);
                }
                setIsImageUploading(false);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            console.error('Chyba uploadu:', err);
            alert('Chyba při nahrávání obrázku.');
            setIsImageUploading(false);
        }
    };

    if (!isAuthorized) {
        return (
            <div className="admin-page password-gate-container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="password-gate-card glass"
                >
                    <h1>Vstup do administrace</h1>
                    <form onSubmit={handleLogin} className="password-input-group">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Zadejte heslo..."
                            className={showPasswordError ? 'error' : ''}
                            autoFocus
                        />
                        <button type="submit" className="btn btn-primary login-btn" style={{ color: '#000' }}>
                            Odemknout
                        </button>
                        {showPasswordError && <p className="error-text">Heslo nesouhlasí</p>}
                    </form>
                </motion.div>
            </div>
        );
    }

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="admin-page">
            <div className="admin-dashboard">
                <aside className="admin-sidebar">
                    <h2>Aurora <span>Admin</span></h2>
                    <nav className="admin-nav">
                        <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                            <LayoutDashboard size={20} />
                            <span>Nástěnka</span>
                        </button>
                        <button className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
                            <Package size={20} />
                            <span>Produkty</span>
                        </button>
                        <button className={`admin-nav-item ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
                            <Tag size={20} />
                            <span>Kategorie</span>
                        </button>
                        <button className={`admin-nav-item ${activeTab === 'sync' ? 'active' : ''}`} onClick={() => setActiveTab('sync')}>
                            <RefreshCcw size={20} />
                            <span>Synchronizace</span>
                        </button>
                    </nav>
                    <button className="admin-nav-item" onClick={handleLogout} style={{ marginTop: 'auto', border: '1px solid var(--glass-border)' }}>
                        ODHLÁSIT SE
                    </button>
                </aside>

                <main className="admin-main">
                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && (
                            <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="admin-header">
                                    <h1>Vítejte v administraci</h1>
                                </div>
                                <div className="admin-stats">
                                    <div className="stat-card">
                                        <span className="stat-value">{products.length}</span>
                                        <span className="stat-label">Celkem produktů</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-value">{categories.length}</span>
                                        <span className="stat-label">Kategorií</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-value">{products.filter(p => !p.inStock).length}</span>
                                        <span className="stat-label">Vyprodáno</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'products' && (
                            <motion.div key="prod" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="admin-header">
                                    <h1>Správa produktů</h1>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button className="btn admin-btn-light" onClick={fetchProducts} disabled={fetchStatus === 'loading'}>
                                            <Download size={18} className={fetchStatus === 'loading' ? 'animate-spin' : ''} />
                                            Načíst z tabulky
                                        </button>
                                        <button className="btn btn-primary" onClick={openAddModal} style={{ color: '#000' }}>
                                            <Plus size={18} /> Nový produkt
                                        </button>
                                    </div>
                                </div>

                                <div className="admin-card table-card" style={{ padding: '0' }}>
                                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', gap: '1rem' }}>
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                            <input
                                                type="text"
                                                placeholder="Hledat produkt..."
                                                className="admin-form-input"
                                                style={{ width: '100%', padding: '0.8rem 0.8rem 0.8rem 2.5rem' }}
                                                value={searchQuery}
                                                onChange={e => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="table-container">
                                        <table className="data-table">
                                            <thead>
                                                <tr>
                                                    <th>Foto</th>
                                                    <th>Název</th>
                                                    <th>Kategorie</th>
                                                    <th>Cena</th>
                                                    <th>Skladem</th>
                                                    <th>Akce</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredProducts.map(product => (
                                                    <tr key={product.id}>
                                                        <td><img src={fixDriveUrl(product.imageUrl)} alt="" className="product-img-mini" referrerPolicy="no-referrer" /></td>
                                                        <td style={{ fontWeight: 600 }}>{product.name}</td>
                                                        <td><span className="category-badge">{product.category}</span></td>
                                                        <td>{product.price} Kč</td>
                                                        <td>{product.inStock ? '✅' : '❌'}</td>
                                                        <td>
                                                            <div className="action-btns">
                                                                <button className="btn-icon" onClick={() => openEditModal(product)}><Pencil size={16} /></button>
                                                                <button className="btn-icon delete" onClick={() => handleDeleteProduct(product.id)}><Trash2 size={16} /></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'categories' && (
                            <motion.div key="cat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="admin-header">
                                    <h1>Kategorie</h1>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <input
                                            type="text"
                                            placeholder="Nová kategorie..."
                                            className="admin-form-input"
                                            style={{ width: '250px', background: '#1e1c1a' }}
                                            value={newCategoryName}
                                            onChange={e => setNewCategoryName(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                                        />
                                        <button className="btn btn-primary" style={{ color: '#000' }} onClick={handleAddCategory}><Plus size={18} /> Přidat</button>
                                    </div>
                                </div>
                                <div className="admin-card">
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {categories.map(cat => (
                                            <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--glass-border)', borderRadius: '10px' }}>
                                                <span>{cat}</span>
                                                <button className="btn-icon delete" onClick={() => handleDeleteCategory(cat)}><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'sync' && (
                            <motion.div key="sync" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                <div className="admin-header">
                                    <h1>Synchronizace</h1>
                                </div>
                                <div className="admin-card" style={{ maxWidth: '700px' }}>
                                    <h2>Aktualizace webu</h2>
                                    <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Uložte data do statického souboru a spusťte novou verzi webu pro bleskové načítání.</p>
                                    <button onClick={handleDeploy} className="btn btn-primary" disabled={deployStatus === 'loading'} style={{ width: '100%', padding: '1.2rem', color: '#000' }}>
                                        <RefreshCcw size={20} className={deployStatus === 'loading' ? 'animate-spin' : ''} />
                                        {deployStatus === 'loading' ? 'PUBLIKUJI...' : 'PUBLIKOVAT ZMĚNY NA OSTRÝ WEB'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="admin-modal-overlay">
                        <motion.div className="admin-modal glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
                            <div className="modal-header">
                                <h2>{editingProduct?.id_original ? 'Upravit produkt' : 'Nový produkt'}</h2>
                                <button className="btn-icon" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
                            </div>
                            <form onSubmit={handleSaveProduct} className="admin-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Název produktu</label>
                                        <input type="text" value={editingProduct?.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>ID (unikátní klíč)</label>
                                        <input type="text" value={editingProduct?.id} onChange={e => setEditingProduct({ ...editingProduct, id: e.target.value })} placeholder="naramky-modry" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Cena (Kč)</label>
                                        <input type="number" value={editingProduct?.price} onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Kategorie</label>
                                        <select value={editingProduct?.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}>
                                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Obrázek produktu</label>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
                                            <div className="image-preview" style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', background: '#1e1c1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                {editingProduct?.imageUrl ? (
                                                    <img
                                                        src={fixDriveUrl(editingProduct.imageUrl)}
                                                        alt=""
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        referrerPolicy="no-referrer"
                                                    />
                                                ) : (
                                                    <ImageIcon size={30} style={{ opacity: 0.2 }} />
                                                )}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handleImageUpload} />
                                                <button type="button" className="btn admin-btn-light" style={{ width: '100%', padding: '1rem' }} onClick={() => fileInputRef.current?.click()} disabled={isImageUploading}>
                                                    {isImageUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                                                    {isImageUploading ? 'Nahrávám...' : 'Přidat / Změnit fotku'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Popis produktu</label>
                                        <textarea value={editingProduct?.description} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} rows={3} required></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label className="checkbox-label">
                                            <input type="checkbox" checked={editingProduct?.inStock} onChange={e => setEditingProduct({ ...editingProduct, inStock: e.target.checked })} />
                                            Skladem
                                        </label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>Zrušit</button>
                                    <button type="submit" className="btn btn-primary" style={{ color: '#000' }} disabled={crudStatus === 'loading'}>
                                        {crudStatus === 'loading' ? <><RefreshCcw size={18} className="animate-spin" /> Ukládám...</> : <><Save size={18} /> Uložit produkt</>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
