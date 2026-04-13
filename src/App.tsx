import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Users, BookOpen, Handshake, Megaphone, ChevronRight, ChevronLeft, Mail, Phone, MapPin, ArrowRight, ArrowDown, Globe, Zap, Building, Landmark, Heart, Search, ChevronDown, Menu, X, Lock } from 'lucide-react';
import { Vote } from './pages/Vote';
import { NewsPage } from './pages/NewsPage';
import { AboutPage } from './pages/AboutPage';
import { ArticlePage } from './pages/ArticlePage';
import ActionsPage from './pages/ActionsPage';
import HeroCarousel from './components/HeroCarousel';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import { AdminEditorPage } from './pages/AdminEditorPage';
import { AdminArticlePreviewPage } from './pages/AdminArticlePreviewPage';
import { AdminMailEditor } from './pages/AdminMailEditor';
import { UnsubscribePage } from './pages/UnsubscribePage';
import Newsletter from './components/Newsletter';
import { WhatsAppButton } from './components/WhatsAppButton';
import mainLogo from './assets/logo/Group-48095879.svg';
import { articleApi, getMediaUrl, PLACEHOLDER_IMAGE } from './utils/api';

import imgCDTN from "./assets/partenaire/CDTN-qe3z0h0gzdfe8lccbg98x6x31oshyuvhrr6ef7kaxo.png";
import imgCGTB from "./assets/partenaire/CGTB-qe3z0h0gzdfe8lccbg98x6x31oshyuvhrr6ef7kaxo.png";
import imgCSA from "./assets/partenaire/CSA-Senegal-qe3z0h0gzdfe8lccbg98x6x31oshyuvhrr6ef7kaxo.png";
import img4 from "./assets/partenaire/image-20.svg";
import img5 from "./assets/partenaire/image-28.svg";
import img6 from "./assets/partenaire/PHOTO-2023-09-05-16-14-12-1.svg";

import articleImg1 from './assets/article/image-10-1.png';
import articleImg2 from './assets/article/image-11-1.png';
import articleImg3 from './assets/article/medium-shot-man-carrying-tool-2-1-768x295.png';

