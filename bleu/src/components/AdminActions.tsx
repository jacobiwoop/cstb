import React, { useState, useEffect } from 'react';
import { actionApi, mediaApi, getMediaUrl, PLACEHOLDER_IMAGE, articleApi } from '../utils/api';
import { Edit, Trash2, Plus, Search, Calendar, Image as ImageIcon, X, Save, UploadCloud, Link as LinkIcon, Type, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AdminActions: React.FC = () => {
  const [actions, setActions] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAction, setCurrentAction] = useState<any>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [isArticleSelectorOpen, setIsArticleSelectorOpen] = useState(false);
  const [articleSearchTerm, setArticleSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [actionsData, articlesData] = await Promise.all([
        actionApi.getAll(),
        articleApi.getAll()
      ]);
      setActions(actionsData);
      setArticles(articlesData);
    } catch (error) {
      console.error("Erreur de récupération :", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenForm = (action: any = null) => {
    if (action) {
      setCurrentAction(action);
    } else {
      setCurrentAction({
        title: '',
        date: '',
        description: '',
        image: '',
        articleId: null,
        order: actions.length
      });
    }
    setIsEditing(true);
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setCurrentAction(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentAction.id) {
        await actionApi.update(currentAction.id, currentAction);
      } else {
        await actionApi.create(currentAction);
      }
      handleCloseForm();
      fetchData();
    } catch (error) {
      console.error("Erreur sauvegarde :", error);
      alert("Erreur lors de la sauvegarde de l'action");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette action ?')) {
      try {
        await actionApi.delete(id);
        setActions(actions.filter(a => a.id !== id));
      } catch (error) {
        console.error("Erreur suppression", error);
        alert("Impossible de supprimer l'action");
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    try {
      const { imageUrl } = await mediaApi.upload(file);
      setCurrentAction({ ...currentAction, image: imageUrl });
    } catch (error) {
      console.error("Erreur upload", error);
      alert("Erreur lors de l'upload de l'image");
    } finally {
      setUploadLoading(false);
    }
  };

  const filteredActions = actions.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Barre d'outils */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-[#e2e8f0]">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Rechercher une action..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#e2e8f0] focus:border-[#007cba] outline-none text-sm"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={18} />
        </div>
        <button 
          onClick={() => handleOpenForm()}
          className="bg-[#007cba] hover:bg-[#005a87] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#007cba]/20"
        >
          <Plus size={18} /> Nouvelle Action
        </button>
      </div>

      {/* Liste des actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredActions.map((action) => (
          <motion.div 
            layout
            key={action.id}
            className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden group hover:shadow-xl transition-all"
          >
            <div className="h-40 relative overflow-hidden bg-gray-100">
              <img 
                src={getMediaUrl(action.image)} 
                alt={action.title}
                className="w-full h-full object-cover"
                onError={(e: any) => e.target.src = PLACEHOLDER_IMAGE}
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <button 
                  onClick={() => handleOpenForm(action)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-[#0f172a] hover:bg-[#007cba] hover:text-white transition-all shadow-sm"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(action.id)}
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="absolute bottom-3 left-3 bg-[#007cba] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                {action.date}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-bold text-[#0f172a] line-clamp-1 mb-2">{action.title}</h3>
              <p className="text-xs text-[#6b7280] line-clamp-3 mb-4">{action.description}</p>
              
              {action.articleId && (
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#007cba] bg-[#007cba]/5 px-3 py-1.5 rounded-lg border border-[#007cba]/10">
                  <LinkIcon size={12} /> Lié à : {articles.find(a => a.id === action.articleId)?.title || "Article inconnu"}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {isLoading && <div className="py-20 text-center text-[#6b7280]">Chargement...</div>}
      {!isLoading && filteredActions.length === 0 && (
        <div className="py-20 text-center text-[#6b7280] bg-white rounded-3xl border border-dashed border-[#e2e8f0]">
          Aucune action trouvée.
        </div>
      )}

      {/* Modal d'édition */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseForm}
              className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-[#e2e8f0] flex justify-between items-center bg-[#f8fafc]">
                <h2 className="text-xl font-extrabold text-[#0f172a]">
                  {currentAction?.id ? 'Modifier l\'action' : 'Nouvelle Action'}
                </h2>
                <button onClick={handleCloseForm} className="p-2 hover:bg-[#e2e8f0] rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wider flex items-center gap-2">
                      <Type size={14} /> Titre de l'action
                    </label>
                    <input 
                      required
                      type="text" 
                      value={currentAction.title}
                      onChange={e => setCurrentAction({...currentAction, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] focus:border-[#007cba] outline-none transition-all text-sm"
                      placeholder="Ex: Répression du 1er Mai"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={14} /> Date d'affichage
                    </label>
                    <input 
                      required
                      type="text" 
                      value={currentAction.date}
                      onChange={e => setCurrentAction({...currentAction, date: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] focus:border-[#007cba] outline-none transition-all text-sm"
                      placeholder="Ex: Mai 2025"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">Description courte</label>
                  <textarea 
                    required
                    rows={4}
                    value={currentAction.description}
                    onChange={e => setCurrentAction({...currentAction, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] focus:border-[#007cba] outline-none transition-all text-sm resize-none"
                    placeholder="Décrivez l'action en quelques lignes..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon size={14} /> Image de couverture
                    </label>
                    <div className="relative group aspect-video rounded-2xl bg-[#f1f5f9] border-2 border-dashed border-[#cbd5e1] overflow-hidden flex items-center justify-center transition-all hover:border-[#007cba] hover:bg-[#007cba]/5">
                      {currentAction.image ? (
                        <>
                          <img src={getMediaUrl(currentAction.image)} alt="Preview" className="w-full h-full object-cover" onError={(e:any) => e.target.src = PLACEHOLDER_IMAGE} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <label className="cursor-pointer bg-white text-[#0f172a] px-4 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-transform flex items-center gap-2">
                              {uploadLoading ? 'Upload...' : 'Changer l\'image'}
                              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                          </div>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#94a3b8]">
                            {uploadLoading ? <div className="animate-spin text-[#007cba]">●</div> : <UploadCloud size={24} />}
                          </div>
                          <span className="text-xs font-bold text-[#94a3b8]">{uploadLoading ? 'Chargement...' : 'Cliquer pour uploader'}</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2 relative">
                      <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wider flex items-center gap-2">
                        <LinkIcon size={14} /> Article Lié (Optionnel)
                      </label>
                      
                      {/* Sélecteur d'article personnalisé */}
                      <div className="relative">
                        <button 
                          type="button"
                          onClick={() => setIsArticleSelectorOpen(!isArticleSelectorOpen)}
                          className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] focus:border-[#007cba] bg-white text-left text-sm flex items-center justify-between group transition-all"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            {currentAction.articleId ? (
                              <>
                                <div className="w-8 h-8 rounded bg-gray-100 overflow-hidden shrink-0">
                                  <img 
                                    src={getMediaUrl(articles.find(a => a.id === currentAction.articleId)?.image)} 
                                    className="w-full h-full object-cover" 
                                    onError={(e:any) => e.target.src = PLACEHOLDER_IMAGE}
                                  />
                                </div>
                                <span className="font-bold truncate text-[#0f172a]">
                                  {articles.find(a => a.id === currentAction.articleId)?.title}
                                </span>
                              </>
                            ) : (
                              <span className="text-[#94a3b8]">Aucun article lié</span>
                            )}
                          </div>
                          <ChevronDown size={18} className={`text-[#94a3b8] group-hover:text-[#007cba] transition-transform ${isArticleSelectorOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isArticleSelectorOpen && (
                            <>
                              <div className="fixed inset-0 z-[70]" onClick={() => setIsArticleSelectorOpen(false)} />
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-[#e2e8f0] shadow-2xl z-[80] overflow-hidden"
                              >
                                <div className="p-3 border-b border-[#f1f5f9]">
                                  <div className="relative">
                                    <input 
                                      type="text"
                                      placeholder="Rechercher un article..."
                                      className="w-full pl-9 pr-4 py-2 bg-[#f8fafc] border-none rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#007cba]/20"
                                      value={articleSearchTerm}
                                      onChange={(e) => setArticleSearchTerm(e.target.value)}
                                      autoFocus
                                    />
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" size={14} />
                                  </div>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCurrentAction({...currentAction, articleId: null});
                                      setIsArticleSelectorOpen(false);
                                    }}
                                    className="w-full px-4 py-3 text-left hover:bg-[#f8fafc] transition-colors border-b border-[#f1f5f9] flex items-center justify-between group"
                                  >
                                    <span className="text-xs font-bold text-red-500">Détacher l'article</span>
                                    <X size={14} className="opacity-0 group-hover:opacity-100 text-red-500" />
                                  </button>
                                  {articles
                                    .filter(art => art.title.toLowerCase().includes(articleSearchTerm.toLowerCase()))
                                    .map(art => (
                                    <button
                                      key={art.id}
                                      type="button"
                                      onClick={() => {
                                        setCurrentAction({...currentAction, articleId: art.id});
                                        setIsArticleSelectorOpen(false);
                                      }}
                                      className="w-full px-4 py-3 text-left hover:bg-[#f8fafc] transition-colors flex items-center gap-3 border-b last:border-none border-[#f1f5f9]"
                                    >
                                      <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden shrink-0 shadow-sm">
                                        <img 
                                          src={getMediaUrl(art.image)} 
                                          className="w-full h-full object-cover"
                                          onError={(e:any) => e.target.src = PLACEHOLDER_IMAGE}
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-extrabold text-[#0f172a] truncate mb-0.5">{art.title}</p>
                                        <p className="text-[10px] text-[#94a3b8] line-clamp-1">{art.excerpt || "Pas de description"}</p>
                                      </div>
                                    </button>
                                  ))}
                                  {articles.filter(art => art.title.toLowerCase().includes(articleSearchTerm.toLowerCase())).length === 0 && (
                                    <div className="py-8 text-center text-[#94a3b8] text-xs">
                                      Aucun article trouvé.
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#6b7280] uppercase tracking-wider">Ordre d'affichage</label>
                      <input 
                        type="number" 
                        value={currentAction.order}
                        onChange={e => setCurrentAction({...currentAction, order: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] focus:border-[#007cba] outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="submit"
                    className="flex-1 bg-[#007cba] hover:bg-[#005a87] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#007cba]/20"
                  >
                    <Save size={20} /> Enregistrer l'action
                  </button>
                  <button 
                    type="button"
                    onClick={handleCloseForm}
                    className="px-6 bg-[#f8fafc] border border-[#e2e8f0] text-[#6b7280] rounded-2xl font-bold hover:bg-white transition-all"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
