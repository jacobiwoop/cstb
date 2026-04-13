import React from 'react';
import { LayoutDashboard, Newspaper, Image as ImageIcon, Mail, Phone, LogOut, X, Menu, Zap } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import mainLogo from '../assets/logo/Group-48095879.svg';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (v: boolean) => void;
}

export const AdminSidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) => {
  const { logout } = useAdmin();

  const menuItems = [
    { id: 'stats', label: 'Tableau de bord', icon: <LayoutDashboard size={20} /> },
    { id: 'news', label: 'Actualités', icon: <Newspaper size={20} /> },
    { id: 'actions', label: 'Actions / Luttes', icon: <Zap size={20} /> },
    { id: 'carousel', label: 'Carrousel', icon: <ImageIcon size={20} /> },
    { id: 'newsletter', label: 'Newsletter', icon: <Mail size={20} /> },
    { id: 'settings', label: 'Paramètres', icon: <Phone size={20} /> },
  ];

  const handleNav = (id: string) => {
    setActiveTab(id);
    setMobileOpen?.(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-between bg-[#f8fafc]">
        <img src={mainLogo} alt="Logo Admin" className="h-10 w-auto" />
        {/* Bouton fermer sur mobile */}
        <button 
          className="lg:hidden p-2 rounded-lg hover:bg-[#e2e8f0] transition-colors"
          onClick={() => setMobileOpen?.(false)}
        >
          <X size={20} className="text-[#6b7280]" />
        </button>
      </div>
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNav(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === item.id 
                ? 'bg-[#007cba] text-white shadow-lg shadow-[#007cba]/20' 
                : 'text-[#6b7280] hover:bg-[#f8fafc] hover:text-[#0f172a]'
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
      <div className="p-4 border-t border-[#e2e8f0] bg-[#f8fafc]">
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* --- SIDEBAR DESKTOP --- */}
      <div className="hidden lg:flex w-72 bg-white border-r border-[#e2e8f0] h-screen fixed left-0 top-0 z-50 flex-col">
        {sidebarContent}
      </div>

      {/* --- OVERLAY MOBILE (fond sombre) --- */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen?.(false)}
        />
      )}

      {/* --- SIDEBAR MOBILE (drawer) --- */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-[#e2e8f0] z-50 flex flex-col transform transition-transform duration-300 lg:hidden ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {sidebarContent}
      </div>
    </>
  );
};
