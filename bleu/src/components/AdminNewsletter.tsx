import React, { useEffect, useState } from 'react';
import { Mail, Trash2, CheckCircle, Clock, Download } from 'lucide-react';
import { newsletterApi } from '../utils/api';
import { Link } from 'react-router-dom';

export const AdminNewsletter: React.FC = () => {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const data = await newsletterApi.getAll();
      setSubscribers(data);
    } catch (error) {
      console.error("Erreur de récupération :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Supprimer cet abonné ?')) {
      try {
        await newsletterApi.delete(id);
        setSubscribers(subscribers.filter(s => s.id !== id));
      } catch (error) {
        console.error("Erreur suppression", error);
        alert("Impossible de supprimer l'abonné");
      }
    }
  };

  const exportToCSV = () => {
    const headers = ["ID", "Email", "Date d'inscription"];
    const rows = subscribers.map(s => [s.id, s.email, new Date(s.createdAt).toLocaleDateString()]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#007cba]/10 text-[#007cba] rounded-2xl flex items-center justify-center">
              <Mail size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0f172a]">Liste des inscrits</h2>
              <p className="text-sm text-[#6b7280]">
                {isLoading ? "Chargement..." : `${subscribers.length} abonnés à la newsletter`}
              </p>
            </div>
          </div>
          
          {subscribers.length >= 0 && (
            <div className="flex gap-3">
              <Link 
                to="/cstb-bureau-5Xy8/newsletter/compose"
                className="flex items-center gap-2 px-6 py-3 bg-[#007cba] text-white rounded-xl font-bold hover:bg-[#005a87] transition-all text-sm shadow-md"
              >
                <Mail size={18} /> Composer un mail
              </Link>
              {subscribers.length > 0 && (
                <button 
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-6 py-3 bg-[#f8fafc] border border-[#e2e8f0] text-[#0f172a] rounded-xl font-bold hover:bg-white transition-all text-sm"
                >
                  <Download size={18} /> Exporter en CSV
                </button>
              )}
            </div>
          )}
        </div>

        <div className="overflow-hidden bg-[#f8fafc] rounded-2xl border border-[#e2e8f0]">
          <div className="divide-y divide-[#e2e8f0]">
            {Array.isArray(subscribers) && subscribers.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between p-4 hover:bg-white transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle size={14} />
                  </div>
                  <span className="text-sm font-bold text-[#1e293b]">{sub.email}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-[#94a3b8] font-mono flex items-center gap-1">
                    <Clock size={10} /> {new Date(sub.createdAt).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => handleDelete(sub.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg md:opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
            {!isLoading && subscribers.length === 0 && (
              <div className="p-12 text-center text-[#6b7280]">
                <p>Aucun abonné pour le moment.</p>
              </div>
            )}
            {isLoading && (
              <div className="p-12 text-center text-[#6b7280]">
                <p className="animate-pulse">Récupération des abonnés depuis le serveur...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
