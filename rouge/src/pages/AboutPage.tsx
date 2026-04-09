import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, BookOpen, Megaphone, Handshake, Heart, Network, ArrowRight, ExternalLink } from 'lucide-react';

export const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const functions = [
    {
      title: "Fonction représentative",
      desc: "Cette fonction se manifeste par la participation syndicale aux diverses instances de concertation, de négociation et aux travaux des commissions techniques et paritaires.",
      icon: <Handshake size={32} />
    },
    {
      title: "Fonction normative",
      desc: "Par cette fonction le syndicat est impliqué à l'élaboration des textes et normes régissant un secteur d'activité donné.",
      icon: <BookOpen size={32} />
    },
    {
      title: "Fonction revendicative",
      desc: "C'est la fonction par laquelle le syndicat revendique pour ses militants, des meilleures conditions de vie et de travail.",
      icon: <Megaphone size={32} />
    },
    {
      title: "Fonction éducative",
      desc: "C'est la fonction par laquelle le syndicat forme ses militants au respect des textes et normes régissant le secteur d'activité dans lequel ils exercent. Cette fonction aguerrit les syndiqués aux techniques de négociation et les sensibilise sur leurs droits et devoirs.",
      icon: <Shield size={32} />
    },
    {
      title: "Fonction sociale",
      desc: "Par cette fonction le syndicat œuvre dans le social par la mise en place de mutuelles en vue d'assister les militants en cas de survenue d'événements heureux ou malheureux. C'est une fonction qui renforce la solidarité entre les militants d'un syndicat.",
      icon: <Heart size={32} />
    }
  ];

  const organs = [
    "Le Congrès",
    "Le Bureau Directeur National (BDN)",
    "Le Comité Confédéral National (CCN)",
    "Le Secrétariat Permanent (SP)",
    "L'Union Syndicale de Département (USD)",
    "L'Union Syndicale Communale (USC)",
    "L'Union des syndicats d'arrondissement (USA)",
    "Le Comité National des Femmes de la CSTB (CONAF/CSTB)"
  ];

  const team = [
    {
      name: "Nagnini M. KASSA MAMPO",
      role: "Secrétaire Général Confédéral (SGC)",
      image: "https://cstbbenin.org/wp-content/uploads/2023/09/WhatsApp-Image-2023-10-04-at-10.20.04.jpeg"
    },
    {
      name: "Kouami KOUTO NORBERT",
      role: "Sécrétaire Général Confédéral Adjoint (SGCA)",
      image: "https://cstbbenin.org/wp-content/uploads/2023/09/WhatsApp-Image-2023-10-04-at-10.44.58.jpeg"
    },
    {
      name: "Frédéric PRODJINOTHO",
      role: "Secrétaire Administratif (SA)",
      image: "https://cstbbenin.org/wp-content/uploads/2023/09/WhatsApp-Image-2023-10-04-at-10.20.05.jpeg"
    },
    {
      name: "Joseph AïMASSE",
      role: "Sécretaire aux Relations Extérieux (SRE)",
      image: "https://cstbbenin.org/wp-content/uploads/2023/09/WhatsApp-Image-2023-10-04-at-10.20.08.jpeg"
    },
    {
      name: "Asséréou Brice AGOSSOU",
      role: "Trésorier Général",
      image: "https://cstbbenin.org/wp-content/uploads/2023/09/WhatsApp-Image-2023-10-20-at-23.28.30.jpeg"
    },
    {
      name: "Yéropa SEGNANKA",
      role: "Chargée de la Presse et de la Propagande (SPP)",
      image: "https://cstbbenin.org/wp-content/uploads/2023/09/WhatsApp-Image-2023-10-04-at-10.44.36.jpeg"
    },
    {
      name: "Aymar Mahougnon ANATO",
      role: "Sécrétaire Chargé du Suivi du Secteur Privé (SSSP)",
      image: "https://cstbbenin.org/wp-content/uploads/2023/09/WhatsApp-Image-2023-10-04-at-10.20.11.jpeg"
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans pt-24">
      {/* Header */}
      <div className="bg-[#111111] text-white py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay grayscale"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-red-600 font-bold tracking-widest uppercase mb-4">Qui sommes-nous ?</h3>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-black mb-6 leading-tight">
              Histoire de la <span className="text-[#FFC107]">CSTB</span>
            </h1>
            <p className="text-xl font-light max-w-3xl text-gray-300 leading-relaxed">
              Un rempart contre l'impérialisme, un phare de liberté dans un monde d'exploitation. Découvrez notre parcours, notre vision et notre équipe.
            </p>
          </motion.div>
        </div>
      </div>

      {/* History Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 text-gray-600 text-lg font-light leading-relaxed"
            >
              <p>
                Dans l'effervescence des années 80 au Dahomey, en <strong className="text-gray-900 font-bold">avril 1982</strong>, la Confédération Syndicale des Travailleurs du Bénin (CSTB) vit le jour sous l'égide du Parti Communiste du Dahomey (PCD). En pleine période d'opportunisme, la CSTB se forgea en rempart contre l'impérialisme. Elle refusa les compromis et les alliances opportunistes qui menaçaient le mouvement ouvrier.
              </p>
              <p>
                Au fil des décennies, la CSTB se tint aux côtés des mouvements révolutionnaires, luttant non seulement pour améliorer les conditions de vie des travailleurs, mais aussi pour renverser l'ordre établi, pour abolir l'esclavage salarié. En <strong className="text-gray-900 font-bold">2000</strong>, la CSTB devint une confédération, marquant ainsi son statut d'acteur central dans la lutte contre l'impérialisme et le colonialisme.
              </p>
              <p>
                Cette histoire courte mais intense raconte la résilience de la CSTB, son rôle en tant que phare de la liberté dans un monde d'exploitation. Chaque année, chaque grève fut un pas vers la libération, un témoignage de la détermination des travailleurs du Bénin à défendre leur dignité et leurs droits. Aujourd'hui, la CSTB reste un symbole de courage, d'unité et d'espoir pour tous les travailleurs du pays.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <img 
                src="https://cstbbenin.org/wp-content/uploads/2023/08/Frame-1000003679.svg" 
                alt="Illustration CSTB" 
                className="w-full max-w-md drop-shadow-xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ligne Directrice Section */}
      <section className="py-24 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1 flex justify-center"
            >
              <img 
                src="https://cstbbenin.org/wp-content/uploads/2023/08/Frame-1000003680.svg" 
                alt="Illustration Ligne Directrice" 
                className="w-full max-w-md drop-shadow-xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-gray-900">Notre Ligne Directrice</h2>
              <div className="space-y-6 text-gray-800 text-lg font-medium leading-relaxed border-l-4 border-red-600 pl-6 py-2">
                <p>
                  Depuis sa création en avril 1982, à l'initiative du Parti Communiste du Dahomey (PCD), la CSTB, précédemment Centrale et devenue Confédération à l'issue du 3ème congrès ordinaire d'octobre 2000, s'attache à défendre avec esprit de suite la ligne anti-impérialiste révolutionnaire contre les positions opportunistes et réformistes développées par des responsables d'autres organisations syndicales à travers le syndicalisme de participation, de collaboration ou dit de développement.
                </p>
                <p>
                  Ainsi, la ligne de la CSTB, c'est une ligne de conduite générale qui, tout en œuvrant ardemment à l'amélioration constante des conditions de vie et de travail de la classe ouvrière c'est-à-dire à une meilleure vente de la force de travail dans un Etat néocolonial, œuvre aux côtés des partis et des autres organisations démocratiques révolutionnaires pour son renversement en vue de la suppression à terme de l'esclavage salarié.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Functions Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-900">Nos Fonctions</h2>
            <p className="text-gray-600 text-xl font-light max-w-2xl mx-auto">Les piliers de notre action syndicale au quotidien.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {functions.map((func, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 p-8 border border-gray-100 hover:border-red-600/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-white text-red-600 flex items-center justify-center mb-6 rounded-sm shadow-sm group-hover:bg-red-600 group-hover:text-white transition-colors">
                  {func.icon}
                </div>
                <h3 className="text-2xl font-display font-bold mb-4 text-gray-900">{func.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed">{func.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Organization Section */}
      <section className="py-24 bg-[#111111] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Organisation</h2>
              <p className="text-gray-400 text-lg font-light mb-10">
                La structure de la CSTB est conçue pour assurer une représentation démocratique et efficace à tous les niveaux. Les différents organes sont :
              </p>
              <ul className="space-y-4">
                {organs.map((organ, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 bg-white/5 p-4 rounded-sm border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <Network className="text-red-500 shrink-0" size={24} />
                    <span className="font-medium text-lg">{organ}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-red-600 p-12 rounded-sm relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-3xl font-display font-bold mb-6 relative z-10">Fédérations Affiliées</h3>
              <p className="text-red-100 text-lg mb-8 relative z-10">
                La force de la CSTB réside dans la multitude de ses fédérations et syndicats de base répartis sur tout le territoire national.
              </p>
              <a 
                href="https://docs.google.com/document/d/1Q73U57A90vPg1dLSoMQQoWbeR2RMTxGg_ACkIsxy9Zc/edit?usp=drive_link" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-8 py-4 rounded-sm hover:bg-gray-100 transition-colors relative z-10"
              >
                Consulter la liste complète <ExternalLink size={20} />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-900">Le Bureau Directeur</h2>
            <p className="text-gray-600 text-xl font-light max-w-2xl mx-auto">Les femmes et les hommes qui dirigent notre confédération.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden relative bg-gray-100">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-display font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-red-600 text-sm font-bold uppercase tracking-wider">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
