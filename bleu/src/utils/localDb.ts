export const LocalDB = {
  get: (key: string, defaultValue: any) => {
    const saved = localStorage.getItem(`cstb_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  },
  save: (key: string, data: any) => {
    localStorage.setItem(`cstb_${key}`, JSON.stringify(data));
  },
  logout: () => {
    localStorage.removeItem('cstb_is_logged_in');
  }
};

export const defaultNews = [
  {
    id: 1,
    date: "2 Avril 2026",
    category: "Communiqué",
    title: "Appel à la mobilisation générale pour les droits des travailleurs",
    excerpt: "La CSTB appelle tous les travailleurs à se mobiliser pour défendre les acquis sociaux face aux nouvelles mesures gouvernementales. Un rassemblement est prévu à la Bourse du Travail.",
    image: "articleImg1",
    likes: 124,
    comments: []
  },
  {
    id: 2,
    date: "15 Mars 2026",
    category: "Éducation",
    title: "Succès de la plateforme éducative soutenue par l'UNESCO",
    excerpt: "Plus de 5000 enseignants ont déjà rejoint notre nouvelle plateforme de formation continue, renforçant ainsi la qualité de l'enseignement au niveau national.",
    image: "articleImg2",
    likes: 89,
    comments: []
  },
  {
    id: 3,
    date: "28 Février 2026",
    category: "Négociation",
    title: "Avancées significatives sur la convention collective",
    excerpt: "Après plusieurs semaines de négociations intenses, des accords de principe ont été trouvés concernant la revalorisation salariale dans le secteur privé.",
    image: "articleImg3",
    likes: 215,
    comments: []
  }
];
