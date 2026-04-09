import React, { useState } from 'react';
import { LocalDB } from '../utils/localDb';
import { Save, Phone, Mail, MapPin, Globe, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

const defaultSettings = {
  phone: "+229 95 22 48 34",
  email: "cstbsn@yahoo.fr",
  address: "Bourse du Travail, Cotonou, Bénin",
  whatsapp: "22995224834",
  siteName: "CSTB Bénin"
};

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState(() => LocalDB.get('site_settings', defaultSettings));
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    LocalDB.save('site_settings', settings);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-widest flex items-center gap-2">
              <Globe size={16} className="text-[#007cba]" /> Identité
            </h3>
            <div>
              <label className="block text-xs font-bold text-[#6b7280] mb-2 uppercase">Nom du Syndicat</label>
              <input 
                type="text" 
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3 focus:border-[#007cba] outline-none font-bold"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-widest flex items-center gap-2">
              <Phone size={16} className="text-[#007cba]" /> Contacts
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#6b7280] mb-2 uppercase">Téléphone (Affichage)</label>
                <input 
                  type="text" 
                  value={settings.phone}
                  onChange={(e) => setSettings({...settings, phone: e.target.value})}
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3 focus:border-[#007cba] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6b7280] mb-2 uppercase">Email</label>
                <input 
                  type="email" 
                  value={settings.email}
                  onChange={(e) => setSettings({...settings, email: e.target.value})}
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3 focus:border-[#007cba] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 md:col-span-2">
             <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-widest flex items-center gap-2">
              <MessageCircle size={16} className="text-[#25D366]" /> Intégration WhatsApp
            </h3>
            <div>
              <label className="block text-xs font-bold text-[#6b7280] mb-2 uppercase">Numéro WhatsApp (Format: 229XXXXXXXX)</label>
              <input 
                type="text" 
                value={settings.whatsapp}
                onChange={(e) => setSettings({...settings, whatsapp: e.target.value})}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3 focus:border-[#25D366] outline-none font-mono"
              />
              <p className="text-[10px] text-[#94a3b8] mt-2 italic">Ce numéro sera utilisé pour le bouton flottant de redirection WhatsApp.</p>
            </div>
          </div>

          <div className="space-y-4 md:col-span-2">
            <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-widest flex items-center gap-2">
              <MapPin size={16} className="text-[#007cba]" /> Localisation
            </h3>
            <div>
              <label className="block text-xs font-bold text-[#6b7280] mb-2 uppercase">Adresse Physique</label>
              <textarea 
                value={settings.address}
                onChange={(e) => setSettings({...settings, address: e.target.value})}
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3 focus:border-[#007cba] outline-none min-h-[80px]"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#f1f5f9]">
          <button 
            type="submit"
            disabled={isSaving}
            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-white transition-all ${isSaving ? 'bg-green-500' : 'bg-[#007cba] hover:bg-[#005a87] shadow-lg shadow-[#007cba]/20'}`}
          >
            {isSaving ? <><RefreshCcw className="animate-spin" size={20} /> ENREGISTREMENT...</> : <><Save size={20} /> ENREGISTRER LES PARAMÈTRES</>}
          </button>
        </div>
      </form>
    </div>
  );
};
