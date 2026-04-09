import React, { useState } from 'react';
import { LocalDB } from '../utils/localDb';
import { Send } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      const subscribers = LocalDB.get('subscribers', []);
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        LocalDB.save('subscribers', subscribers);
      }
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-16 bg-[#007cba] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-sans font-bold mb-4">Abonnez-vous à notre Newsletter</h2>
        <p className="text-[#ecfeff] mb-8 text-lg">Restez informé de nos dernières actions, luttes et actualités syndicales.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-2xl mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            className="px-6 py-3 rounded-[6px] text-[#0f172a] w-full sm:w-auto flex-1 focus:outline-none focus:ring-2 focus:ring-white shadow-inner"
            required
          />
          <button 
            type="submit" 
            className="bg-[#0f172a] text-white px-8 py-3 rounded-[6px] font-bold hover:bg-[#1e293b] transition-colors flex items-center justify-center gap-2 shadow-custom-2"
          >
            {subscribed ? 'Abonné !' : <>S'inscrire <Send size={18} /></>}
          </button>
        </form>
      </div>
    </section>
  );
}
