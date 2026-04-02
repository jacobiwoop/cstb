import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Users, BookOpen, Handshake, Megaphone, ChevronRight, ChevronLeft, Mail, Phone, MapPin, ArrowRight, ArrowDown, Globe, Zap, Building, Landmark, Heart, Search, ChevronDown, Menu, X } from 'lucide-react';
import { Vote } from './pages/Vote';
import { NewsPage } from './pages/NewsPage';
import { AboutPage } from './pages/AboutPage';
import { ArticlePage } from './pages/ArticlePage';

const NavItem = ({ href, children, isHome }: { href: string, children: React.ReactNode, isHome: boolean }) => {
  const location = useLocation();
  const isHash = href.startsWith('#');
  const to = isHash && !isHome ? `/${href}` : href;
  
  let isActive = false;
  if (!isHash) {
    isActive = location.pathname === href;
  }

  const baseClasses = `relative py-6 transition-colors hover:text-red-600 group flex items-center gap-1 ${isActive ? 'text-red-600' : ''}`;
  const underlineClasses = `absolute bottom-0 left-0 w-full h-0.5 bg-red-600 transition-transform origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`;

  if (isHash && isHome) {
    return (
      <a href={href} className={baseClasses}>
        {children}
        <span className={underlineClasses}></span>
      </a>
    );
  }

  return (
    <Link to={to} className={baseClasses}>
      {children}
      <span className={underlineClasses}></span>
    </Link>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const updateScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', updateScroll);
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed w-full z-50 transition-all duration-300 flex flex-col">
      {/* Top Bar */}
      <div className={`bg-[#E53935] text-white transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center text-xs font-medium">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-2"><Phone size={14} /> <span className="hidden sm:inline">+229 95 22 48 34</span><span className="sm:hidden">Appeler</span></span>
            <span className="hidden md:flex items-center gap-2"><Mail size={14} /> cstbsn@yahoo.fr</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 cursor-pointer hover:text-red-200 transition-colors"><Globe size={14} /> <span className="hidden sm:inline">Français</span> <ChevronDown size={14}/></span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className={`bg-white transition-all duration-300 ${isScrolled ? 'shadow-md' : 'border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 py-3">
            <div className="w-10 h-10 bg-red-600 rounded-sm flex items-center justify-center font-display font-bold text-xl text-white">
              C
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-gray-900 hidden sm:block">
              CSTB <span className="text-red-600">Bénin</span>
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-bold text-gray-600 uppercase tracking-wide h-full">
            <NavItem href="/" isHome={isHome}>ACCUEIL</NavItem>
            <NavItem href="/qui-sommes-nous" isHome={isHome}>QUI SOMMES-NOUS</NavItem>
            <NavItem href="/actualites" isHome={isHome}>ACTUALITÉS</NavItem>
            <button className="text-gray-900 hover:text-red-600 transition-colors ml-2">
              <Search size={18} />
            </button>
            <Link to="/vote" className="bg-red-600 text-white px-5 py-2.5 rounded-sm font-bold hover:bg-red-700 transition-colors flex items-center gap-2 ml-4 shadow-sm">
              <Heart size={16} /> FAIRE UN DON
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button className="text-gray-900 hover:text-red-600 transition-colors">
              <Search size={20} />
            </button>
            <button 
              className="text-gray-900 hover:text-red-600 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
              <Link to="/" className="block px-3 py-4 text-base font-bold text-gray-900 border-b border-gray-50 uppercase tracking-wide">ACCUEIL</Link>
              <Link to="/qui-sommes-nous" className="block px-3 py-4 text-base font-bold text-gray-900 border-b border-gray-50 uppercase tracking-wide">QUI SOMMES-NOUS</Link>
              <Link to="/actualites" className="block px-3 py-4 text-base font-bold text-gray-900 border-b border-gray-50 uppercase tracking-wide">ACTUALITÉS</Link>
              <Link to="/vote" className="mt-4 bg-red-600 text-white px-5 py-3 rounded-sm font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 shadow-sm uppercase tracking-wide">
                <Heart size={16} /> FAIRE UN DON
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// ==========================================
// HERO NEW : Typographie Impactante (Le Peuple D'abord)
// ==========================================
const HeroNew = () => (
  <section className="relative min-h-screen flex flex-col bg-[#111111] pt-20 overflow-hidden">
    {/* Background Image */}
    <div className="absolute inset-0 z-0">
      <img 
        src="https://storage.googleapis.com/aistudio-ext-files/0/file_1a734661852a4e40.jpeg" 
        alt="Le peuple" 
        className="w-full h-full object-cover opacity-40"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#111111]/90 via-[#111111]/60 to-[#111111]"></div>
    </div>

    {/* Top Bar */}
    <div className="w-full border-b border-zinc-800/80 py-3 px-4 sm:px-8 flex items-center overflow-x-auto relative z-10" style={{ scrollbarWidth: 'none' }}>
      <div className="flex gap-8 items-center whitespace-nowrap text-xs font-mono text-zinc-500 tracking-wider">
        <span className="flex items-center gap-2"><Mail size={14} className="text-zinc-600"/> cstbsn@yahoo.fr</span>
        <span className="flex items-center gap-2"><Phone size={14} className="text-zinc-600"/> +229 95 22 48 34</span>
        <span className="flex items-center gap-2"><Globe size={14} className="text-blue-500"/> Affiliée à la CSI</span>
        <span className="flex items-center gap-2"><Zap size={14} className="text-yellow-500"/> Anti-impérialiste depuis 1982</span>
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-16 relative z-10">
      <h1 className="font-display leading-[0.85] tracking-normal flex flex-col uppercase">
        <motion.span initial={{ opacity: 0, y: "100vh" }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0, ease: [0.22, 1, 0.36, 1] }} className="text-white text-[18vw] md:text-[12vw] lg:text-[10vw]">LE</motion.span>
        <motion.span initial={{ opacity: 0, y: "100vh" }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.15, ease: [0.22, 1, 0.36, 1] }} className="text-[#FFC107] text-[26vw] md:text-[18vw] lg:text-[15vw] leading-[0.8]">PEUPLE</motion.span>
        <motion.span initial={{ opacity: 0, y: "100vh" }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }} className="text-white text-[18vw] md:text-[12vw] lg:text-[10vw]">D'ABORD</motion.span>
      </h1>
    </div>

    {/* Bottom Bar */}
    <motion.div 
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full border-t border-zinc-800/80 p-4 sm:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10 bg-[#111111]/80 backdrop-blur-sm"
    >
      <div className="flex flex-wrap gap-3">
        {['CONCERTATION', 'NÉGOCIATION', 'REVENDICATION', 'FORMATION', 'SOLIDARITÉ'].map((m, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.0 + (i * 0.1), ease: "easeOut" }}
            key={m} 
            className="border border-zinc-700 px-4 py-2 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase hover:text-white hover:border-zinc-500 transition-colors cursor-default"
          >
            {m}
          </motion.div>
        ))}
      </div>
      <motion.a 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.5 }}
        whileHover={{ scale: 1.05 }}
        href="#missions" 
        className="bg-[#FFC107] text-black font-bold px-8 py-4 text-sm uppercase tracking-widest hover:bg-yellow-400 transition-colors shrink-0 w-full md:w-auto text-center"
      >
        Nos 5 Missions
      </motion.a>
    </motion.div>
  </section>
);

