import React, { useState, useEffect } from 'react';
import { donationApi, settingsApi } from '../utils/api';
import { Heart, Target, Coins, Search, User, Mail, Calendar, ExternalLink, Edit2, CheckCircle2, RefreshCcw, Users } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminDonations: React.FC = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [stats, setStats] = useState({ amount: 0, goal: 50000000 });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [donationsData, statsData] = await Promise.all([
        donationApi.getAll(),
        donationApi.getStats()
      ]);
      setDonations(donationsData);
      setStats(statsData);
      setNewGoal(statsData.goal.toString());
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGoal = async () => {
    try {
      // Pour mettre à jour l'objectif, on met à jour les settings
      const currentSettings = await settingsApi.get();
      await settingsApi.update({
        ...currentSettings,
        donationGoal: parseInt(newGoal)
      });
      setStats({ ...stats, goal: parseInt(newGoal) });
      setIsEditingGoal(false);
      alert("Objectif de don mis à jour !");
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour de l'objectif");
    }
  };

  const percentage = Math.min(100, Math.round((stats.amount / stats.goal) * 100));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <RefreshCcw className="animate-spin text-[#007cba]" size={32} />
        <p className="text-slate-400 font-bold animate-pulse">Chargement de la campagne...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header & Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Raised Card */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Heart size={120} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs font-black text-[#64748b] uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Coins size={14} className="text-[#007cba]" /> Total Récolté
                </p>
                <h2 className="text-4xl font-black text-[#0f172a] font-mono">
                  {stats.amount.toLocaleString('fr-FR')} <span className="text-xl text-[#64748b]">FCFA</span>
                </h2>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-2 justify-end">
                  <p className="text-xs font-black text-[#64748b] uppercase tracking-widest">Objectif</p>
                  <button 
                    onClick={() => setIsEditingGoal(true)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-[#007cba] transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                </div>
                {isEditingGoal ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="number"
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      className="bg-slate-50 border border-[#007cba] rounded-lg px-3 py-1 text-sm font-bold w-32 outline-none"
                      autoFocus
                    />
                    <button 
                      onClick={handleUpdateGoal}
                      className="bg-[#007cba] text-white p-1.5 rounded-lg hover:bg-[#005a87]"
                    >
                      <CheckCircle2 size={14} />
                    </button>
                  </div>
                ) : (
                  <h3 className="text-xl font-bold text-[#0f172a]">
                    {stats.goal.toLocaleString('fr-FR')} FCFA
                  </h3>
                )}
              </div>
            </div>

            {/* Global Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                <span className="text-[#007cba]">Progression</span>
                <span className="text-[#0f172a]">{percentage}%</span>
              </div>
              <div className="h-4 bg-[#f1f5f9] rounded-full overflow-hidden border border-[#e2e8f0]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#007cba] to-[#0ea5e9]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Count Card */}
        <div className="bg-[#0f172a] p-8 rounded-3xl text-white flex flex-col justify-center">
          <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-2">Nombre de Donateurs</p>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#007cba]/20 flex items-center justify-center">
              <Users className="text-[#38bdf8]" size={24} />
            </div>
            <h2 className="text-4xl font-black font-mono">{donations.length}</h2>
          </div>
          <p className="mt-4 text-xs text-white/40 leading-relaxed italic">
            Chaque contribution rapproche la CSTB de son siège social définitif.
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="p-8 border-b border-[#e2e8f0] flex justify-between items-center bg-[#f8fafc]/50">
          <h3 className="text-lg font-black text-[#0f172a] uppercase tracking-widest flex items-center gap-3">
            <Calendar size={20} className="text-[#007cba]" /> Historique des Transactions
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Rechercher un donateur..."
              className="pl-10 pr-4 py-2 bg-white border border-[#e2e8f0] rounded-xl text-sm focus:border-[#007cba] outline-none transition-all w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-left border-b border-[#e2e8f0]">
                <th className="px-8 py-4 text-xs font-black text-[#64748b] uppercase tracking-widest">Donateur</th>
                <th className="px-8 py-4 text-xs font-black text-[#64748b] uppercase tracking-widest text-center">Date</th>
                <th className="px-8 py-4 text-xs font-black text-[#64748b] uppercase tracking-widest text-center">Référence</th>
                <th className="px-8 py-4 text-xs font-black text-[#64748b] uppercase tracking-widest text-right">Montant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {donations.length > 0 ? (
                donations.map((donation) => (
                  <tr key={donation.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#007cba] font-bold">
                          {donation.donorName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0f172a]">{donation.donorName}</p>
                          <p className="text-xs text-[#94a3b8]">{donation.donorEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center text-xs font-medium text-[#64748b]">
                      {new Date(donation.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <span className="text-[10px] font-mono bg-slate-100 px-2 py-1 rounded text-[#64748b]">
                        {donation.reference || "N/A"}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <p className="text-sm font-black text-[#0f172a]">
                        +{donation.amount.toLocaleString('fr-FR')} FCFA
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-8 py-12 text-center text-slate-400 italic">
                    Aucune transaction enregistrée pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
