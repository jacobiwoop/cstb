import React, { useState, useRef, useEffect } from 'react';
import { Edit, Image as ImageIcon, Save, Trash2, Plus, UploadCloud, Link as LinkIcon, Type } from 'lucide-react';
import { motion } from 'motion/react';
import { slideApi } from '../utils/api';

export const AdminCarousel: React.FC = () => {
  const [slides, setSlides] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const data = await slideApi.getAll();
      setSlides(data);
    } catch (error) {
      console.error("Erreur chargement slides", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (slide: any) => {
    setEditingId(slide.id);
    setEditFormData({ 
      ...slide,
      title: slide.title || "",
      subtitle: slide.subtitle || "",
      description: slide.description || slide.subtitle || "",
      primaryBtn: slide.primaryBtn || slide.buttonText || "En savoir plus",
      primaryLink: slide.primaryLink || slide.buttonLink || "#",
      secondaryBtn: slide.secondaryBtn || "Nous contacter",
      secondaryLink: slide.secondaryLink || "/contact"
    });
  };

  const handleSave = async () => {
    try {
      if (typeof editingId === 'string' && editingId.startsWith('temp_')) {
        // C'est un nouveau slide non sauvegardé en DB
        const { id, ...dataToSave } = editFormData;
        const saved = await slideApi.create(dataToSave);
        setSlides(slides.map((s: any) => s.id === editingId ? saved : s));
      } else if (editingId) {
        const saved = await slideApi.update(editingId, editFormData);
        setSlides(slides.map((s: any) => s.id === editingId ? saved : s));
      }
      setEditingId(null);
    } catch (error) {
      console.error("Erreur sauvegarde", error);
      alert("Erreur lors de la sauvegarde.");
    }
  };

  const handleDelete = async (id: number | string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce slide ?")) {
      try {
        if (typeof id !== 'string' || !id.toString().startsWith('temp_')) {
          await slideApi.delete(id);
        }
        setSlides(slides.filter((s: any) => s.id !== id));
        if (editingId === id) setEditingId(null);
      } catch (error) {
        console.error("Erreur suppression", error);
      }
    }
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: `temp_${Date.now()}`,
      title: "Sur-titre (Bienvenue)",
      subtitle: "Titre principal de l'annonce",
      description: "Description courte expliquant le contexte ou l'action à mener...",
      image: "",
      primaryBtn: "Action principale",
      primaryLink: "#",
      secondaryBtn: "Action secondaire",
      secondaryLink: "/contact",
      order: slides.length + 1
    };
    setSlides([...slides, newSlide]);
    setEditingId(newSlide.id as any);
    setEditFormData(newSlide);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("L'image est trop volumineuse (max 5 Mo).");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData({ ...editFormData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#e2e8f0] shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <ImageIcon className="text-[#007cba]" />
            <div>
              <h2 className="text-xl font-bold text-[#0f172a]">Gestion des Slides</h2>
              <p className="text-sm text-[#6b7280]">Ajoutez, modifiez et ordonnez les panneaux du carrousel de la page d'accueil.</p>
            </div>
          </div>
          <button 
            onClick={handleAddSlide}
            className="flex items-center gap-2 bg-[#007cba] hover:bg-[#005a87] text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            <Plus size={18} />
            Nouveau Slide
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
             <div className="py-20 text-center text-[#6b7280]">Chargement des slides...</div>
          ) : slides.map((slide: any) => (
            <motion.div 
              key={slide.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] p-6 lg:flex gap-8 items-start"
            >
              
              {/* Zone Image */}
              <div className="w-full lg:w-72 aspect-video bg-gray-200 rounded-xl mb-6 lg:mb-0 overflow-hidden shrink-0 relative group">
                {(editingId === slide.id && editFormData?.image) || (!editingId && slide.image) ? (
                  <img 
                    src={editingId === slide.id ? editFormData.image : slide.image} 
                    alt="Slide"
                    className="w-full h-full object-cover"
                    onError={(e: any) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#007cba]/10 flex flex-col items-center justify-center text-[#007cba]">
                    <ImageIcon size={32} className="mb-2" />
                    <span className="text-xs font-bold uppercase tracking-wider">Aucune image</span>
                  </div>
                )}

                {/* Overlay pour modifier l'image (si on édite ce slide) */}
                {editingId === slide.id && (
                  <div 
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <UploadCloud size={32} className="mb-2" />
                    <span className="text-sm font-bold">Changer l'image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                    />
                  </div>
                )}
              </div>

              {/* Zone Contenu */}
              <div className="flex-1">
                {editingId === slide.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#6b7280] uppercase tracking-wider mb-1 flex items-center gap-2">
                        <Type size={12} /> Sur-titre (Texte de haut)
                      </label>
                      <input 
                        type="text" 
                        value={editFormData.title}
                        onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                        className="w-full bg-white border border-[#cbd5e1] rounded-xl p-2.5 text-sm focus:border-[#007cba] focus:ring-2 focus:ring-[#007cba]/20 outline-none transition-all font-bold text-[#0f172a]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#6b7280] uppercase tracking-wider mb-1 flex items-center gap-2">
                        <Type size={12} /> Titre Principal (Gros Texte)
                      </label>
                      <input 
                        type="text" 
                        value={editFormData.subtitle}
                        onChange={(e) => setEditFormData({...editFormData, subtitle: e.target.value})}
                        className="w-full bg-white border border-[#cbd5e1] rounded-xl p-2.5 text-sm focus:border-[#007cba] focus:ring-2 focus:ring-[#007cba]/20 outline-none transition-all font-bold text-[#0f172a] text-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-[#6b7280] uppercase tracking-wider mb-1 flex items-center gap-2">
                        <Edit size={12} /> Description (Paragraphe)
                      </label>
                      <textarea 
                        value={editFormData.description}
                        onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                        className="w-full bg-white border border-[#cbd5e1] rounded-xl p-2.5 text-sm focus:border-[#007cba] focus:ring-2 focus:ring-[#007cba]/20 outline-none transition-all min-h-[60px] text-[#6b7280]"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#e2e8f0] pt-4 mt-2">
                      <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-[#007cba] uppercase tracking-wider">
                          Bouton Principal (Bleu)
                        </label>
                        <input 
                          type="text" 
                          value={editFormData.primaryBtn}
                          onChange={(e) => setEditFormData({...editFormData, primaryBtn: e.target.value})}
                          className="w-full bg-white border border-[#cbd5e1] rounded-xl p-2.5 text-xs focus:border-[#007cba] focus:ring-2 focus:ring-[#007cba]/20 outline-none transition-all mb-2"
                        />
                        <select 
                          value={editFormData.primaryLink}
                          onChange={(e) => setEditFormData({...editFormData, primaryLink: e.target.value})}
                          className="w-full bg-white border border-[#cbd5e1] rounded-xl p-2.5 text-xs focus:border-[#007cba] focus:ring-2 focus:ring-[#007cba]/20 outline-none transition-all text-[#0f172a]"
                        >
                          <option value="#">Accueil (Haut de page)</option>
                          <option value="/actualites">L'actualité syndicale</option>
                          <option value="/actions">Nos Actions</option>
                          <option value="/a-propos">À propos / Histoire</option>
                          <option value="/contact">Contact</option>
                          <option value="/qui-sommes-nous">Qui sommes-nous</option>
                        </select>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-[10px] font-bold text-[#6b7280] uppercase tracking-wider">
                          Bouton Secondaire (Transparent)
                        </label>
                        <input 
                          type="text" 
                          value={editFormData.secondaryBtn}
                          onChange={(e) => setEditFormData({...editFormData, secondaryBtn: e.target.value})}
                          className="w-full bg-white border border-[#cbd5e1] rounded-xl p-2.5 text-xs focus:border-[#007cba] focus:ring-2 focus:ring-[#007cba]/20 outline-none transition-all mb-2"
                        />
                        <select 
                          value={editFormData.secondaryLink}
                          onChange={(e) => setEditFormData({...editFormData, secondaryLink: e.target.value})}
                          className="w-full bg-white border border-[#cbd5e1] rounded-xl p-2.5 text-xs focus:border-[#007cba] focus:ring-2 focus:ring-[#007cba]/20 outline-none transition-all text-[#0f172a]"
                        >
                          <option value="#">Accueil (Haut de page)</option>
                          <option value="/actualites">L'actualité syndicale</option>
                          <option value="/actions">Nos Actions</option>
                          <option value="/a-propos">À propos / Histoire</option>
                          <option value="/contact">Contact</option>
                          <option value="/qui-sommes-nous">Qui sommes-nous</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-[#e2e8f0]">
                      <button onClick={handleSave} className="px-5 py-2.5 bg-[#007cba] text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#005a87] transition-colors shadow-custom-2">
                        <Save size={16} /> Enregistrer
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-5 py-2.5 bg-white border border-[#e2e8f0] text-[#6b7280] rounded-xl text-sm font-bold hover:bg-[#f8fafc] transition-colors">
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#007cba] mb-1">{slide.title}</span>
                    <h3 className="text-xl font-black text-[#0f172a] mb-2">{slide.subtitle}</h3>
                    <p className="text-[#6b7280] leading-relaxed mb-6 flex-grow text-sm">{slide.description}</p>
                    
                    <div className="mb-6 flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-2 text-xs text-white bg-[#007cba] font-bold px-3 py-1.5 rounded-lg shadow-sm">
                        <LinkIcon size={14} /> 
                        {slide.primaryBtn || "Bouton 1"} → {slide.primaryLink || "#"}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#0f172a] border border-[#cbd5e1] font-bold px-3 py-1.5 rounded-lg shadow-sm">
                        <LinkIcon size={14} /> 
                        {slide.secondaryBtn || "Bouton 2"} → {slide.secondaryLink || "#"}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleEdit(slide)}
                        className="inline-flex items-center gap-2 text-white bg-[#0f172a] hover:bg-[#1e293b] px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                      >
                        <Edit size={14} /> Modifier
                      </button>
                      <button 
                        onClick={() => handleDelete(slide.id)}
                        className="inline-flex items-center gap-2 text-[#ef4444] bg-[#ef4444]/10 hover:bg-[#ef4444]/20 px-4 py-2 rounded-lg font-bold text-sm transition-colors"
                      >
                        <Trash2 size={14} /> Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {slides.length === 0 && (
            <div className="text-center py-20 bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] border-dashed">
              <ImageIcon size={48} className="mx-auto text-[#cbd5e1] mb-4" />
              <p className="text-[#6b7280] font-medium">Votre carrousel est vide.</p>
              <button 
                onClick={handleAddSlide}
                className="mt-4 px-6 py-2 bg-[#007cba] text-white rounded-xl text-sm font-bold shadow-custom-2"
              >
                Ajouter un premier slide
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
