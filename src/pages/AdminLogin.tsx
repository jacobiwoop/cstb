import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { motion } from 'motion/react';
import { Lock, Mail, ShieldCheck } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdmin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      window.scrollTo(0, 0);
    } else {
      setError('Mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-[#e2e8f0]"
      >
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-[#007cba]/10 rounded-2xl flex items-center justify-center text-[#007cba]">
            <ShieldCheck size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-sans font-extrabold text-[#0f172a] text-center mb-2">Espace Admin</h1>
        <p className="text-[#6b7280] text-center mb-8">Veuillez vous authentifier pour accéder à la gestion du site.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-[#0f172a] mb-2 uppercase tracking-wide">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-[#e2e8f0] focus:border-[#007cba] focus:ring-0 outline-none transition-all"
                required
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={20} />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg text-center"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            className="w-full bg-[#007cba] hover:bg-[#005a87] text-white font-extrabold py-4 rounded-xl shadow-lg shadow-[#007cba]/20 transition-all flex items-center justify-center gap-2"
          >
            SE CONNECTER
          </button>
        </form>

        <p className="mt-8 text-center text-[#94a3b8] text-xs">
          CSTB Bénin &copy; 2026 - Tous droits réservés
        </p>
      </motion.div>
    </div>
  );
};