// ==========================================
// RESTE DU SITE (Histoire, Missions, etc.)
// ==========================================

const History = () => (
  <section id="histoire" className="py-32 bg-gray-50 text-gray-900">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 tracking-tight">Notre Histoire, <br/><span className="text-red-600">Notre Combat</span></h2>
          <div className="space-y-6 text-gray-600 text-lg font-light leading-relaxed">
            <p>
              Créée en <strong className="text-gray-900 font-bold">avril 1982</strong> sous l'égide du Parti Communiste du Dahomey (PCD), la CSTB s'est forgée en rempart contre l'impérialisme en pleine période d'opportunisme.
            </p>
            <p>
              Nous avons toujours refusé les compromis et les alliances opportunistes qui menaçaient le mouvement ouvrier. En <strong className="text-gray-900 font-bold">octobre 2000</strong>, à l'issue de notre 3ème congrès ordinaire, nous sommes devenus une Confédération, marquant notre statut d'acteur central dans la lutte.
            </p>
            <div className="p-8 bg-white border-l-4 border-red-600 mt-10 shadow-sm">
              <p className="italic text-gray-800 text-xl font-display">
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
            <div className="absolute inset-0 bg-red-900/10 mix-blend-multiply"></div>
          </div>
          <div className="absolute -bottom-6 -left-4 md:-bottom-10 md:-left-10 bg-red-600 p-6 md:p-10 shadow-2xl">
            <p className="text-4xl md:text-6xl font-display font-black text-white">40+</p>
            <p className="text-red-100 font-medium mt-2 text-sm md:text-lg">Années de lutte<br/>syndicale</p>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const Missions = () => {
  const missions = [
    { 
      title: "Défense & Revendication", 
      desc: "Lutte acharnée pour de meilleures conditions de vie et implication dans l'élaboration des textes.",
      image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80",
      overlay: "bg-yellow-600/80",
      buttonText: "Découvrir"
    },
    { 
      title: "Éducation & Formation", 
      desc: "Éducation des militants au respect des textes, techniques de négociation, droits et devoirs.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80",
      overlay: "bg-black/60",
      buttonText: "S'informer"
    },
    { 
      title: "Action Sociale", 
      desc: "Mise en place de mutuelles et renforcement de la solidarité entre les travailleurs.",
      image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80",
      overlay: "bg-green-600/80",
      buttonText: "S'engager"
    },
  ];

  return (
    <section id="missions" className="w-full bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3 w-full">
        {missions.map((mission, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative h-[400px] md:h-[500px] w-full group overflow-hidden"
          >
            {/* Background Image */}
            <img 
              src={mission.image} 
              alt={mission.title} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            
            {/* Color Overlay */}
            <div className={`absolute inset-0 ${mission.overlay} transition-opacity duration-300`}></div>
            
            {/* Content */}
            <div className="absolute inset-0 p-10 md:p-12 flex flex-col justify-center text-white z-10">
              <h3 className="text-3xl md:text-4xl font-display font-bold mb-4 leading-tight">
                {mission.title}
              </h3>
              <p className="text-white/90 text-lg font-light leading-relaxed mb-8 max-w-sm">
                {mission.desc}
              </p>
              <div className="mt-auto md:mt-0">
                <Link to="/qui-sommes-nous" className="inline-block bg-white text-gray-900 font-bold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg text-sm uppercase tracking-wider">
                  {mission.buttonText}
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const Organization = () => (
  <section id="organisation" className="py-32 bg-gray-50 text-gray-900 border-y border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-10 tracking-tight">Direction & <span className="text-red-600">Structure</span></h2>
          <div className="bg-white p-10 border border-gray-200 mb-10 relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
            <h3 className="text-3xl font-display font-bold mb-2">Nagnini KASSA MAMPO</h3>
            <p className="text-red-600 font-medium mb-6 tracking-wide uppercase text-sm">Secrétaire Général Confédéral</p>
            <p className="text-gray-600 font-light leading-relaxed">
              Figure emblématique de la CSTB, reconduit à la tête du Comité Confédéral National (CCN) pour 5 ans lors du 6ème congrès ordinaire du 25 août 2023. Son adjoint est Kouto Norbert.
            </p>
          </div>
          <p className="text-gray-700 text-xl font-light leading-relaxed">
            La CSTB est reconnue comme la <strong className="text-gray-900 font-bold">première organisation de représentation des travailleurs</strong> à la 3ème édition des élections professionnelles nationales.
          </p>
        </div>
        
        <div>
          <h3 className="text-2xl font-display font-bold mb-8">Syndicats Affiliés Majeurs</h3>
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
                className="p-6 bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row gap-6 items-start sm:items-center shadow-sm"
              >
                <span className="px-4 py-2 bg-red-50 text-red-700 text-sm font-bold tracking-wider rounded-sm">
                  {syndicat.abbr}
                </span>
                <span className="text-gray-700 text-sm leading-relaxed">{syndicat.full}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Actions = () => {
  const actions = [
    {
      date: "Mai 2025",
      title: "Répression du 1er Mai",
      desc: "Arrestation arbitraire des dirigeants (Nagnini Kassa Mampo, Kouto Norbert) lors d'une assemblée pacifique. Une violation flagrante des droits syndicaux.",
      image: "https://picsum.photos/seed/repression/800/600"
    },
    {
      date: "Janvier 2025",
      title: "Manifestation Anti-Impérialiste",
      desc: "Organisation d'une grande manifestation le 25 janvier pour exiger le retrait des troupes françaises du territoire béninois.",
      image: "https://picsum.photos/seed/manifestation/800/600"
    },
    {
      date: "Juin 2023",
      title: "Conflit de la Cité Ministérielle",
      desc: "Arrêt collectif de travail suite à une retenue abusive de 10% sur les salaires des ouvriers du chantier.",
      image: "https://picsum.photos/seed/conflit/800/600"
    },
    {
      date: "Continu",
      title: "Opposition Démocratique",
      desc: "Condamnation ferme du rétrécissement de l'espace démocratique et de la répression policière sous l'administration actuelle.",
      image: "https://picsum.photos/seed/democratie/800/600"
    }
  ];

  return (
    <section id="actions" className="py-32 bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6 tracking-tight">Luttes & <span className="text-red-600">Actions Récentes</span></h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-xl font-light">Sur le terrain, face à l'adversité, la CSTB ne recule jamais pour défendre les droits fondamentaux.</p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gray-200"></div>
          
          <div className="space-y-16">
            {actions.map((action, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col md:flex-row items-center justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className="w-full md:w-5/12 mb-8 md:mb-0">
                  <div className={`p-8 bg-gray-50 border border-gray-200 hover:border-red-600/50 transition-colors shadow-sm ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <span className="text-red-600 font-bold text-sm mb-3 block tracking-wider uppercase">{action.date}</span>
                    <h3 className="text-2xl font-display font-bold mb-4">{action.title}</h3>
                    <p className="text-gray-600 font-light leading-relaxed">{action.desc}</p>
                  </div>
                </div>
                <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-red-600 ring-4 ring-white rounded-full z-10"></div>
                <div className="w-full md:w-5/12">
                  <div className="relative h-64 md:h-full min-h-[250px] w-full overflow-hidden shadow-md">
                    <img 
                      src={action.image} 
                      alt={action.title} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Partners = () => {
  const partners = [
    { name: "CSI Afrique", icon: <Globe size={28} /> },
    { name: "OIT Bénin", icon: <Landmark size={28} /> },
    { name: "FSM", icon: <Shield size={28} /> },
    { name: "OUSA", icon: <Building size={28} /> },
    { name: "Solidarité Ouvrière", icon: <Handshake size={28} /> },
    { name: "Amnesty International", icon: <Users size={28} /> },
  ];

  // On duplique le tableau plusieurs fois pour créer un effet de boucle infinie fluide
  const duplicatedPartners = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className="py-16 bg-gray-50 border-y border-gray-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <h3 className="text-sm font-bold tracking-widest text-gray-400 uppercase">Nos Partenaires & Affiliations</h3>
      </div>
      
      {/* Conteneur du carrousel avec masque de fondu sur les bords */}
      <div className="relative w-full flex overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
        
        {/* Piste d'animation */}
        <div className="flex w-max animate-marquee items-center">
          {duplicatedPartners.map((partner, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 px-12 py-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
            >
              <div className="text-red-600">{partner.icon}</div>
              <span className="text-2xl font-display font-bold text-gray-800 whitespace-nowrap">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer id="contact" className="bg-gray-100 text-gray-900 py-16 border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-600 flex items-center justify-center font-display font-bold text-xl text-white">
              C
            </div>
            <span className="font-display font-bold text-2xl tracking-tight">CSTB Bénin</span>
          </div>
          <p className="text-gray-600 font-light leading-relaxed mb-6">
            Confédération Syndicale des Travailleurs du Bénin. Affiliée à la Confédération syndicale internationale (CSI).
          </p>
        </div>
        
        <div>
          <h4 className="text-xl font-display font-bold mb-8">Nous Contacter</h4>
          <ul className="space-y-6 text-gray-600 font-light">
            <li className="flex items-start gap-4">
              <MapPin size={20} className="text-red-600 shrink-0 mt-1" />
              <span>Bourse du Travail<br/>Cotonou, Bénin</span>
            </li>
            <li className="flex items-center gap-4">
              <Phone size={20} className="text-red-600 shrink-0" />
              <span>+229 95 22 48 34</span>
            </li>
            <li className="flex items-center gap-4">
              <Mail size={20} className="text-red-600 shrink-0" />
              <a href="mailto:cstbsn@yahoo.fr" className="hover:text-gray-900 transition-colors">cstbsn@yahoo.fr</a>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-xl font-display font-bold mb-8">Ressources</h4>
          <ul className="space-y-4 text-gray-600 font-light">
            <li><a href="https://cstbbenin.org" target="_blank" rel="noreferrer" className="hover:text-red-600 transition-colors flex items-center gap-2"><ChevronRight size={16}/> Site Web Officiel</a></li>
            <li className="flex items-center gap-2"><ChevronRight size={16}/> Plateforme éducative (Soutien Backup/UNESCO)</li>
            <li className="flex items-center gap-2"><ChevronRight size={16}/> Forum WhatsApp Enseignants</li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-200 mt-16 pt-8 text-center text-gray-500 text-sm font-light">
        <p>&copy; {new Date().getFullYear()} CSTB Bénin. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
);

const News = () => {
  const newsItems = [
    {
      date: "2 Avril 2026",
      category: "Communiqué",
      title: "Appel à la mobilisation générale pour les droits des travailleurs",
      excerpt: "La CSTB appelle tous les travailleurs à se mobiliser pour défendre les acquis sociaux face aux nouvelles mesures gouvernementales.",
      image: "https://storage.googleapis.com/aistudio-ext-files/0/file_62b17d5985864117.jpeg"
    },
    {
      date: "15 Mars 2026",
      category: "Éducation",
      title: "Succès de la plateforme éducative soutenue par l'UNESCO",
      excerpt: "Plus de 5000 enseignants ont déjà rejoint notre nouvelle plateforme de formation continue, renforçant ainsi la qualité de l'enseignement.",
      image: "https://storage.googleapis.com/aistudio-ext-files/0/file_d620573e16444da9.jpeg"
    },
    {
      date: "28 Février 2026",
      category: "Négociation",
      title: "Avancées significatives sur la convention collective",
      excerpt: "Après plusieurs semaines de négociations intenses, des accords de principe ont été trouvés concernant la revalorisation salariale.",
      image: "https://storage.googleapis.com/aistudio-ext-files/0/file_1a734661852a4e40.jpeg"
    }
  ];

  return (
    <section id="actualites" className="py-32 bg-white text-gray-900 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">Dernières <span className="text-red-600">Actualités</span></h2>
            <p className="text-gray-600 text-xl font-light max-w-2xl">Restez informés des dernières luttes, victoires et communications de la CSTB.</p>
          </div>
          <Link to="/actualites" className="inline-flex items-center gap-2 font-bold text-red-600 hover:text-red-800 transition-colors group">
            Toutes les actualités <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col bg-gray-50 border border-gray-200 hover:border-red-600/30 hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                  {item.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-gray-500 text-sm font-mono mb-3">{item.date}</span>
                <h3 className="text-xl font-display font-bold mb-3 group-hover:text-red-600 transition-colors line-clamp-2">{item.title}</h3>
                <p className="text-gray-600 font-light text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{item.excerpt}</p>
                <Link to={`/actualites/${index + 1}`} className="inline-flex items-center gap-2 text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors mt-auto">
                  Lire la suite <ChevronRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home = () => (
  <>
    <HeroNew />
    <News />
    <History />
    <Missions />
    <Organization />
    <Actions />
    <Partners />
  </>
);

export default function App() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-red-100 selection:text-red-900">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/actualites" element={<NewsPage />} />
        <Route path="/actualites/:id" element={<ArticlePage />} />
        <Route path="/qui-sommes-nous" element={<AboutPage />} />
      </Routes>
      <Footer />
    </div>
  );
}
