import React, { useState, useEffect } from 'react';
import { settingsApi } from '../utils/api';
import { Save, Phone, Mail, MapPin, Globe, MessageCircle, Server, Key, RefreshCcw, Layout, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const defaultSettings = {
  phone: "+229 95 22 48 34",
  email: "cstbsn@yahoo.fr",
  address: "Bourse du Travail, Cotonou, Bénin",
  whatsapp: "22995224834",
  siteName: "CSTB Bénin",
  // Paramètres Email/API
  emailProvider: "SMTP", // SMTP ou BREVO
  emailHost: "smtp.gmail.com",
  emailPort: "465",
  emailUser: "",
  emailPass: "",
  brevoKey: ""
};

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [savedSettings, setSavedSettings] = useState(defaultSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'api'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await settingsApi.get();
      if (data && Object.keys(data).length > 0) {
        const fullSettings = { ...defaultSettings, ...data };
        setSettings(fullSettings);
        setSavedSettings(fullSettings);
      }
    } catch (error) {
      console.error("Erreur chargement paramètres :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      await settingsApi.update(settings);
      setSavedSettings(settings);
      alert("Paramètres enregistrés en base de données !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'api', label: 'Email & API', icon: Server },
  ];

  return (
    <div className="max-w-5xl space-y-8">
      {/* Navigation par onglets */}
      <div className="flex bg-white/50 p-1.5 rounded-2xl w-fit border border-[#e2e8f0] backdrop-blur-sm">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-[#007cba] shadow-sm' 
                : 'text-[#64748b] hover:text-[#0f172a]'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <AnimatePresence mode="wait">
          {activeTab === 'general' ? (
            <motion.div
              key="general"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white p-10 rounded-3xl border border-[#e2e8f0] shadow-sm space-y-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Identité */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-widest flex items-center gap-2">
                    <Globe size={16} className="text-[#007cba]" /> Identité du Site
                  </h3>
                  <div>
                    <label className="block text-xs font-bold text-[#64748b] mb-2 uppercase">Nom du Syndicat</label>
                    <input 
                      type="text" 
                      value={settings.siteName}
                      onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 focus:border-[#007cba] outline-none font-bold"
                      placeholder="CSTB Bénin"
                    />
                  </div>
                </div>

                {/* Contacts */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-widest flex items-center gap-2">
                    <Phone size={16} className="text-[#007cba]" /> Coordonnées Publics
                  </h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-[#64748b] mb-2 uppercase">Téléphone</label>
                      <input 
                        type="text" 
                        value={settings.phone}
                        onChange={(e) => setSettings({...settings, phone: e.target.value})}
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 focus:border-[#007cba] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#64748b] mb-2 uppercase">Email de contact</label>
                      <input 
                        type="email" 
                        value={settings.email}
                        onChange={(e) => setSettings({...settings, email: e.target.value})}
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 focus:border-[#007cba] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="space-y-6 md:col-span-2">
                  <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-widest flex items-center gap-2">
                    <MessageCircle size={16} className="text-[#25D366]" /> Intégration WhatsApp
                  </h3>
                  <div className="bg-green-50/30 p-6 rounded-2xl border border-green-100/50">
                    <label className="block text-xs font-bold text-green-700 mb-2 uppercase">Numéro WhatsApp (Format: 229XXXXXXXX)</label>
                    <input 
                      type="text" 
                      value={settings.whatsapp}
                      onChange={(e) => setSettings({...settings, whatsapp: e.target.value})}
                      className="w-full bg-white border border-green-200 rounded-xl p-4 focus:border-[#25D366] outline-none font-mono text-lg"
                    />
                    <p className="text-[11px] text-green-600/70 mt-3 italic">Utilisé pour le bouton de discussion directe sur le site.</p>
                  </div>
                </div>

                {/* Adresse */}
                <div className="space-y-6 md:col-span-2">
                   <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-widest flex items-center gap-2">
                    <MapPin size={16} className="text-[#007cba]" /> Siège Social
                  </h3>
                  <div>
                    <label className="block text-xs font-bold text-[#64748b] mb-2 uppercase">Adresse physique</label>
                    <textarea 
                      value={settings.address}
                      onChange={(e) => setSettings({...settings, address: e.target.value})}
                      className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 focus:border-[#007cba] outline-none min-h-[100px] resize-none"
                      placeholder="Ex: Bourse du Travail, Cotonou..."
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="api"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white p-10 rounded-3xl border border-[#e2e8f0] shadow-sm space-y-10"
            >
              <div className="space-y-8">
                {/* Choix du fournisseur */}
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-widest flex items-center gap-2">
                    <Mail size={16} className="text-[#007cba]" /> Service d'envoi d'emails
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setSettings({...settings, emailProvider: 'SMTP'})}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        settings.emailProvider === 'SMTP' 
                          ? 'border-[#007cba] bg-[#007cba]/5' 
                          : 'border-transparent bg-[#f8fafc] hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-black text-[#0f172a] mb-1">Gmail / SMTP Standard</div>
                      <div className="text-xs text-[#64748b]">Idéal pour un début (besoin d'un mot de passe d'application).</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSettings({...settings, emailProvider: 'BREVO'})}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        settings.emailProvider === 'BREVO' 
                          ? 'border-[#007cba] bg-[#007cba]/5' 
                          : 'border-transparent bg-[#f8fafc] hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-black text-[#0f172a] mb-1">Brevo (ex Sendinblue)</div>
                      <div className="text-xs text-[#64748b]">Recommandé pour les gros volumes de mails (plus fiable).</div>
                    </button>
                  </div>
                </div>

                {settings.emailProvider === 'SMTP' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-[#64748b] mb-2 uppercase">Serveur SMTP</label>
                        <input 
                          type="text" 
                          value={settings.emailHost}
                          onChange={(e) => setSettings({...settings, emailHost: e.target.value})}
                          className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 focus:border-[#007cba] outline-none"
                          placeholder="smtp.gmail.com"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#64748b] mb-2 uppercase">Port</label>
                        <input 
                          type="text" 
                          value={settings.emailPort}
                          onChange={(e) => setSettings({...settings, emailPort: e.target.value})}
                          className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 focus:border-[#007cba] outline-none"
                          placeholder="465"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#64748b] mb-2 uppercase">Email Utilisateur</label>
                      <input 
                        type="email" 
                        value={settings.emailUser}
                        onChange={(e) => setSettings({...settings, emailUser: e.target.value})}
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 focus:border-[#007cba] outline-none"
                        placeholder="votre-email@gmail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#64748b] mb-2 uppercase">Mot de passe (ou clé d'application)</label>
                      <input 
                        type="password" 
                        value={settings.emailPass}
                        onChange={(e) => setSettings({...settings, emailPass: e.target.value})}
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 focus:border-[#007cba] outline-none"
                        placeholder="••••••••••••••••"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div>
                      <label className="block text-xs font-bold text-[#64748b] mb-2 uppercase flex items-center gap-2">
                        <Key size={14} /> Clé API Brevo (v3)
                      </label>
                      <input 
                        type="password" 
                        value={settings.brevoKey}
                        onChange={(e) => setSettings({...settings, brevoKey: e.target.value})}
                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 focus:border-[#007cba] outline-none font-mono"
                        placeholder="xkeysib-..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-6">
          <button 
            type="submit"
            disabled={isSaving || !hasChanges}
            className={`group flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-white transition-all ${
              isSaving 
                ? 'bg-green-500 scale-95 shadow-none' 
                : !hasChanges
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                  : 'bg-[#0f172a] hover:bg-[#007cba] shadow-xl shadow-slate-200 active:scale-95'
            }`}
          >
            {isSaving ? (
              <><RefreshCcw className="animate-spin" size={20} /> ENREGISTREMENT...</>
            ) : !hasChanges ? (
              <><Save size={20} className="opacity-50" /> AUCUNE MODIFICATION</>
            ) : (
              <><Save size={20} className="group-hover:scale-110 transition-transform" /> ENREGISTRER TOUTES LES MODIFICATIONS</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
