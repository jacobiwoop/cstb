import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { articleApi, commentApi } from '../utils/api';
import { ArrowLeft, MessageSquare, Trash2, Reply, Send, User } from 'lucide-react';
import { motion } from 'motion/react';

export const AdminArticlePreviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      const data = await articleApi.getOne(id!);
      setArticle(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (window.confirm("Supprimer ce commentaire définitivement ?")) {
      try {
        await commentApi.delete(commentId);
        setArticle({
          ...article,
          comments: article.comments.filter((c: any) => c.id !== commentId)
        });
      } catch (error) {
        alert("Erreur de suppression");
      }
    }
  };

  const handleReply = async (commentId: number) => {
    try {
      const text = replyText[commentId];
      if (!text || text.trim() === '') return;
      const updated = await commentApi.update(commentId, { adminReply: text });
      setArticle({
        ...article,
        comments: article.comments.map((c: any) => c.id === commentId ? updated : c)
      });
      setReplyText({ ...replyText, [commentId]: '' });
    } catch (error) {
      alert("Erreur d'envoi");
    }
  };

  if (loading) return <div className="p-10 text-center text-[#6b7280]">Chargement de la prévisualisation...</div>;
  if (!article) return <div className="p-10 text-center text-red-500">Article introuvable ou erreur de chargement.</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-[#e2e8f0] justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="p-2 hover:bg-[#f1f5f9] rounded-xl transition-colors">
            <ArrowLeft size={20} className="text-[#6b7280]" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-[#0f172a] line-clamp-1">Aperçu : {article.title}</h1>
            <p className="text-xs text-[#94a3b8]">{article.category} • {article.formattedDate || article.date}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Colonne Aperçu Article (Gauche) */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden h-fit">
          {article.image && (
            <div className="w-full h-64 sm:h-80 relative">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <h2 className="absolute bottom-6 left-6 sm:left-8 right-6 sm:right-8 text-2xl sm:text-3xl font-black text-white drop-shadow-md leading-tight">
                {article.title}
              </h2>
            </div>
          )}
          <div className="p-6 sm:p-8 overflow-x-hidden">
            <div 
              className="article-content"
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />
          </div>
        </div>

        {/* Colonne Modération Commentaires (Droite) */}
        <div className="bg-white xl:bg-[#f8fafc] rounded-3xl border border-[#e2e8f0] shadow-sm p-6 flex flex-col h-fit xl:sticky xl:top-24">
          <div className="flex items-center gap-2 mb-6 border-b border-[#e2e8f0] pb-4">
            <MessageSquare size={20} className="text-[#007cba]" />
            <h3 className="text-lg font-bold text-[#0f172a]">Commentaires ({article.comments?.length || 0})</h3>
          </div>

          <div className="space-y-6">
            {!article.comments || article.comments.length === 0 ? (
               <div className="text-center py-10 bg-[#f1f5f9] rounded-2xl border border-dashed border-[#cbd5e1]">
                 <MessageSquare size={32} className="mx-auto text-[#94a3b8] mb-3 opacity-50" />
                 <p className="text-sm text-[#6b7280]">Aucun commentaire pour le moment.</p>
               </div>
            ) : (
              article.comments.map((comment: any) => (
                <motion.div key={comment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center">
                        <User size={16} className="text-[#6b7280]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0f172a] leading-none mb-1">{comment.author}</p>
                        <p className="text-[10px] text-[#94a3b8] uppercase tracking-wider">{comment.date}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-[#ef4444] hover:bg-[#ef4444]/10 p-2 rounded-lg transition-colors"
                      title="Supprimer ce commentaire"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <p className="text-sm text-[#475569] mb-4 leading-relaxed bg-[#f8fafc] p-3 rounded-xl border border-[#f1f5f9]">{comment.text}</p>

                  {/* Zone de réponse Admin */}
                  {comment.adminReply ? (
                    <div className="bg-[#0f172a] text-white p-4 rounded-xl text-sm relative ml-4 border-l-4 border-[#007cba] shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-[#38bdf8] uppercase tracking-wider">
                           <Reply size={12} className="rotate-180" /> Votre réponse
                        </div>
                        <button 
                          onClick={async () => {
                            if(window.confirm("Supprimer votre réponse ?")) {
                              const updated = await commentApi.update(comment.id, { adminReply: null });
                              setArticle({
                                ...article,
                                comments: article.comments.map((c: any) => c.id === comment.id ? updated : c)
                              });
                            }
                          }}
                          className="text-[#94a3b8] hover:text-white transition-colors p-1"
                          title="Effacer la réponse"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-gray-200 leading-relaxed">{comment.adminReply}</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-4 ml-4">
                      <input 
                        type="text" 
                        value={replyText[comment.id] || ''}
                        onChange={(e) => setReplyText({...replyText, [comment.id]: e.target.value})}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleReply(comment.id); }}
                        placeholder="Répondre publiquement..." 
                        className="flex-1 text-xs bg-white border border-[#cbd5e1] rounded-xl px-4 py-3 outline-none focus:border-[#007cba] focus:ring-2 focus:ring-[#007cba]/20 transition-all font-medium text-[#0f172a]"
                      />
                      <button 
                        onClick={() => handleReply(comment.id)}
                        className="bg-[#007cba] text-white p-3 rounded-xl hover:bg-[#005a87] transition-colors shadow-custom-2"
                        title="Envoyer la réponse"
                      >
                        <Reply size={16} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
