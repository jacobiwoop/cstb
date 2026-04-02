import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Tag, User, ArrowLeft, Facebook, Twitter, Linkedin } from 'lucide-react';

export const ArticlePage = () => {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Mock article data (in a real app, this would be fetched based on the ID)
  const article = {
    title: "Appel à la mobilisation générale pour les droits des travailleurs",
    category: "Communiqué",
    date: "2 Avril 2026",
    author: "Bureau Directeur National",
    image: "https://storage.googleapis.com/aistudio-ext-files/0/file_62b17d5985864117.jpeg",
    content: `
      <p class="text-2xl font-light text-gray-800 mb-10 leading-snug">La Confédération Syndicale des Travailleurs du Bénin (CSTB) appelle l'ensemble des travailleurs, des secteurs public et privé, à une mobilisation générale et pacifique pour la défense de nos acquis sociaux historiques.</p>
      
      <h2 class="text-3xl font-display font-bold text-gray-900 mt-12 mb-6">Un contexte de précarité grandissante</h2>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">Face à l'inflation galopante et aux récentes mesures gouvernementales qui menacent le pouvoir d'achat des ménages béninois, il est de notre devoir de réagir. Les travailleurs ne peuvent plus supporter seuls le poids des réformes économiques sans aucune contrepartie sociale.</p>
      
      <blockquote class="border-l-4 border-red-600 bg-gray-50 p-8 my-10 rounded-r-lg shadow-sm">
        <p class="text-xl italic text-gray-800 mb-4">"La ligne de la CSTB, c'est une ligne de conduite générale qui œuvre ardemment à l'amélioration constante des conditions de vie et de travail de la classe ouvrière."</p>
        <footer class="text-sm font-bold text-gray-500">— Nagnini M. KASSA MAMPO, Secrétaire Général Confédéral</footer>
      </blockquote>
      
      <h2 class="text-3xl font-display font-bold text-gray-900 mt-12 mb-6">Nos revendications principales</h2>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">Lors de la dernière session extraordinaire du Comité Confédéral National (CCN), nous avons arrêté les points de revendication suivants :</p>
      <ul class="list-disc list-inside text-lg text-gray-600 leading-relaxed mb-6 space-y-3 marker:text-red-600">
        <li>La revalorisation immédiate du Salaire Minimum Interprofessionnel Garanti (SMIG).</li>
        <li>L'arrêt des licenciements abusifs dans le secteur privé.</li>
        <li>L'amélioration des conditions de travail dans les hôpitaux et les écoles publiques.</li>
        <li>Le respect strict des libertés syndicales et du droit de grève.</li>
      </ul>
      
      <h2 class="text-3xl font-display font-bold text-gray-900 mt-12 mb-6">Appel à l'action</h2>
      <p class="text-lg text-gray-600 leading-relaxed mb-6">Nous invitons tous les syndicats affiliés, les militants et sympathisants à se tenir prêts pour les actions à venir. Un grand rassemblement est prévu à la Bourse du Travail de Cotonou ce vendredi. Venez nombreux pour faire entendre notre voix. L'union fait la force, et c'est ensemble que nous arracherons de nouvelles victoires pour la classe ouvrière.</p>
    `
  };

  return (
    <div className="bg-white min-h-screen font-sans pt-24 pb-16">
      {/* Article Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <Link to="/actualites" className="inline-flex items-center gap-2 text-red-600 font-bold hover:text-red-800 transition-colors mb-8">
          <ArrowLeft size={20} /> Retour aux actualités
        </Link>
        
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-sm">
            {article.category}
          </span>
          <span className="text-gray-500 text-sm font-mono flex items-center gap-1">
            <Calendar size={14} /> {article.date}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-gray-900 leading-tight mb-8">
          {article.title}
        </h1>

        <div className="flex items-center justify-between border-y border-gray-200 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              <User size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">{article.author}</p>
              <p className="text-xs text-gray-500">CSTB Bénin</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-500 hidden sm:inline">Partager :</span>
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#1877F2] hover:text-white transition-colors">
              <Facebook size={14} />
            </button>
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#1DA1F2] hover:text-white transition-colors">
              <Twitter size={14} />
            </button>
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#0A66C2] hover:text-white transition-colors">
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
          className="aspect-video w-full overflow-hidden rounded-xl shadow-lg"
        >
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </div>

      {/* Article Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <article 
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
        
        {/* Tags */}
        <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500 font-bold text-sm uppercase tracking-wider">
            <Tag size={16} /> Mots-clés :
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="bg-gray-100 text-gray-600 text-sm font-medium px-4 py-1.5 rounded-full hover:bg-gray-200 cursor-pointer transition-colors">Syndicalisme</span>
            <span className="bg-gray-100 text-gray-600 text-sm font-medium px-4 py-1.5 rounded-full hover:bg-gray-200 cursor-pointer transition-colors">Mobilisation</span>
            <span className="bg-gray-100 text-gray-600 text-sm font-medium px-4 py-1.5 rounded-full hover:bg-gray-200 cursor-pointer transition-colors">Droits</span>
          </div>
        </div>
      </div>
    </div>
  );
};
