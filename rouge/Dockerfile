# Étape 1 : Image de base légère avec Node.js (slim évite les problèmes 'musl' avec Vite)
FROM node:22-slim

# Étape 2 : Définition du répertoire de travail dans le conteneur
WORKDIR /app

# Étape 3 : Copie des fichiers de dépendances et installation
COPY package*.json ./
RUN npm install

# Étape 4 : Copie du reste du code source
COPY . .

# Étape 5 : Construction (build) de l'application React/Vite
RUN npm run build

# Étape 6 : Installation d'un serveur web statique simple (serve)
# L'option "-s" permet de gérer correctement le routage de React Router (SPA)
RUN npm install -g serve

# Étape 7 : Exposition du port (Render utilise généralement une variable d'environnement PORT, 
# mais avec Docker on peut spécifier un port par défaut)
EXPOSE 3000

# Étape 8 : Commande de démarrage
CMD ["serve", "-s", "dist", "-l", "3000"]
