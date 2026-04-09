import React, { useState, useEffect } from 'react';
import { articleApi } from '../utils/api';
import { Edit, Trash2, Plus, Search, Eye, ThumbsUp, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const AdminNews: React.FC = () => {
  const [news, setNews] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const data = await articleApi.getAll();
      setNews(data);
    } catch (error) {
      console.error("Erreur de récupération :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet article ?')) {
      try {
        await articleApi.delete(id);
        const updated = news.filter(n => n.id !== id);
        setNews(updated);
      } catch (error) {
        console.error("Erreur suppression", error);
        alert("Impossible de supprimer l'article serveur");
      }
    }
  };

  const filteredNews = news.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-[#e2e8f0]">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Rechercher un article..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#e2e8f0] focus:border-[#007cba] outline-none text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl text-sm font-bold text-[#6b7280] hover:bg-white transition-all flex items-center gap-2">
            Catégories
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-[#6b7280] uppercase tracking-wider">Article</th>
              <th className="px-6 py-4 text-xs font-bold text-[#6b7280] uppercase tracking-wider hidden lg:table-cell">Date / Catégorie</th>
              <th className="px-6 py-4 text-xs font-bold text-[#6b7280] uppercase tracking-wider text-center">Interactions</th>
              <th className="px-6 py-4 text-xs font-bold text-[#6b7280] uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1f5f9]">
            {filteredNews.map((item, i) => (
              <tr key={item.id} className="hover:bg-[#f8fafc]/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                      <div className="w-full h-full bg-[#007cba]/10 flex items-center justify-center text-[#007cba]">
                        <Newspaper size={20} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0f172a] line-clamp-1">{item.title}</p>
                      <p className="text-xs text-[#94a3b8] mt-1 lg:hidden">{item.category} • {item.date}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <p className="text-xs font-bold text-[#0f172a]">{item.date}</p>
                  <p className="text-[10px] text-[#007cba] font-bold uppercase tracking-widest mt-1">{item.category}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-4 text-[#94a3b8]">
                    <span className="flex items-center gap-1 text-xs"><ThumbsUp size={14} /> {item.likes || 0}</span>
                    <span className="flex items-center gap-1 text-xs"><MessageSquare size={14} /> {item.comments?.length || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/admin/actualites/${item.id}/preview`} className="p-2 text-[#6b7280] hover:text-[#007cba] hover:bg-[#007cba]/10 rounded-lg transition-colors" title="Aperçu & Commentaires">
                      <Eye size={18} />
                    </Link>
                    <Link to={`/admin/actualites/${item.id}/edit`} className="p-2 text-[#6b7280] hover:text-[#007cba] hover:bg-[#007cba]/10 rounded-lg transition-colors" title="Modifier">
                      <Edit size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-[#6b7280] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" 
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {isLoading ? (
          <div className="py-20 text-center">
            <p className="text-[#6b7280] font-medium">Chargement des articles depuis le serveur...</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-[#6b7280] font-medium">Aucun article dans la base de données.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

import { Newspaper } from 'lucide-react';
