import React from 'react';
import { CheckCircle, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export const UnsubscribePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-xl text-center border border-slate-100">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={40} />
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 mb-4">Désabonnement réussi</h1>
        <p className="text-slate-500 mb-10 leading-relaxed">
          Votre adresse a été retirée de notre liste de diffusion. Vous ne recevrez plus de messages automatique de la part de la CSTB Bénin.
        </p>

        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-[#007cba] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#005a87] transition-all shadow-lg shadow-[#007cba]/20"
        >
          <Home size={18} /> Retour à l'accueil
        </Link>
      </div>
    </div>
  );
};
