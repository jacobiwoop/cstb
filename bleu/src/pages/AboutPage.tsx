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
      <div className="bg-[#0f172a] text-white py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay grayscale"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-[#007cba] font-bold tracking-widest uppercase mb-4">Qui sommes-nous ?</h3>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-sans font-black mb-6 leading-tight">
              Histoire de la <span className="text-[#0891b2]">CSTB</span>
            </h1>
            <p className="text-xl font-light max-w-3xl text-[#cbd5e1] leading-relaxed">
              Un rempart contre l'impérialisme, un phare de liberté dans un monde d'exploitation. Découvrez notre parcours, notre vision et notre équipe.
            </p>
          </motion.div>
        </div>
      </div>

      {/* History Section */}
      <section id="histoire" className="py-24 bg-white text-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl font-sans font-bold mb-8 tracking-tight">Notre Histoire, <br/><span className="text-[#007cba]">Notre Combat</span></h2>
              <div className="space-y-6 text-[#6b7280] text-lg font-light leading-relaxed">
                <p>
                  Créée en <strong className="text-[#0f172a] font-bold">avril 1982</strong> sous l'égide du Parti Communiste du Dahomey (PCD), la CSTB s'est forgée en rempart contre l'impérialisme en pleine période d'opportunisme.
                </p>
                <p>
                  Nous avons toujours refusé les compromis et les alliances opportunistes qui menaçaient le mouvement ouvrier. En <strong className="text-[#0f172a] font-bold">octobre 2000</strong>, à l'issue de notre 3ème congrès ordinaire, nous sommes devenus une Confédération, marquant notre statut d'acteur central dans la lutte.
                </p>
                <div className="p-8 bg-[#f8fafc] border-l-4 border-[#007cba] mt-10 shadow-custom-4">
                  <p className="italic text-[#1e293b] text-xl font-sans">
                    "La ligne de la CSTB, c'est une ligne de conduite générale qui œuvre ardemment à l'amélioration constante des conditions de vie et de travail de la classe ouvrière."
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-none overflow-hidden relative shadow-xl">
                <img 
                  src="https://storage.googleapis.com/aistudio-ext-files/0/file_d620573e16444da9.jpeg" 
                  alt="Histoire syndicale" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[#005a87]/10 mix-blend-multiply"></div>
              </div>
              <div className="absolute -bottom-6 -left-4 md:-bottom-10 md:-left-10 bg-[#007cba] p-6 md:p-10 shadow-custom-3">
                <p className="text-4xl md:text-6xl font-sans font-black text-white">40+</p>
                <p className="text-[#ecfeff] font-medium mt-2 text-sm md:text-lg">Années de lutte<br/>syndicale</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ligne Directrice Section */}
      <section className="py-24 bg-[#f8fafc] border-y border-[#e2e8f0]">
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
              <h2 className="text-3xl md:text-4xl font-sans font-bold mb-8 text-[#0f172a]">Notre Ligne Directrice</h2>
              <div className="space-y-6 text-[#1e293b] text-lg font-medium leading-relaxed border-l-4 border-[#007cba] pl-6 py-2">
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
            <h2 className="text-4xl md:text-5xl font-sans font-bold mb-4 text-[#0f172a]">Nos Fonctions</h2>
            <p className="text-[#6b7280] text-xl font-light max-w-2xl mx-auto">Les piliers de notre action syndicale au quotidien.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {functions.map((func, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#f8fafc] p-8 border border-[#f1f5f9] hover:border-[#007cba]/30 hover:shadow-custom-1 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-white text-[#007cba] flex items-center justify-center mb-6 rounded-[6px] shadow-custom-4 group-hover:bg-[#007cba] group-hover:text-white transition-colors">
                  {func.icon}
                </div>
                <h3 className="text-2xl font-sans font-bold mb-4 text-[#0f172a]">{func.title}</h3>
                <p className="text-[#6b7280] font-light leading-relaxed">{func.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Organization Section */}
      <section id="organisation" className="py-24 bg-[#f8fafc] text-[#0f172a] border-y border-[#e2e8f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-4xl md:text-5xl font-sans font-bold mb-10 tracking-tight">Direction & <span className="text-[#007cba]">Structure</span></h2>
              <div className="bg-white p-10 border border-[#e2e8f0] mb-10 relative overflow-hidden group shadow-custom-4">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#007cba]"></div>
                <h3 className="text-3xl font-sans font-bold mb-2">Nagnini KASSA MAMPO</h3>
                <p className="text-[#007cba] font-medium mb-6 tracking-wide uppercase text-sm">Secrétaire Général Confédéral</p>
                <p className="text-[#6b7280] font-light leading-relaxed">
                  Figure emblématique de la CSTB, reconduit à la tête du Comité Confédéral National (CCN) pour 5 ans lors du 6ème congrès ordinaire du 25 août 2023. Son adjoint est Kouto Norbert.
                </p>
              </div>
              <p className="text-[#334155] text-xl font-light leading-relaxed">
                La CSTB est reconnue comme la <strong className="text-[#0f172a] font-bold">première organisation de représentation des travailleurs</strong> à la 3ème édition des élections professionnelles nationales.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-sans font-bold mb-8">Syndicats Affiliés Majeurs</h3>
              <div className="space-y-4">
                {[
                  { abbr: "SYNTRACMEE", full: "Syndicat National des Travailleurs de l'Administration Centrale des Mines, de l'Énergie et de l'Eau" },
                  { abbr: "SYNAHAB", full: "Syndicat National des Assistants d'Hygiène et d'Assainissement du Bénin" },
                  { abbr: "FéSEN/CSTB", full: "Fédération des syndicats de l'éducation nationale" },
                  { abbr: "FESYNTRA-FINANCES", full: "Fédération des Syndicats des Travailleurs des Finances" }
                ].map((syndicat, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors flex flex-col sm:flex-row gap-6 items-start sm:items-center shadow-custom-4"
                  >
                    <span className="px-4 py-2 bg-[#ecfeff] text-[#0891b2] text-sm font-bold tracking-wider rounded-[6px]">
                      {syndicat.abbr}
                    </span>
                    <span className="text-[#334155] text-sm leading-relaxed">{syndicat.full}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-sans font-bold mb-4 text-[#0f172a]">Le Bureau Directeur</h2>
            <p className="text-[#6b7280] text-xl font-light max-w-2xl mx-auto">Les femmes et les hommes qui dirigent notre confédération.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-[#e2e8f0] overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-square overflow-hidden relative bg-[#f1f5f9]">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-lg font-sans font-bold text-[#0f172a] mb-1">{member.name}</h3>
                  <p className="text-[#007cba] text-sm font-bold uppercase tracking-wider">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
