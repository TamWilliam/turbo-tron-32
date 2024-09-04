# Image de base Node.js pour construire l'application
FROM node:14 AS build

# Répertoire de travail défini dans le conteneur
WORKDIR /app

# Copie package.json et package-lock.json
COPY package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste des fichiers de l'application
COPY . .

# Construit l'application
RUN npm run build

# Image de base Nginx pour servir l'application
FROM nginx:alpine

# Copie les fichiers build vers le répertoire Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Commande de démarrage
CMD ["nginx", "-g", "daemon off;"]
