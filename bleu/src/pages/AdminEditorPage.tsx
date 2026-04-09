import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { articleApi, mediaApi } from '../utils/api';
import { ArrowLeft, Save, Eye, LayoutTemplate, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { motion } from 'motion/react';
import { AdminLogin } from './AdminLogin';
import { Tiptap } from '../components/TiptapEditor';

export const AdminEditorPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAdmin();

  const isEditing = Boolean(id);
  
  const [formData, setFormData] = useState({
    title: "",
    category: "Actualité",
    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    author: "CSTB Bénin",
    excerpt: "",
    content: "",
    image: ""
  });

  const [isDragActive, setIsDragActive] = useState(false);
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

  useEffect(() => {
    if (isEditing && id) {
      articleApi.getOne(id).then((article) => {
        setFormData({
          title: article.title || "",
          category: article.category || "Actualité",
          date: article.formattedDate || article.date || new Date().toLocaleDateString(),
          author: article.author || "CSTB Bénin",
          excerpt: article.excerpt || "",
          content: article.content || "",
          image: article.image || ""
        });
      }).catch(err => {
        console.error("Erreur chargement article", err);
      });
    }
    window.scrollTo(0, 0);
  }, [id, isEditing]);

  if (!isLoggedIn) {
    return <AdminLogin />;
  }

  const handleSave = async () => {
    try {
      // Pas de changement ici car formData.image contiendra l'URL retournée par l'upload
      if (isEditing && id) {
        await articleApi.update(id, formData);
      } else {
        await articleApi.create(formData);
      }
      navigate('/cstb-bureau-5Xy8');
    } catch (error) {
      console.error("Erreur sauvegarde", error);
      alert("Erreur réseau pendant la sauvegarde !");
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
            <LayoutTemplate size={18} className="text-[#007cba]" />
            {isEditing ? "Modifier l'article" : "Créer un nouvel article"}
          </h1>
        </div>
        <div>
          <button 
            onClick={handleSave}
            disabled={!formData.title || !formData.content}
            className="bg-[#007cba] hover:bg-[#005a87] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all shadow-md"
          >
            <Save size={18} /> Publier
          </button>
        </div>
      </header>

      {/* Workspace Split-Screen */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Colonne d'Édition (Gauche) */}
        <div style={{ width: `${editorWidth}%` }} className="h-full overflow-y-auto bg-white p-8">
          <div className="max-w-xl mx-auto space-y-6">
            
            <div>
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">Titre de l'article</label>
              <textarea 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Succès de la grève nationale..."
                className="w-full text-3xl font-black text-[#0f172a] placeholder-[#cbd5e1] border-none focus:ring-0 outline-none resize-none leading-tight"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-[#f1f5f9] py-6">
              <div>
                <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">Catégorie</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-3 focus:border-[#007cba] outline-none font-bold text-[#0f172a]"
                >
                  <option value="Actualité">Actualité</option>
                  <option value="Communiqué">Communiqué</option>
                  <option value="Éducation">Éducation</option>
                  <option value="Mobilisation">Mobilisation</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">Image de couverture (Drag & Drop)</label>
                <div 
                  className={`relative border-2 border-dashed rounded-xl p-4 transition-all text-center flex flex-col items-center justify-center gap-2 cursor-pointer h-24 ${
                    isDragActive ? 'border-[#007cba] bg-[#007cba]/5' : 'border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#f1f5f9]'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                  onDragLeave={() => setIsDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragActive(false);
                    const file = e.dataTransfer.files[0];
                    if (file && file.type.startsWith('image/')) {
                      const reader = new FileReader();
                      reader.onload = (e) => setFormData({...formData, image: e.target?.result as string});
                      reader.readAsDataURL(file);
                    }
                  }}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = async (e: any) => {
                      const file = e.target.files[0];
                      if (file) {
                        try {
                          const { imageUrl } = await mediaApi.upload(file);
                          setFormData({...formData, image: imageUrl});
                        } catch (err) {
                          alert("Erreur lors du téléchargement de l'image");
                        }
                      }
                    };
                    input.click();
                  }}
                >
                  <UploadCloud size={24} className={isDragActive ? 'text-[#007cba]' : 'text-[#94a3b8]'} />
                  {formData.image ? (
                    <span className="text-xs font-bold text-[#007cba]">Image chargée (cliquer pour changer)</span>
                  ) : (
                    <span className="text-xs text-[#94a3b8]">Glisser une image ou cliquer</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">Extrait court (Affiché sur l'accueil)</label>
              <textarea 
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                placeholder="Résumé de l'article en 2-3 lignes..."
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 focus:border-[#007cba] outline-none text-[#475569] resize-y min-h-[100px]"
              />
            </div>

            <div>
              <label className="flex items-center justify-between text-xs font-bold text-[#6b7280] uppercase tracking-wider mb-2">
                <span>Contenu</span>
                <span className="text-[#007cba] bg-[#007cba]/10 px-2 py-1 rounded">Éditeur Riche</span>
              </label>
              <Tiptap 
                content={formData.content} 
                onChange={(html) => setFormData({...formData, content: html})} 
              />
            </div>

          </div>
        </div>

        {/* Resizer Handle */}
        <div 
          className="w-1.5 h-full bg-[#cbd5e1] hover:bg-[#007cba] cursor-col-resize flex items-center justify-center relative shrink-0 z-20 group transition-colors"
          onMouseDown={() => setIsResizing(true)}
        >
          {/* Visual indicator (dots) */}
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
              <Eye size={14} /> Aperçu en direct
            </span>
            <span className="text-[10px] text-[#94a3b8]">Vue "ArticlePage.tsx"</span>
          </div>
          
          <div className="p-8">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden pointer-events-none">
              {/* Fake Article Context - Purely Visual Preview */}
              <div className="px-8 pt-8 pb-12">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-[#007cba] text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-[6px]">
                    {formData.category || "Catégorie"}
                  </span>
                  <span className="text-[#6b7280] text-sm font-mono">
                    {formData.date}
                  </span>
                </div>

                <h1 className="text-4xl font-sans font-black text-[#0f172a] leading-tight mb-8">
                  {formData.title || "Titre de l'article"}
                </h1>
              </div>

              {formData.image && (
                <div className="aspect-video w-full overflow-hidden bg-gray-200">
                  <img src={getMediaUrl(formData.image)} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="p-8">
                <article 
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: formData.content || "<p class='text-gray-400 italic'>Le contenu apparaîtra ici...</p>" }}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