const NavItem = ({ href, children, isHome }: { href: string, children: React.ReactNode, isHome: boolean }) => {
  const location = useLocation();
  const isHash = href.startsWith('#');
  const to = isHash && !isHome ? `/${href}` : href;
  
  let isActive = false;
  if (!isHash) {
    isActive = location.pathname === href;
  }

  const baseClasses = `relative py-6 transition-colors hover:text-[#007cba] group flex items-center gap-1 ${isActive ? 'text-[#007cba]' : ''}`;
  const underlineClasses = `absolute bottom-0 left-0 w-full h-0.5 bg-[#007cba] transition-transform origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`;

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

import { LocalDB } from './utils/localDb';

const defaultSettings = {
  phone: "+229 95 22 48 34",
  email: "cstbsn@yahoo.fr",
  address: "Bourse du Travail, Cotonou, Bénin",
  whatsapp: "22995224834",
  siteName: "CSTB",
  donationGoal: 50000000,
  donationCurrent: 7500000
};

const Navbar = () => {
  const settings = LocalDB.get('site_settings', defaultSettings);
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
      <div className={`bg-[#007cba] text-white transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex justify-between items-center text-xs font-medium">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-2"><Phone size={14} /> <span className="hidden sm:inline">{settings.phone}</span><span className="sm:hidden">Appeler</span></span>
            <span className="hidden md:flex items-center gap-2"><Mail size={14} /> {settings.email}</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 cursor-pointer hover:text-[#ecfeff] transition-colors"><Globe size={14} /> <span className="hidden sm:inline">Français</span> <ChevronDown size={14}/></span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className={`bg-white transition-all duration-300 ${isScrolled ? 'shadow-custom-2' : 'border-b border-[#f1f5f9]'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center py-3">
            <img src={mainLogo} alt="CSTB Bénin Logo" className="h-12 w-auto" />
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8 text-sm font-bold text-[#6b7280] uppercase tracking-wide h-full">
            <NavItem href="/" isHome={isHome}>ACCUEIL</NavItem>
            <NavItem href="/qui-sommes-nous" isHome={isHome}>QUI SOMMES-NOUS</NavItem>
            <NavItem href="/actions" isHome={isHome}>ACTIONS</NavItem>
            <NavItem href="/actualites" isHome={isHome}>ACTUALITÉS</NavItem>
            <NavItem href="/contact" isHome={isHome}>CONTACT</NavItem>
            <button className="text-[#0f172a] hover:text-[#007cba] transition-colors ml-2">
              <Search size={18} />
            </button>
            <Link to="/vote" className="bg-[#007cba] text-white px-5 py-2.5 rounded-[6px] font-bold hover:bg-[#005a87] transition-colors flex items-center gap-2 ml-4 shadow-custom-4">
              <Heart size={16} /> FAIRE UN DON
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button className="text-[#0f172a] hover:text-[#007cba] transition-colors">
              <Search size={20} />
            </button>
            <button 
              className="text-[#0f172a] hover:text-[#007cba] transition-colors"
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
            className="md:hidden bg-white border-b border-[#f1f5f9] overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-base font-bold text-[#0f172a] border-b border-[#f8fafc] uppercase tracking-wide">ACCUEIL</Link>
              <Link to="/qui-sommes-nous" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-base font-bold text-[#0f172a] border-b border-[#f8fafc] uppercase tracking-wide">QUI SOMMES-NOUS</Link>
              <Link to="/actions" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-base font-bold text-[#0f172a] border-b border-[#f8fafc] uppercase tracking-wide">ACTIONS</Link>
              <Link to="/actualites" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-base font-bold text-[#0f172a] border-b border-[#f8fafc] uppercase tracking-wide">ACTUALITÉS</Link>
              <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-4 text-base font-bold text-[#0f172a] border-b border-[#f8fafc] uppercase tracking-wide">CONTACT</Link>
              <Link to="/vote" onClick={() => setIsMobileMenuOpen(false)} className="mt-4 bg-[#007cba] text-white px-5 py-3 rounded-[6px] font-bold hover:bg-[#005a87] transition-colors flex items-center justify-center gap-2 shadow-custom-4 uppercase tracking-wide">
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
// RESTE DU SITE (Histoire, Missions, etc.)
// ==========================================

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
              <h3 className="text-3xl md:text-4xl font-sans font-bold mb-4 leading-tight">
                {mission.title}
              </h3>
              <p className="text-white/90 text-lg font-light leading-relaxed mb-8 max-w-sm">
                {mission.desc}
              </p>
              <div className="mt-auto md:mt-0">
                <Link to="/qui-sommes-nous" className="inline-block bg-white text-[#0f172a] font-bold px-8 py-3 rounded-full hover:bg-[#f1f5f9] transition-colors shadow-custom-1 text-sm uppercase tracking-wider">
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

const Actions = () => {
  return (
    <section id="actions" className="py-32 bg-white text-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-sans font-bold mb-6 tracking-tight">Luttes & <span className="text-[#007cba]">Actions Récentes</span></h2>
          <p className="text-[#6b7280] max-w-2xl mx-auto text-xl font-light mb-10">Sur le terrain, face à l'adversité, la CSTB ne recule jamais pour défendre les droits fondamentaux.</p>
          <Link to="/actions" className="inline-flex items-center gap-2 bg-[#007cba] text-white font-bold px-8 py-4 rounded-[6px] hover:bg-[#005a87] transition-colors shadow-custom-2">
            Voir toutes nos actions <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

const Partners = () => {
  const partners = [
    { name: "CDTN", imageSrc: imgCDTN },
    { name: "CGTB", imageSrc: imgCGTB },
    { name: "CSA Sénégal", imageSrc: imgCSA },
    { name: "", imageSrc: img4 },
    { name: "", imageSrc: img5 },
    { name: "", imageSrc: img6 },
  ];

  // On duplique le tableau plusieurs fois pour créer un effet de boucle infinie fluide
  const duplicatedPartners = [...partners, ...partners, ...partners, ...partners];

  return (
    <section className="py-16 bg-[#f8fafc] border-y border-[#e2e8f0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
        <h3 className="text-sm font-bold tracking-widest text-[#94a3b8] uppercase">Nos Partenaires & Affiliations</h3>
      </div>
      
      {/* Conteneur du carrousel avec masque de fondu sur les bords */}
      <div className="relative w-full flex overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#f8fafc] to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#f8fafc] to-transparent z-10"></div>
        
        {/* Piste d'animation */}
        <div className="flex w-max animate-marquee items-center">
          {duplicatedPartners.map((partner, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 px-12 py-4 transition-all duration-300 cursor-pointer hover:scale-105"
            >
              <img 
                src={partner.imageSrc} 
                alt={partner.name || "Partenaire logo"} 
                className="h-16 w-auto object-contain"
              />
              {partner.name && (
                <span className="text-xl font-sans font-bold text-[#1e293b] whitespace-nowrap">{partner.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const settings = LocalDB.get('site_settings', defaultSettings);
  return (
    <footer id="contact" className="bg-[#f1f5f9] text-[#0f172a] py-16 border-t border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <div>
            <div className="flex items-center mb-8">
              <img src={mainLogo} alt="Logo" className="h-16 w-auto" />
            </div>
            <p className="text-[#6b7280] font-light leading-relaxed mb-6">
              Confédération Syndicale des Travailleurs du Bénin. Affiliée à la Confédération syndicale internationale (CSI).
            </p>
          </div>
          
          <div>
            <h4 className="text-xl font-sans font-bold mb-8">Nous Contacter</h4>
            <ul className="space-y-6 text-[#6b7280] font-light">
              <li className="flex items-start gap-4">
                <MapPin size={20} className="text-[#007cba] shrink-0 mt-1" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={20} className="text-[#007cba] shrink-0" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={20} className="text-[#007cba] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-[#0f172a] transition-colors">{settings.email}</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-sans font-bold mb-8">Ressources</h4>
            <ul className="space-y-4 text-[#6b7280] font-light">
              <li><a href="https://cstbbenin.org" target="_blank" rel="noreferrer" className="hover:text-[#007cba] transition-colors flex items-center gap-2"><ChevronRight size={16}/> Site Web Officiel</a></li>
              <li className="flex items-center gap-2"><ChevronRight size={16}/> Plateforme éducative (Soutien Backup/UNESCO)</li>
              <li className="flex items-center gap-2"><ChevronRight size={16}/> Forum WhatsApp Enseignants</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#e2e8f0] mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-[#6b7280] text-sm font-light">
          <p>&copy; {new Date().getFullYear()} {settings.siteName}. Tous droits réservés.</p>
          <Link to="/cstb-bureau-5Xy8" className="mt-4 md:mt-0 flex items-center gap-2 hover:text-[#007cba] transition-colors font-bold">
            <Lock size={14} /> Espace Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

const News = () => {
  const [newsItems, setNewsItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await articleApi.getAll();
        // On ne garde que les 3 derniers articles pour la page d'accueil
        setNewsItems(data.slice(0, 3));
      } catch (error) {
        console.error("Erreur lors du chargement des actualités :", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (isLoading) {
    return (
      <section id="actualites" className="py-32 bg-white text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <p className="text-gray-400">Chargement des actualités...</p>
        </div>
      </section>
    );
  }

  if (newsItems.length === 0) return null;

  return (
    <section id="actualites" className="py-32 bg-white text-[#0f172a] border-b border-[#e2e8f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-sans font-bold tracking-tight mb-4">Dernières <span className="text-[#007cba]">Actualités</span></h2>
            <p className="text-[#6b7280] text-xl font-light max-w-2xl">Restez informés des dernières luttes, victoires et communications de la CSTB.</p>
          </div>
          <Link to="/actualites" className="inline-flex items-center gap-2 font-bold text-[#007cba] hover:text-[#005a87] transition-colors group">
            Toutes les actualités <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <motion.div 
              key={item.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group flex flex-col bg-[#f8fafc] border border-[#e2e8f0] hover:border-[#007cba]/30 hover:shadow-custom-1 transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={getMediaUrl(item.image)} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e: any) => { e.target.src = PLACEHOLDER_IMAGE; }}
                />
                <div className="absolute top-4 left-4 bg-[#007cba] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
                  {item.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-[#6b7280] text-sm font-mono mb-3">{item.formattedDate || new Date(item.createdAt).toLocaleDateString()}</span>
                <h3 className="text-xl font-sans font-bold mb-3 group-hover:text-[#007cba] transition-colors line-clamp-2">{item.title}</h3>
                <p className="text-[#6b7280] font-light text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{item.excerpt}</p>
                <Link to={`/actualites/${item.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-[#0f172a] group-hover:text-[#007cba] transition-colors mt-auto">
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
    <HeroCarousel />
    <News />
    <Missions />
    <Actions />
    <Partners />
    <Newsletter />
  </>
);

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/cstb-bureau-5Xy8');

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#ecfeff] selection:text-[#0891b2]">
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/actualites" element={<NewsPage />} />
        <Route path="/actualites/:id" element={<ArticlePage />} />
        <Route path="/qui-sommes-nous" element={<AboutPage />} />
        <Route path="/actions" element={<ActionsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/unsubscribe" element={<UnsubscribePage />} />
        {/* Routes Administration Cachées */}
        <Route path="/cstb-bureau-5Xy8" element={<AdminPage />} />
        <Route path="/cstb-bureau-5Xy8/login" element={<AdminPage />} />
        <Route path="/cstb-bureau-5Xy8/actualites/create" element={<AdminPage><AdminEditorPage /></AdminPage>} />
        <Route path="/cstb-bureau-5Xy8/actualites/:id/edit" element={<AdminPage><AdminEditorPage /></AdminPage>} />
        <Route path="/cstb-bureau-5Xy8/actualites/:id/preview" element={<AdminPage><AdminArticlePreviewPage /></AdminPage>} />
        <Route path="/cstb-bureau-5Xy8/newsletter/compose" element={<AdminMailEditor />} />
      </Routes>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton />}
    </div>
  );
}
