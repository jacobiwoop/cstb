FROM node:20-bullseye

# 1. Installation de Cloudflared
RUN apt-get update && apt-get install -y wget
RUN wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
RUN dpkg -i cloudflared-linux-amd64.deb || true
RUN apt-get install -f -y

# 2. Installation de Serve pour le frontend statique (Rouge)
RUN npm install -g serve

# 3. Préparation du répertoire de travail
WORKDIR /app
COPY . /app

# 4. Installation & Build : Application BLEU (Frontend)
WORKDIR /app/bleu
RUN npm install
RUN npm run build

# 5. Installation & Préparation : Application BLEU (Backend API + Serveur statique)
WORKDIR /app/bleu/backend
RUN npm install
RUN npx prisma generate
RUN npx prisma migrate deploy

# 6. Installation & Build : Application ROUGE (Frontend pur)
WORKDIR /app/rouge
RUN npm install
RUN npm run build

# 7. Préparation du point d'entrée pour Render
WORKDIR /app
RUN npm init -y && npm install express

EXPOSE 8080
ENV PORT=8080
ENV NODE_ENV=production

# 8. Lancement du script coordinateur
CMD ["node", "entrypoint.js"]
