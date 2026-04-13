import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Tag, User, ArrowLeft, Facebook, Twitter, Linkedin, Heart, MessageSquare, Send } from 'lucide-react';
import { LocalDB } from '../utils/localDb';
import { articleApi, commentApi, getMediaUrl } from '../utils/api';

export const ArticlePage = () => {
  const { id } = useParams();
  const articleId = id ? parseInt(id) : 1;

  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(() => LocalDB.get(`liked_${articleId}`, false));
  const [newComment, setNewComment] = useState("");

  const fetchArticle = async () => {
    try {
      const data = await articleApi.getOne(articleId);
      setArticle(data);
    } catch (error) {
      console.error("Erreur chargement article", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchArticle();
  }, [articleId]);

  const handleLike = async () => {
    try {
      const newLikedState = !isLiked;
      const newLikes = newLikedState ? (article.likes + 1) : Math.max(0, article.likes - 1);
      
      await articleApi.update(articleId, { ...article, likes: newLikes });
      
      setArticle({ ...article, likes: newLikes });
      setIsLiked(newLikedState);
      LocalDB.save(`liked_${articleId}`, newLikedState);
    } catch (error) {
      console.error("Erreur like", error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      await commentApi.create({
        author: "Utilisateur Anonyme",
        text: newComment,
        articleId: articleId,
        date: "À l'instant"
      });
      
      setNewComment("");
      fetchArticle(); // Rafraîchir pour voir le nouveau commentaire
    } catch (error) {
      console.error("Erreur ajout commentaire", error);
      alert("Impossible d'ajouter le commentaire");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-16 text-center">
        <p className="text-xl font-bold text-[#6b7280]">Chargement de l'article...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-white min-h-screen pt-32 pb-16 text-center">
        <h2 className="text-3xl font-black text-[#0f172a] mb-4">Article introuvable</h2>
        <Link to="/actualites" className="text-[#007cba] hover:underline font-bold">Retourner aux actualités</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen font-sans pt-24 pb-16">
      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <Link to="/actualites" className="inline-flex items-center gap-2 text-[#007cba] font-bold hover:text-[#005a87] transition-colors mb-8">
          <ArrowLeft size={20} /> Retour aux actualités
        </Link>
        
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-[#007cba] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-[6px]">
            {article.category}
          </span>
          <span className="text-[#6b7280] text-sm font-mono flex items-center gap-1">
            <Calendar size={14} /> {article.formattedDate || new Date(article.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-sans font-black text-[#0f172a] leading-tight mb-8">
          {article.title}
        </h1>

        <div className="flex items-center justify-between border-y border-[#e2e8f0] py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e2e8f0] rounded-full flex items-center justify-center text-[#6b7280]">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0f172a]">{article.author}</p>
              <p className="text-xs text-[#6b7280]">CSTB Bénin</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-[#6b7280] hidden sm:inline">Partager :</span>
            <button className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#6b7280] hover:bg-[#1877F2] hover:text-white transition-colors">
              <Facebook size={14} />
            </button>
            <button className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#6b7280] hover:bg-[#1DA1F2] hover:text-white transition-colors">
              <Twitter size={14} />
            </button>
            <button className="w-8 h-8 rounded-full bg-[#f1f5f9] flex items-center justify-center text-[#6b7280] hover:bg-[#0A66C2] hover:text-white transition-colors">
              <Linkedin size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="aspect-video w-full overflow-hidden rounded-[12px] shadow-custom-1"
        >
          <img 
            src={getMediaUrl(article.image)} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <article 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* Interaction Bar */}
        <div className="mt-12 py-6 border-y border-[#e2e8f0] flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={handleLike}
              className={`flex items-center gap-2 font-bold transition-colors ${isLiked ? 'text-red-500' : 'text-[#6b7280] hover:text-red-500'}`}
            >
              <Heart size={24} className={isLiked ? "fill-current" : ""} />
              <span>{article.likes} {article.likes > 1 ? "J'aimes" : "J'aime"}</span>
            </button>
            <div className="flex items-center gap-2 font-bold text-[#6b7280]">
              <MessageSquare size={24} />
              <span>{article.comments?.length || 0} {article.comments?.length > 1 ? 'Commentaires' : 'Commentaire'}</span>
            </div>
          </div>
        </div>
        
        {/* Tags */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 text-[#6b7280] font-bold text-sm uppercase tracking-wider">
            <Tag size={16} /> Mots-clés :
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#f1f5f9] text-[#6b7280] text-sm font-medium px-4 py-1.5 rounded-full hover:bg-[#e2e8f0] cursor-pointer transition-colors">Syndicalisme</span>
            <span className="bg-[#f1f5f9] text-[#6b7280] text-sm font-medium px-4 py-1.5 rounded-full hover:bg-[#e2e8f0] cursor-pointer transition-colors">Mobilisation</span>
            <span className="bg-[#f1f5f9] text-[#6b7280] text-sm font-medium px-4 py-1.5 rounded-full hover:bg-[#e2e8f0] cursor-pointer transition-colors">Droits</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-sans font-bold text-[#0f172a] mb-8">Commentaires ({article.comments?.length || 0})</h3>
          
          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-12 bg-[#f8fafc] p-6 rounded-[12px] border border-[#e2e8f0]">
            <h4 className="text-lg font-bold text-[#0f172a] mb-4">Laisser un commentaire</h4>
            <div className="relative">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Votre message..."
                className="w-full bg-white border border-[#cbd5e1] rounded-[8px] p-4 min-h-[120px] focus:outline-none focus:border-[#007cba] focus:ring-1 focus:ring-[#007cba] resize-y"
                required
              />
              <button 
                type="submit"
                className="absolute bottom-4 right-4 bg-[#007cba] text-white p-2 rounded-full hover:bg-[#005a87] transition-colors shadow-custom-4 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newComment.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {(article.comments || []).map((comment: any) => (
              <div key={comment.id} className="flex gap-4">
                <div className="w-12 h-12 bg-[#e2e8f0] rounded-full flex items-center justify-center text-[#6b7280] shrink-0">
                  <User size={24} />
                </div>
                <div className="flex-1 bg-white border border-[#e2e8f0] p-5 rounded-[12px] rounded-tl-none shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-bold text-[#0f172a]">{comment.author}</h5>
                    <span className="text-xs text-[#94a3b8] font-mono">{comment.date}</span>
                  </div>
                  <p className="text-[#475569] leading-relaxed">{comment.text}</p>
                  
                  {comment.adminReply && (
                    <div className="mt-4 p-4 bg-[#f8fafc] border-l-4 border-[#007cba] rounded-r-xl">
                      <p className="text-xs font-bold text-[#007cba] uppercase tracking-wider mb-1">Réponse de la CSTB</p>
                      <p className="text-sm text-[#334155] italic">"{comment.adminReply}"</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
