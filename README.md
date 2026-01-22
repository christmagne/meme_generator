# Meme Generator 🎬

Une application web simple pour créer et partager des mèmes.

## À propos

Meme Generator est une application Flask qui permet de :
- Créer des mèmes en temps réel depuis votre navigateur
- Sauvegarder vos créations en tant qu'images PNG
- Afficher une galerie des mèmes générés
- Supprimer les mèmes que vous n'aimez pas

## Technologies utilisées

- **Backend** : Flask (Python)
- **Frontend** : HTML, CSS, JavaScript
- **Déploiement** : Gunicorn,github  render

## Structure du projet

```
meme_generetor/
├── app.py                 # Application Flask principale
├── requirements.txt       # Dépendances Python
├── Procfile              # Configuration de déploiement
├── README.md             # Ce fichier
├── static/
│   ├── css/
│   │   └── style.css     # Styles CSS
│   ├── js/
│   │   └── script.js     # Logique JavaScript côté client
│   └── uploads/          # Dossier de stockage des mèmes
└── templates/
    └── index.html        # Page HTML principale
```

## Installation et utilisation

### Prérequis
- Python 3.7+
- pip

### 1. Cloner/télécharger le projet
```bash
cd meme_generetor
```

### 2. Créer un environnement virtuel
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux
```

### 3. Installer les dépendances
```bash
pip install -r requirements.txt
```

### 4. Lancer l'application
```bash
python app.py
```

L'application sera accessible à l'adresse : `http://localhost:5000`

## Fonctionnalités

### Créer un mème
Utilisez l'interface web pour :
- Charger une image ou créer un mème à partir de zéro
- Ajouter du texte
- Télécharger votre création

### Galerie
- Tous les mèmes sauvegardés sont affichés en galerie
- Supprimez les mèmes en un clic
- partager un mèmes 
## API

### Endpoints

- **GET** `/` - Page principale avec galerie
- **POST** `/save_meme` - Sauvegarder un mème (base64 → PNG)
- **DELETE** `/delete_meme/<filename>` - Supprimer un mème

## Déploiement

Ce projet est configuré pour être déployé  grâce au `Procfile`.

```bash
git push origin  main
```

## Licence

Libre d'utilisation.
