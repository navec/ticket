# Utiliser une image de base avec Node.js
FROM node:20 AS builder

# Mettre à jour npm vers la dernière version
RUN npm install -g npm@10.9.0

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier le dossier de la dépendance locale `core`
COPY ../core /usr/src/core

# Copier package.json et autres fichiers pour l'application principale
COPY package*.json ./

# Installer les dépendances, incluant le package local `core`
RUN npm install --save /usr/src/core

# Copier le reste des fichiers du projet
COPY . .

# Construire le projet TypeScript
RUN npm run build

# Étape finale : créer une image de production
FROM node:20

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers nécessaires depuis l’étape de construction
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

# Exposer le port
EXPOSE 3000

# Définir la commande pour démarrer l'application
CMD ["node", "-r", "module-alias/register", "dist/main.js"]
