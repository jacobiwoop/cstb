# ---- Étape 1 : Build du Frontend ----
FROM node:20-bullseye AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---- Étape 2 : Runtime Backend ----
FROM node:20-bullseye-slim

WORKDIR /app

# Installation de openssl (nécessaire pour Prisma sur Debian)
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copie des fichiers backend
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install --production

# Copie du schéma Prisma et génération du client
COPY backend/prisma ./prisma/
RUN npx prisma generate

# Copie du reste du code backend
COPY backend/ .

# Copie du frontend buildé vers le dossier dist que le backend sert
COPY --from=builder /app/dist /app/dist

# Configuration pour SQLite persistant (si un disque est monté sur /data)
ENV DATABASE_URL="file:/app/backend/prisma/dev.db"
ENV PORT=3001
ENV NODE_ENV=production

EXPOSE 3001

# Script de démarrage : assure la migration de la base et lance le serveur
# ... reste du Dockerfile ...

# Variables d'environnement (remplacent le fichier .env)
ENV PORT=3001
ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/backend/prisma/dev.db"
ENV EMAIL_HOST="smtp.gmail.com"
ENV EMAIL_PORT=465
ENV EMAIL_USER="ton-email@gmail.com"
ENV EMAIL_PASS="ton-mot-de-passe-ici"
ENV EMAIL_PROVIDER="GMAIL"

# Script de démarrage
CMD ["sh", "-c", "npx prisma db push && node server.js"]

