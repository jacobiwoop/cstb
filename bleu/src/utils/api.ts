const isDev = import.meta.env.DEV;
const API_URL = isDev ? 'http://localhost:3001/api' : '/api';

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
