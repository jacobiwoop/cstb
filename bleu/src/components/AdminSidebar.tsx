import React from 'react';
import { LayoutDashboard, Newspaper, Image as ImageIcon, Mail, Phone, LogOut, MessageSquare, Heart } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import mainLogo from '../assets/logo/Group-48095879.svg';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AdminSidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { logout } = useAdmin();

  const menuItems = [
    { id: 'stats', label: 'Tableau de bord', icon: <LayoutDashboard size={20} /> },
    { id: 'news', label: 'Actualités', icon: <Newspaper size={20} /> },
    { id: 'carousel', label: 'Carrousel', icon: <ImageIcon size={20} /> },
    { id: 'newsletter', label: 'Newsletter', icon: <Mail size={20} /> },
    { id: 'settings', label: 'Paramètres', icon: <Phone size={20} /> },
  ];

  return (
    <div className="w-72 bg-white border-r border-[#e2e8f0] h-screen fixed left-0 top-0 z-50 flex flex-col">
      <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-center bg-[#f8fafc] gap-3">
        <img src={mainLogo} alt="Logo Admin" className="h-10 w-auto" />
      </div>
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
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
};
