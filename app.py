import os
import base64
import time
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Dossier où seront stockés les mèmes
UPLOAD_FOLDER = os.path.join('static', 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def index():
    images = sorted(os.listdir(UPLOAD_FOLDER), reverse=True)
    # On ignore le fichier .gitkeep s'il existe
    images = [img for img in images if img != '.gitkeep']
    return render_template('index.html', images=images)

@app.route('/save_meme', methods=['POST'])
def save_meme():
    data = request.get_json()
    image_data = data['image']
    
    # Nettoyage et conversion base64 -> binaire
    header, encoded = image_data.split(",", 1)
    binary_data = base64.b64decode(encoded)
    
    filename = f"meme_{int(time.time())}.png"
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    
    with open(filepath, "wb") as f:
        f.write(binary_data)
        
    return jsonify({"status": "success", "filename": filename})

@app.route('/delete_meme/<filename>', methods=['DELETE'])
def delete_meme(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(filepath):
        os.remove(filepath)
        return jsonify({"status": "success"})
    return jsonify({"status": "error", "message": "Fichier non trouvé"}), 404

if __name__ == '__main__':
    app.run(debug=True)