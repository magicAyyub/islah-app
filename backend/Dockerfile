# Utilise l'image Python 3.9 comme base
FROM python:3.12

# Crée un répertoire de travail dans le conteneur
WORKDIR /backend

# Copie les fichiers requirements.txt dans le répertoire de travail
COPY requirements.txt .

# Installe les dépendances du projet
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install pydantic[email]

# Copie tout le reste du projet dans le conteneur
COPY . .

# Exécute le serveur via le fichier main.py
CMD ["python", "-m", "app.main"]
