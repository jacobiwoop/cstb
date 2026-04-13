import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Newspaper, Users, Heart, MessageSquare, TrendingUp, Loader2 } from 'lucide-react';
import { statsApi } from '../utils/api';

interface StatsData {
  articles: number;
  subscribers: number;
  likes: number;
  comments: number;
  recentActivity: any[];
}

export const AdminStats: React.FC = () => {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await statsApi.get();
        setData(stats);
      } catch (error) {
        console.error('Erreur stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Articles de presse', value: data?.articles || 0, icon: <Newspaper />, color: 'bg-blue-500' },
    { label: 'Abonnés Newsletter', value: data?.subscribers || 0, icon: <Users />, color: 'bg-green-500' },
    { label: 'Réactions totales', value: data?.likes || 0, icon: <Heart />, color: 'bg-red-500' },
    { label: 'Commentaires', value: data?.comments || 0, icon: <MessageSquare />, color: 'bg-purple-500' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 text-[#007cba] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
              {stat.icon}
            </div>
            <p className="text-[#6b7280] text-sm font-bold uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-3xl font-sans font-extrabold text-[#0f172a]">{stat.value.toLocaleString()}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="text-[#007cba]" />
          <h2 className="text-xl font-bold text-[#0f172a]">Activité récente</h2>
        </div>
        <div className="space-y-4">
          {data?.recentActivity && data.recentActivity.length > 0 ? (
            data.recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between py-4 border-b border-[#f1f5f9] last:border-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#f8fafc] rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#007cba] rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0f172a]">{activity.title}</p>
                    <p className="text-xs text-[#94a3b8]">{new Date(activity.date).toLocaleDateString()} - {activity.email}</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-[#94a3b8]">{activity.id}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#64748b] text-center py-10">Aucune activité récente.</p>
          )}
        </div>
      </div>
    </div>
  );
};
