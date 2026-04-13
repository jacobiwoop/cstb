import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { LocalDB } from '../utils/localDb';

export const WhatsAppButton: React.FC = () => {
  const settings = LocalDB.get('site_settings', { whatsapp: "22995224834" });
  const phoneNumber = settings.whatsapp;
  const message = "Bonjour CSTB Bénin, je souhaiterais avoir plus d'informations.";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-[100] bg-[#25D366] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-center group pointer-events-auto"
    >
      <div className="absolute right-full mr-4 bg-white text-[#0f172a] px-4 py-2 rounded-xl text-sm font-bold shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Besoin d'aide ? Contactez-nous sur WhatsApp
      </div>
      <MessageCircle size={32} />
    </motion.a>
  );
};
