import React, { useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { LocalDB } from '../utils/localDb';

const defaultSettings = {
  phone: "+229 95 22 48 34",
  email: "cstbsn@yahoo.fr",
  address: "Bourse du Travail, Cotonou, Bénin",
  whatsapp: "22995224834",
  siteName: "CSTB Bénin"
};

export default function ContactPage() {
  const settings = LocalDB.get('site_settings', defaultSettings);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-sans font-bold text-[#0f172a] mb-6">Contactez-nous</h1>
          <p className="text-xl text-[#6b7280] max-w-2xl mx-auto text-light">
            Une question, un besoin d'accompagnement syndical ? N'hésitez pas à nous contacter.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="bg-white p-8 rounded-[12px] shadow-custom-4 border border-[#e2e8f0]">
            <h2 className="text-2xl font-bold text-[#0f172a] mb-8">Nos Coordonnées</h2>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#f1f5f9] rounded-full flex items-center justify-center text-[#007cba] shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-[#0f172a] text-lg mb-1">Adresse</h3>
                  <p className="text-[#6b7280] whitespace-pre-line">{settings.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#f1f5f9] rounded-full flex items-center justify-center text-[#007cba] shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-[#0f172a] text-lg mb-1">Téléphone</h3>
                  <p className="text-[#6b7280]">{settings.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#f1f5f9] rounded-full flex items-center justify-center text-[#007cba] shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-[#0f172a] text-lg mb-1">Email</h3>
                  <p className="text-[#6b7280]">{settings.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-[12px] shadow-custom-4 border border-[#e2e8f0]">
            <h2 className="text-2xl font-bold text-[#0f172a] mb-8">Envoyer un message</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#0f172a] mb-2">Nom complet</label>
                  <input type="text" className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-[6px] p-3 focus:outline-none focus:border-[#007cba]" placeholder="Jean Dupont" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#0f172a] mb-2">Email</label>
                  <input type="email" className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-[6px] p-3 focus:outline-none focus:border-[#007cba]" placeholder="jean@exemple.com" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0f172a] mb-2">Sujet</label>
                <input type="text" className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-[6px] p-3 focus:outline-none focus:border-[#007cba]" placeholder="Sujet de votre message" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0f172a] mb-2">Message</label>
                <textarea className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-[6px] p-3 min-h-[150px] focus:outline-none focus:border-[#007cba]" placeholder="Votre message..." required></textarea>
              </div>
              <button type="submit" className="w-full bg-[#007cba] text-white font-bold py-3 rounded-[6px] hover:bg-[#005a87] transition-colors flex items-center justify-center gap-2">
                Envoyer le message <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
