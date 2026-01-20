import os
import base64
import time
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Dossier où seront stockés les mèmes de la galerie
UPLOAD_FOLDER = os.path.join('static', 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def index():
    """
    Cette fonction s'exécute quand on ouvre la page d'accueil.
    Elle liste les images dans le dossier 'uploads' pour la galerie.
    """
    images = sorted(os.listdir(UPLOAD_FOLDER), reverse=True) # Les plus récents en premier
    return render_template('index.html', images=images)

@app.route('/save_meme', methods=['POST'])
def save_meme():
    """
    Cette fonction reçoit l'image (format base64) envoyée par le Javascript,
    la convertit en fichier image et la sauvegarde sur le serveur.
    """
    data = request.get_json()
    image_data = data['image']
    
    # On nettoie la chaîne de caractères (elle commence par "data:image/png;base64,...")
    header, encoded = image_data.split(",", 1)
    binary_data = base64.b64decode(encoded)
    
    # On crée un nom unique avec l'heure actuelle
    filename = f"meme_{int(time.time())}.png"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    with open(filepath, "wb") as f:
        f.write(binary_data)
        
    return jsonify({"status": "success", "filename": filename})

if __name__ == '__main__':
    # Le mode debug permet de voir les erreurs en direct
    app.run(debug=True)