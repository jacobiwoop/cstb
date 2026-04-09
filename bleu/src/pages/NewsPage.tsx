import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ChevronLeft, Calendar, Tag, ArrowRight, Search, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { articleApi } from '../utils/api';
import newsHeroImg from '../assets/2f2be7a217340647bfcfaebd36fdfaed.jpg';

export const NewsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [filter, setFilter] = useState('Toutes');

  const categories = ['Toutes', 'Communiqué', 'Éducation', 'Négociation', 'Mobilisation', 'Événement'];

  const [allNews, setAllNews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await articleApi.getAll();
        setAllNews(data);
      } catch (error) {
        console.error("Erreur de récupération :", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = filter === 'Toutes' 
    ? allNews 
    : allNews.filter(news => news.category === filter);

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pt-24 pb-16">
      {/* Header */}
      <div className="relative w-full h-[600px] md:h-[500px] bg-[#f1f5f9] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src={newsHeroImg} 
            alt="People working on laptop" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Content Container */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-end md:items-center justify-between pb-12 md:pb-0">
          
          {/* Left Navigation Arrows */}
          <div className="flex gap-3 mb-8 md:mb-0 md:mt-auto md:pb-16 z-20">
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0f172a] hover:bg-[#f1f5f9] transition-colors shadow-custom-2">
              <ChevronLeft size={20} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#0f172a] hover:bg-[#f1f5f9] transition-colors shadow-custom-2">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Right Green Box */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[#005a87] text-white p-8 md:p-12 w-full md:w-[500px] lg:w-[550px] shadow-custom-3 z-10 relative"
          >
            <div className="flex items-center gap-2 text-[#0891b2] text-sm font-bold tracking-wider uppercase mb-2">
              <span className="text-[10px]">▶</span> à la une
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-light tracking-wide">ACTUALITÉS</h1>
              <Megaphone size={40} className="text-[#0891b2]" strokeWidth={1.5} />
            </div>

            <h2 className="text-xl font-bold mb-4">
              Bienvenue sur notre nouveau site Internet !
            </h2>
            
            <p className="text-[#e2e8f0] font-light leading-relaxed mb-6 text-sm md:text-base">
              Nous sommes heureux de vous compter parmi les premiers visiteurs de notre nouveau site Internet. Découvrez-le en quelques mots...
            </p>

            <a href="#" className="inline-block text-sm font-bold underline underline-offset-4 mb-8 hover:text-[#cbd5e1] transition-colors">
              LIRE LA SUITE
            </a>

            <button className="w-full bg-[#0891b2] hover:bg-[#006ba1] text-[#0f172a] font-bold py-4 px-6 flex items-center justify-center gap-3 transition-colors">
              <ArrowRight size={18} />
              VOIR TOUTES LES ACTUS
            </button>
          </motion.div>
        </div>

        {/* Torn Paper Effect Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 rotate-180">
          <svg className="relative block w-full h-[20px] md:h-[30px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-[#f8fafc]"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-51.24V0Z" opacity=".5" className="fill-[#f8fafc]"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-[#f8fafc]"></path>
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  filter === cat 
                    ? 'bg-[#007cba] text-white shadow-custom-2' 
                    : 'bg-white text-[#6b7280] border border-[#e2e8f0] hover:border-[#007cba] hover:text-[#007cba]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="w-full pl-10 pr-4 py-2 rounded-full border border-[#e2e8f0] focus:border-[#007cba] focus:ring-0 outline-none text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={16} />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex flex-col bg-white border border-[#f1f5f9] rounded-2xl hover:border-[#007cba]/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[#0f172a] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-custom-4 flex items-center gap-1.5">
                  <Tag size={12} className="text-[#007cba]" /> {item.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-[#6b7280] text-sm font-mono mb-4">
                  <Calendar size={14} />
                  <span>{item.date}</span>
                </div>
                <Link to={`/actualites/${item.id}`}>
                  <h3 className="text-xl font-sans font-bold mb-3 text-[#0f172a] group-hover:text-[#007cba] transition-colors line-clamp-2 leading-tight">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-[#6b7280] font-light text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                  {item.excerpt}
                </p>
                <Link to={`/actualites/${item.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#0f172a] group-hover:text-[#007cba] transition-colors mt-auto w-fit">
                  Lire l'article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-20">
            <p className="text-[#6b7280] text-lg">Aucune actualité trouvée pour cette catégorie.</p>
          </div>
        )}

        {/* Pagination (Mock) */}
        {filteredNews.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            <button className="w-10 h-10 rounded-full flex items-center justify-center border border-[#e2e8f0] text-[#94a3b8] hover:text-[#0f172a] hover:border-[#94a3b8] transition-colors" disabled>
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-[#007cba] text-white font-bold shadow-custom-2">
              1
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center border border-[#e2e8f0] text-[#6b7280] hover:bg-[#f8fafc] transition-colors font-bold">
              2
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center border border-[#e2e8f0] text-[#6b7280] hover:bg-[#f8fafc] transition-colors font-bold">
              3
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center border border-[#e2e8f0] text-[#0f172a] hover:border-[#94a3b8] transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
