import React from 'react';
import { Mail, Trash2, CheckCircle, Clock } from 'lucide-react';
import { LocalDB } from '../utils/localDb';

export const AdminNewsletter: React.FC = () => {
  const [subscribers, setSubscribers] = React.useState<string[]>(() => LocalDB.get('subscribers', []));

  const handleDelete = (email: string) => {
    if (window.confirm('Supprimer cet abonné ?')) {
      const updated = subscribers.filter(s => s !== email);
      setSubscribers(updated);
      LocalDB.save('subscribers', updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#007cba]/10 text-[#007cba] rounded-2xl flex items-center justify-center">
            <Mail size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#0f172a]">Liste des inscrits</h2>
            <p className="text-sm text-[#6b7280]">{subscribers.length} abonnés à la newsletter</p>
          </div>
        </div>

        <div className="overflow-hidden bg-[#f8fafc] rounded-2xl">
          <div className="divide-y divide-[#e2e8f0]">
            {subscribers.map((email, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-white transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle size={14} />
                  </div>
                  <span className="text-sm font-bold text-[#1e293b]">{email}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-[#94a3b8] font-mono flex items-center gap-1">
                    <Clock size={10} /> {new Date().toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => handleDelete(email)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {subscribers.length === 0 && (
              <div className="p-12 text-center text-[#6b7280]">
                <p>Aucun abonné pour le moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
