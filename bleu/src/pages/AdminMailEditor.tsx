import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { newsletterApi, mediaApi, getMediaUrl } from '../utils/api';
import { ArrowLeft, Send, Eye, LayoutTemplate, Mail, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminLogin } from './AdminLogin';
import { Tiptap } from '../components/TiptapEditor';

export const AdminMailEditor: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAdmin();

  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [editorWidth, setEditorWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = (e.clientX / window.innerWidth) * 100;
      setEditorWidth(Math.max(30, Math.min(70, newWidth)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  if (!isLoggedIn) {
    return <AdminLogin />;
  }

  const handleSend = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir envoyer ce mail à TOUS les abonnés ?")) return;
    
    setIsSending(true);
    try {
      const res = await newsletterApi.send(subject, content);
      alert(`Newsletter envoyée avec succès à ${res.count} abonnés !`);
      navigate('/cstb-bureau-5Xy8');
    } catch (error: any) {
      console.error("Erreur envoi", error);
      alert(error.message || "Erreur pendant l'envoi de la newsletter");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#f8fafc] overflow-hidden font-sans">
      {/* Header Éditeur */}
      <header className="h-16 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link to="/cstb-bureau-5Xy8" className="p-2 -ml-2 text-[#6b7280] hover:text-[#0f172a] hover:bg-[#f1f5f9] rounded-lg transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div className="h-6 w-px bg-[#e2e8f0]"></div>
          <h1 className="font-bold text-[#0f172a] flex items-center gap-2">
            <Mail size={18} className="text-[#007cba]" />
            Composer une Newsletter
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSend}
            disabled={!subject || !content || isSending}
            className="bg-[#007cba] hover:bg-[#005a87] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md"
          >
            {isSending ? "Envoi..." : <><Send size={18} /> Envoyer à tous</>}
          </button>
        </div>
      </header>

      {/* Workspace Split-Screen */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Colonne d'Édition (Gauche) */}
        <div style={{ width: `${editorWidth}%` }} className="h-full overflow-y-auto bg-white p-8">
          <div className="max-w-xl mx-auto space-y-6">
            
            <div>
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">Objet du mail</label>
              <textarea 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Invitation à la mobilisation du 15 mai..."
                className="w-full text-2xl font-black text-[#0f172a] placeholder-[#cbd5e1] border-none focus:ring-0 outline-none resize-none leading-tight"
                rows={2}
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">
                <span>Contenu du message</span>
                <span className="text-[#007cba] bg-[#007cba]/10 px-2 py-1 rounded">Éditeur Riche</span>
              </label>
              <Tiptap 
                content={content} 
                onChange={(html) => setContent(html)} 
              />
            </div>

          </div>
        </div>

        {/* Resizer Handle */}
        <div 
          className="w-1.5 h-full bg-[#cbd5e1] hover:bg-[#007cba] cursor-col-resize flex items-center justify-center relative shrink-0 z-20 group transition-colors"
          onMouseDown={() => setIsResizing(true)}
        >
          <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
          </div>
        </div>

        {/* Colonne Aperçu (Droite) */}
        <div style={{ width: `${100 - editorWidth}%` }} className="h-full overflow-y-auto bg-[#f1f5f9] relative border-l border-[#cbd5e1]">
          <div className="sticky top-0 bg-[#e2e8f0]/80 backdrop-blur-sm px-4 py-2 border-b border-[#cbd5e1] flex items-center justify-between z-10">
            <span className="text-xs font-bold text-[#64748b] uppercase tracking-widest flex items-center gap-2">
              <Eye size={14} /> Aperçu du Mail
            </span>
            <span className="text-[10px] text-[#94a3b8]">Rendu HTML Final</span>
          </div>
          
          <div className="p-8 flex justify-center">
            {/* Simulation du Template Mail */}
            <div className="w-full max-w-[600px] bg-white shadow-2xl overflow-hidden border border-[#e2e8f0]">
              <div className="bg-[#007cba] text-white p-8 text-center">
                <img src={getMediaUrl('/uploads/logo.svg')} alt="Logo CSTB" className="w-48 h-auto mx-auto invert brightness-0" />
              </div>
              
              <div className="p-10 min-h-[400px]">
                <h2 className="text-[#0f172a] text-xl font-bold mb-6">{subject || "Sujet du mail"}</h2>
                <article 
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: content || "<p class='text-[#94a3b8] italic'>Rédigez votre message à gauche pour voir l'aperçu...</p>" }}
                />
                
                <p className="mt-10 text-sm text-[#64748b]">
                  Fraternellement,<br />
                  <strong>L'équipe CSTB Bénin</strong>
                </p>
              </div>

              <div className="bg-[#f8fafc] border-t border-[#f1f5f9] p-6 text-center text-[10px] text-[#94a3b8]">
                <p className="font-bold mb-1">CSTB Bénin - Confédération des Syndicats Travailleurs du Bénin</p>
                <p>Bourse du Travail, Cotonou, Bénin</p>
                <p className="mt-4 opacity-70">Vous recevez ce mail car vous êtes inscrit sur notre site. <span className="underline cursor-pointer">Se désabonner</span></p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
