# ---- Stage 1: Build Frontend ----
FROM node:20-bullseye AS builder

WORKDIR /app
COPY . /app

# Installer et compiler le frontend Vite
RUN npm install
RUN npm run build

# ---- Stage 2: Runtime ----
FROM node:20-bullseye-slim AS runtime

WORKDIR /app

# Copier le backend
COPY --from=builder /app/backend ./backend

# Copier le frontend compilé dans le dossier que le backend va servir
COPY --from=builder /app/dist ./dist

# Installer les dépendances de production du backend uniquement
WORKDIR /app/backend
RUN npm install --production
RUN npx prisma generate
RUN mkdir -p uploads

# Variables d'environnement
ENV PORT=3001
ENV NODE_ENV=production
ENV DATABASE_URL="file:/app/backend/prisma/dev.db"

EXPOSE 3001

# Appliquer les modifications et démarrer le serveur
CMD ["sh", "-c", "npx prisma db push && node server.js"]
