import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { AdminLogin } from './AdminLogin';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminStats } from '../components/AdminStats';
import { AdminNews } from '../components/AdminNews';
import { AdminNewsletter } from '../components/AdminNewsletter';
import { AdminCarousel } from '../components/AdminCarousel';
import { AdminSettings } from '../components/AdminSettings';
import { AdminActions } from '../components/AdminActions';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Plus, Menu } from 'lucide-react';

const tabLabels: Record<string, string> = {
  stats: 'Tableau de bord',
  news: 'Gestion des Actualités',
  actions: 'Gestion des Actions',
  carousel: 'Gestion du Carrousel',
  newsletter: 'Liste Newsletter',
  settings: 'Paramètres du site',
};

const AdminContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('stats');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col">
        {/* Barre Mobile */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-[#e2e8f0] px-4 py-3 flex items-center justify-between shadow-sm">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-[#f1f5f9] transition-colors"
          >
            <Menu size={22} className="text-[#0f172a]" />
          </button>
          <span className="font-extrabold text-[#0f172a] text-sm">{tabLabels[activeTab]}</span>
          {activeTab === 'news' ? (
            <Link
              to="/cstb-bureau-5Xy8/actualites/create"
              className="p-2 rounded-lg bg-[#007cba] hover:bg-[#005a87] text-white transition-colors"
            >
              <Plus size={18} />
            </Link>
          ) : (
            <div className="w-8" />
          )}
        </div>

        {/* Contenu */}
        <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
          {children ? (
            children
          ) : (
            <div className="max-w-6xl mx-auto">
              {/* Header Desktop uniquement */}
              <header className="mb-8 hidden lg:flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-sans font-extrabold text-[#0f172a] mb-2">
                    {tabLabels[activeTab]}
                  </h1>
                  <p className="text-[#6b7280]">Bienvenue dans votre espace de gestion CSTB Bénin.</p>
                </div>
                {activeTab === 'news' && (
                  <Link
                    to="/cstb-bureau-5Xy8/actualites/create"
                    className="bg-[#007cba] hover:bg-[#005a87] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#007cba]/20"
                  >
                    <Plus size={20} /> Nouvel article
                  </Link>
                )}
              </header>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'stats' && <AdminStats />}
                  {activeTab === 'news' && <AdminNews />}
                  {activeTab === 'actions' && <AdminActions />}
                  {activeTab === 'newsletter' && <AdminNewsletter />}
                  {activeTab === 'carousel' && <AdminCarousel />}
                  {activeTab === 'settings' && <AdminSettings />}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default function AdminPage({ children }: { children?: React.ReactNode }) {
  const { isLoggedIn } = useAdmin();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <AdminLogin />;
  }

  return <AdminContent>{children}</AdminContent>;
}
