
# Islah school Backend

Bienvenue dans la partie backend, elle utilise **FastAPI**, **Docker**, et **Poetry** pour une gestion simplifiée des dépendances et de l'environnement. Le script `setup` est conçu pour automatiser la configuration initiale.

---

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :

- **Python 3.10+** : [Télécharger ici](https://www.python.org/downloads/)
- **Docker** et **Docker Compose** : [Télécharger Docker Desktop](https://www.docker.com/products/docker-desktop/)

NB: Vous pouvez aussi télécharger [Poetry](https://python-poetry.org/docs/#installation) pour plus de facilité avec les commandes.
---

## Installation et Configuration

Le projet est conçu pour être configuré facilement et de manière très intuitive et très claire.

1. **Clonez le dépôt :**

```bash
git clone https://github.com/magicAyyub/islah-app.git
cd backend
```

2. **Installez les dépendances**
```bash
poetry install # si installé globalement
# ou
pip install poetry
python -m poetry install
```
2. **Setup**

Lancez simplement la commande suivante :

```bash
poetry run setup # si installé globalement
# ou
python -m poetry run setup
```

> NB: Vérifiez que docker-desktop est bien en cours d'exécution sur votre machine avant d'exécuter le `run setup`.

3. **Commandes disponibles**
Une aide est disponible avec une description sur les commandes afin de ne pas être perdu
```bash
poetry run help # si installé globalement
# ou
python -m poetry run help
```

> Le backend est maintenant accessible à l'adresse `http://localhost:8000/docs`. Un administrateur par défaut dont les informations vous sont donné à la fin du setup est créé. 
---

## Contribution

Si vous souhaitez contribuer au projet, suivez ces étapes :

1. Créez une branche pour vos modifications :
```bash
git checkout -b feature/nouvelle-fonctionnalite
```

2. Effectuez vos modifications et ajoutez-les au contrôle de version :
```bash
git add .
git commit -m "Ajout d'une nouvelle fonctionnalité"
```

3. Poussez vos modifications vers le dépôt distant :
```bash
git push origin feature/nouvelle-fonctionnalite
```

4. Créez une pull request sur GitHub.

---

## Support
En cas de problème, les logs des conteneurs Docker peuvent vous aider à identifier la source du problème. Pour les consulter, utilisez la commande suivante :

```bash
poetry run logs
# ou
python -m poetry run logs
```

Si le problème persiste, veuillez contacter [magicAyyub](https://github.com/magicAyyub)ou ouvrir une issue sur le dépôt GitHub.

