import React, { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import { AdminLogin } from './AdminLogin';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminStats } from '../components/AdminStats';
import { AdminNews } from '../components/AdminNews';
import { AdminNewsletter } from '../components/AdminNewsletter';
import { AdminCarousel } from '../components/AdminCarousel';
import { AdminSettings } from '../components/AdminSettings';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';

const AdminContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState('stats');

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-72 p-8 lg:p-12 overflow-y-auto min-h-screen">
        {children ? (
          children
        ) : (
          <div className="max-w-6xl mx-auto">
          <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-sans font-extrabold text-[#0f172a] mb-2">
                {activeTab === 'stats' && 'Tableau de bord'}
                {activeTab === 'news' && 'Gestion des Actualités'}
                {activeTab === 'carousel' && 'Gestion du Carrousel'}
                {activeTab === 'newsletter' && 'Liste Newsletter'}
                {activeTab === 'settings' && 'Paramètres du site'}
              </h1>
              <p className="text-[#6b7280]">Bienvenue dans votre espace de gestion CSTB Bénin.</p>
            </div>
            {activeTab === 'news' && (
              <Link to="/cstb-bureau-5Xy8/actualites/create" className="bg-[#007cba] hover:bg-[#005a87] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#007cba]/20">
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
              {activeTab === 'newsletter' && <AdminNewsletter />}
              {activeTab === 'carousel' && <AdminCarousel />}
              {activeTab === 'settings' && <AdminSettings />}
            </motion.div>
          </AnimatePresence>
        </div>
        )}
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
