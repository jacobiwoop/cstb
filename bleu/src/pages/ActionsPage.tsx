import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { actionApi, getMediaUrl, PLACEHOLDER_IMAGE } from '../utils/api';

export default function ActionsPage() {
  const [actions, setActions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActions = async () => {
      try {
        const data = await actionApi.getAll();
        setActions(data);
      } catch (error) {
        console.error("Erreur lors du chargement des actions", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActions();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-[#f8fafc] min-h-screen pt-32 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-64 bg-gray-200 rounded-xl mb-4"></div>
          <p className="text-[#6b7280]">Chargement des actions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans pt-24 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-sans font-bold text-[#0f172a] mb-6">Nos Actions & Luttes</h1>
        <p className="text-xl text-[#6b7280] max-w-3xl">
          Découvrez l'ensemble de nos mobilisations, grèves et actions syndicales menées sur le terrain pour la défense des droits des travailleurs.
        </p>
      </div>

      {/* Actions as Articles Grid */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {actions.map((action, index) => (
              <motion.article 
                key={action.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 3) * 0.1 }}
                className="bg-white border border-[#e2e8f0] rounded-[12px] overflow-hidden shadow-custom-4 hover:shadow-custom-2 transition-shadow flex flex-col"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={getMediaUrl(action.image)} 
                    alt={action.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e: any) => { e.target.src = PLACEHOLDER_IMAGE; }}
                  />
                  <div className="absolute top-4 left-4 bg-[#007cba] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-[6px]">
                    Action
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-[#6b7280] text-sm font-medium mb-3">
                    <Calendar size={16} />
                    {action.date}
                  </div>
                  <h3 className="text-xl font-sans font-bold mb-3 text-[#0f172a] line-clamp-2">{action.title}</h3>
                  <p className="text-[#6b7280] text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {action.description}
                  </p>
                  <Link to={action.articleId ? `/actualites/${action.articleId}` : `/actualites`} className="inline-flex items-center gap-2 text-sm font-bold text-[#007cba] hover:text-[#005a87] transition-colors mt-auto">
                    Voir l'article <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          {actions.length === 0 && (
             <div className="py-20 text-center text-[#6b7280]">
                Aucune action enregistrée pour le moment.
             </div>
          )}
        </div>
      </section>

      {/* Chronogram Section */}
      <section id="actions" className="py-24 bg-[#f8fafc] text-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-sans font-bold mb-6 tracking-tight">Chronogramme des <span className="text-[#007cba]">Luttes</span></h2>
            <p className="text-[#6b7280] max-w-2xl mx-auto text-lg font-light">Sur le terrain, face à l'adversité, la CSTB ne recule jamais pour défendre les droits fondamentaux.</p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-[#cbd5e1]"></div>
            
            <div className="space-y-16">
              {[...actions].reverse().map((action, index) => (
                <motion.div 
                  key={action.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col md:flex-row items-center justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className="w-full md:w-5/12 mb-8 md:mb-0">
                    <div className={`p-8 bg-white border border-[#e2e8f0] hover:border-[#007cba]/50 transition-colors shadow-custom-4 rounded-[8px] ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                      <span className="text-[#007cba] font-bold text-sm mb-3 block tracking-wider uppercase">{action.date}</span>
                      <h3 className="text-2xl font-sans font-bold mb-4">{action.title}</h3>
                      <p className="text-[#6b7280] font-light leading-relaxed">{action.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#007cba] ring-4 ring-[#f8fafc] rounded-full z-10"></div>
                  <div className="w-full md:w-5/12">
                    <div className="relative h-64 md:h-full min-h-[250px] w-full overflow-hidden shadow-custom-2 rounded-[8px]">
                      <img 
                        src={getMediaUrl(action.image)} 
                        alt={action.title} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                        referrerPolicy="no-referrer"
                        onError={(e: any) => { e.target.src = PLACEHOLDER_IMAGE; }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
