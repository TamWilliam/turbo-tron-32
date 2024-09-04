# Image de base Python
FROM python:3.9

# Répertoire de travail défini dans le conteneur
WORKDIR /app

# Copie le fichier des dépendances
COPY requirements.txt .

# Installe les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copie le reste des fichiers de l'application
COPY . .

# Port sur lequel l'application Django tourne
EXPOSE 8000

# Commande de démarrage
CMD ["gunicorn", "mon_projet.wsgi:application", "--bind", "0.0.0.0:8000"]
