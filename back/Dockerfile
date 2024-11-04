# Étape de build
FROM node:20 AS builder

# Mettre à jour npm vers la version la plus récente
RUN npm install -g npm@10.9.0

# Configurer le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration de npm pour tout le monorepo
COPY package.json package-lock.json ./

# Copier les dossiers du workspace (core et authentication-service)
COPY core ./core
COPY authentication-service ./authentication-service

# Installer les dépendances avec npm et gérer les workspaces
RUN npm ci

# Construire le projet TypeScript pour le service `authentication-service`
WORKDIR /app/authentication-service

# Exposer le port du service (exemple : 3000)
EXPOSE 3000

# Démarrer l'application
CMD ["node", "dist/main.js"]
