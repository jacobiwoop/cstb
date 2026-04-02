import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, ChevronLeft, Calendar, Tag, ArrowRight, Search, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NewsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [filter, setFilter] = useState('Toutes');

  const categories = ['Toutes', 'Communiqué', 'Éducation', 'Négociation', 'Mobilisation', 'Événement'];

  const allNews = [
    {
      id: 1,
      date: "2 Avril 2026",
      category: "Communiqué",
      title: "Appel à la mobilisation générale pour les droits des travailleurs",
      excerpt: "La CSTB appelle tous les travailleurs à se mobiliser pour défendre les acquis sociaux face aux nouvelles mesures gouvernementales. Un rassemblement est prévu à la Bourse du Travail.",
      image: "https://storage.googleapis.com/aistudio-ext-files/0/file_62b17d5985864117.jpeg"
    },
    {
      id: 2,
      date: "15 Mars 2026",
      category: "Éducation",
      title: "Succès de la plateforme éducative soutenue par l'UNESCO",
      excerpt: "Plus de 5000 enseignants ont déjà rejoint notre nouvelle plateforme de formation continue, renforçant ainsi la qualité de l'enseignement au niveau national.",
      image: "https://storage.googleapis.com/aistudio-ext-files/0/file_d620573e16444da9.jpeg"
    },
    {
      id: 3,
      date: "28 Février 2026",
      category: "Négociation",
      title: "Avancées significatives sur la convention collective",
      excerpt: "Après plusieurs semaines de négociations intenses, des accords de principe ont été trouvés concernant la revalorisation salariale dans le secteur privé.",
      image: "https://storage.googleapis.com/aistudio-ext-files/0/file_1a734661852a4e40.jpeg"
    },
    {
      id: 4,
      date: "10 Février 2026",
      category: "Mobilisation",
      title: "Marche pacifique contre la précarité de l'emploi",
      excerpt: "Des milliers de militants ont marché dans les rues de Cotonou pour dénoncer les contrats abusifs et exiger des emplois décents pour la jeunesse.",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80"
    },
    {
      id: 5,
      date: "25 Janvier 2026",
      category: "Événement",
      title: "Conférence internationale sur l'avenir du syndicalisme",
      excerpt: "La CSTB a accueilli des délégations de toute l'Afrique de l'Ouest pour échanger sur les défis du syndicalisme à l'ère du numérique.",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80"
    },
    {
      id: 6,
      date: "12 Janvier 2026",
      category: "Communiqué",
      title: "Bilan annuel 2025 : Une année de luttes et de victoires",
      excerpt: "Le Secrétaire Général a présenté le bilan des actions menées l'année dernière, soulignant les avancées majeures obtenues pour les travailleurs de la santé.",
      image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80"
    },
    {
      id: 7,
      date: "05 Décembre 2025",
      category: "Éducation",
      title: "Lancement du programme de bourses pour les orphelins",
      excerpt: "La confédération lance son programme annuel de soutien scolaire destiné aux enfants des travailleurs décédés.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80"
    },
    {
      id: 8,
      date: "20 Novembre 2025",
      category: "Négociation",
      title: "Rencontre avec le Ministère du Travail",
      excerpt: "Une délégation de la CSTB a été reçue pour discuter des conditions de sécurité sur les chantiers de construction publics.",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80"
    },
    {
      id: 9,
      date: "01 Novembre 2025",
      category: "Mobilisation",
      title: "Grève d'avertissement dans le secteur des transports",
      excerpt: "Mouvement très suivi par les transporteurs pour protester contre les nouvelles taxes jugées asphyxiantes.",
      image: "https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&q=80"
    }
  ];

  const filteredNews = filter === 'Toutes' 
    ? allNews 
    : allNews.filter(news => news.category === filter);

  return (
    <div className="bg-gray-50 min-h-screen font-sans pt-24 pb-16">
      {/* Header */}
      <div className="relative w-full h-[600px] md:h-[500px] bg-gray-100 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" 
            alt="People working on laptop" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        {/* Content Container */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-end md:items-center justify-between pb-12 md:pb-0">
          
          {/* Left Navigation Arrows */}
          <div className="flex gap-3 mb-8 md:mb-0 md:mt-auto md:pb-16 z-20">
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors shadow-md">
              <ChevronLeft size={20} />
            </button>
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors shadow-md">
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Right Green Box */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-[#115e59] text-white p-8 md:p-12 w-full md:w-[500px] lg:w-[550px] shadow-2xl z-10 relative"
          >
            <div className="flex items-center gap-2 text-[#facc15] text-sm font-bold tracking-wider uppercase mb-2">
              <span className="text-[10px]">▶</span> à la une
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-4xl md:text-5xl font-light tracking-wide">ACTUALITÉS</h1>
              <Megaphone size={40} className="text-[#facc15]" strokeWidth={1.5} />
            </div>

            <h2 className="text-xl font-bold mb-4">
              Bienvenue sur notre nouveau site Internet !
            </h2>
            
            <p className="text-gray-200 font-light leading-relaxed mb-6 text-sm md:text-base">
              Nous sommes heureux de vous compter parmi les premiers visiteurs de notre nouveau site Internet. Découvrez-le en quelques mots...
            </p>

            <a href="#" className="inline-block text-sm font-bold underline underline-offset-4 mb-8 hover:text-gray-300 transition-colors">
              LIRE LA SUITE
            </a>

            <button className="w-full bg-[#facc15] hover:bg-[#eab308] text-gray-900 font-bold py-4 px-6 flex items-center justify-center gap-3 transition-colors">
              <ArrowRight size={18} />
              VOIR TOUTES LES ACTUS
            </button>
          </motion.div>
        </div>

        {/* Torn Paper Effect Bottom */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-20 rotate-180">
          <svg className="relative block w-full h-[20px] md:h-[30px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className="fill-gray-50"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-51.24V0Z" opacity=".5" className="fill-gray-50"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className="fill-gray-50"></path>
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
                    ? 'bg-red-600 text-white shadow-md' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300 hover:text-red-600'
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
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:border-red-600 focus:ring-0 outline-none text-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
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
              className="group flex flex-col bg-white border border-gray-100 rounded-2xl hover:border-red-600/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                  <Tag size={12} className="text-red-600" /> {item.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-gray-500 text-sm font-mono mb-4">
                  <Calendar size={14} />
                  <span>{item.date}</span>
                </div>
                <h3 className="text-xl font-display font-bold mb-3 text-gray-900 group-hover:text-red-600 transition-colors line-clamp-2 leading-tight">
                  {item.title}
                </h3>
                <p className="text-gray-600 font-light text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                  {item.excerpt}
                </p>
                <Link to={`/actualites/${item.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors mt-auto w-fit">
                  Lire l'article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">Aucune actualité trouvée pour cette catégorie.</p>
          </div>
        )}

        {/* Pagination (Mock) */}
        {filteredNews.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-16">
            <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-400 transition-colors" disabled>
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center bg-red-600 text-white font-bold shadow-md">
              1
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-bold">
              2
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-bold">
              3
            </button>
            <button className="w-10 h-10 rounded-full flex items-center justify-center border border-gray-200 text-gray-900 hover:border-gray-400 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
