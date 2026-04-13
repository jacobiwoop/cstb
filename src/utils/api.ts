import noImage from '../assets/no-image.jpg';

const isDev = import.meta.env.DEV;
const API_URL = isDev ? 'http://localhost:3001/api' : '/api';
const MEDIA_URL = isDev ? 'http://localhost:3001' : ''; // Pas de préfixe en prod (relatif)

export const PLACEHOLDER_IMAGE = noImage;

export const formatActionDate = (dateStr: string) => {
  if (!dateStr) return "";
  // Si c'est déjà un format lisible (non YYYY-MM-DD), on le garde
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
};

export const getMediaUrl = (path: string) => {
  if (!path) return noImage;
  if (path.startsWith('http') || path.startsWith('data:')) return path; // Image externe ou base64
  return `${MEDIA_URL}${path}`; // Image locale /uploads/...
};

export const articleApi = {
  // Récupérer tous les articles
  getAll: async () => {
    const res = await fetch(`${API_URL}/articles`);
    if (!res.ok) throw new Error('Erreur lors de la récupération des articles');
    return res.json();
  },
  
  // Récupérer un article spécifique
  getOne: async (id: number | string) => {
    const res = await fetch(`${API_URL}/articles/${id}`);
    if (!res.ok) throw new Error('Article introuvable');
    return res.json();
  },
  
  // Créer un article
  create: async (data: any) => {
    const res = await fetch(`${API_URL}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur de création');
    return res.json();
  },
  
  // Mettre à jour un article
  update: async (id: number | string, data: any) => {
    const res = await fetch(`${API_URL}/articles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur de mise à jour');
    return res.json();
  },
  
  // Supprimer un article
  delete: async (id: number | string) => {
    const res = await fetch(`${API_URL}/articles/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erreur de suppression');
    return true;
  }
};

export const slideApi = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/slides`);
    if (!res.ok) throw new Error('Erreur lors de la récupération des slides');
    return res.json();
  },
  
  create: async (data: any) => {
    const res = await fetch(`${API_URL}/slides`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur de création du slide');
    return res.json();
  },
  
  update: async (id: number | string, data: any) => {
    const res = await fetch(`${API_URL}/slides/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur de mise à jour du slide');
    return res.json();
  },
  
  delete: async (id: number | string) => {
    const res = await fetch(`${API_URL}/slides/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erreur de suppression du slide');
    return true;
  }
};

export const commentApi = {
  create: async (data: any) => {
    const res = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur de création du commentaire');
    return res.json();
  },
  
  update: async (id: number | string, data: { adminReply: string | null }) => {
    const res = await fetch(`${API_URL}/comments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur de mise à jour du commentaire');
    return res.json();
  },
  
  delete: async (id: number | string) => {
    const res = await fetch(`${API_URL}/comments/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erreur de suppression du commentaire');
    return true;
  }
};

export const actionApi = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/actions`);
    if (!res.ok) throw new Error('Erreur lors de la récupération des actions');
    return res.json();
  },
  
  create: async (data: any) => {
    const res = await fetch(`${API_URL}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur de création de l\'action');
    return res.json();
  },
  
  update: async (id: number | string, data: any) => {
    const res = await fetch(`${API_URL}/actions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erreur de mise à jour de l\'action');
    return res.json();
  },
  
  delete: async (id: number | string) => {
    const res = await fetch(`${API_URL}/actions/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erreur de suppression de l\'action');
    return true;
  }
};

export const newsletterApi = {
  subscribe: async (email: string) => {
    const res = await fetch(`${API_URL}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Erreur d'inscription");
    }
    return res.json();
  },
  getAll: async () => {
    const res = await fetch(`${API_URL}/newsletter`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  },
  delete: async (id: number) => {
    await fetch(`${API_URL}/newsletter/${id}`, { method: 'DELETE' });
  },
  send: async (subject: string, content: string) => {
    const res = await fetch(`${API_URL}/newsletter/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, content }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Erreur lors de l'envoi");
    }
    return res.json();
  }
};

export const mediaApi = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) throw new Error('Erreur lors de l\'upload du fichier');
    return res.json(); // Retourne { imageUrl: '/uploads/xxx.jpg' }
  }
};
export const settingsApi = {
  get: async () => {
    const res = await fetch(`${API_URL}/settings`);
    if (!res.ok) return {};
    return res.json();
  },
  update: async (settings: any) => {
    const res = await fetch(`${API_URL}/settings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (!res.ok) throw new Error("Erreur lors de l'enregistrement des paramètres");
    return res.json();
  },
};
export const statsApi = {
  get: async () => {
    const res = await fetch(`${API_URL}/admin/stats`);
    if (!res.ok) throw new Error('Erreur lors de la récupération des stats');
    return res.json();
  },
};

export const donationApi = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/donations`);
    if (!res.ok) throw new Error('Erreur lors de la récupération des dons');
    return res.json();
  },
  getStats: async () => {
    const res = await fetch(`${API_URL}/donations/stats`);
    if (!res.ok) throw new Error('Erreur lors de la récupération des stats de dons');
    return res.json();
  },
  create: async (data: { amount: number, donorName: string, donorEmail: string, reference: string }) => {
    const res = await fetch(`${API_URL}/donations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur lors de l'enregistrement du don");
    return res.json();
  },
};
