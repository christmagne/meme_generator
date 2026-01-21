document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('memeCanvas');
    const ctx = canvas.getContext('2d');
    
    // --- VARIABLES IMAGE ---
    const imageInput = document.getElementById('imageInput');
    let currentImage = null;

    // --- VARIABLES TEXTE HAUT ---
    const topText = document.getElementById('topText');
    const topColor = document.getElementById('topColor');
    const topSize = document.getElementById('topSize');
    const topFont = document.getElementById('topFont');

    // --- VARIABLES TEXTE BAS ---
    const bottomText = document.getElementById('bottomText');
    const bottomColor = document.getElementById('bottomColor');
    const bottomSize = document.getElementById('bottomSize');
    const bottomFont = document.getElementById('bottomFont');

    // Liste de tous les éléments qui déclenchent le dessin
    const allInputs = [
        topText, topColor, topSize, topFont,
        bottomText, bottomColor, bottomSize, bottomFont
    ];

    function drawMeme() {
        if (!currentImage) return;

        // 1. Reset du Canvas
        canvas.width = currentImage.width;
        canvas.height = currentImage.height;
        ctx.drawImage(currentImage, 0, 0);

        // Paramètres communs
        ctx.textAlign = 'center';

        // 2. DESSIN TEXTE HAUT
        if (topText.value) {
            const sizeH = (topSize.value / 500) * canvas.width;
            ctx.font = `bold ${sizeH}px ${topFont.value}`;
            ctx.fillStyle = topColor.value;
            ctx.strokeStyle = 'black';
            ctx.lineWidth = sizeH / 8;
            ctx.textBaseline = 'top';
            
            // On dessine (Contour + Remplissage)
            ctx.strokeText(topText.value.toUpperCase(), canvas.width / 2, 20);
            ctx.fillText(topText.value.toUpperCase(), canvas.width / 2, 20);
        }

        // 3. DESSIN TEXTE BAS (Indépendant)
        if (bottomText.value) {
            const sizeB = (bottomSize.value / 500) * canvas.width;
            // Note: On réapplique font et fillStyle ici pour qu'ils soient uniques au bas
            ctx.font = `bold ${sizeB}px ${bottomFont.value}`;
            ctx.fillStyle = bottomColor.value;
            ctx.strokeStyle = 'black';
            ctx.lineWidth = sizeB / 8;
            ctx.textBaseline = 'bottom';
            
            ctx.strokeText(bottomText.value.toUpperCase(), canvas.width / 2, canvas.height - 20);
            ctx.fillText(bottomText.value.toUpperCase(), canvas.width / 2, canvas.height - 20);
        }
    }

    // --- ECOUTEURS D'EVENEMENTS ---
    
    // Charger l'image
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => { currentImage = img; drawMeme(); };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Mettre à jour quand on touche N'IMPORTE QUEL contrôle
    allInputs.forEach(el => {
        el.addEventListener('input', drawMeme);
    });

    // Bouton Télécharger (Navigateur)
    document.getElementById('downloadBtn').onclick = () => {
        if (!currentImage) return showModal('Oups', 'Choisissez une image !', '🖼️');
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    // Bouton Sauvegarder (Serveur)
    document.getElementById('saveBtn').onclick = () => {
        if (!currentImage) return showModal('Erreur', 'Rien à sauvegarder !', '❌');
        
        // Petit effet de chargement (optionnel)
        const btn = document.getElementById('saveBtn');
        const oldText = btn.innerText;
        btn.innerText = "Envoi...";

        fetch('/save_meme', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: canvas.toDataURL() })
        })
        .then(res => res.json())
        .then(data => {
            btn.innerText = oldText;
            if (data.status === 'success') showModal('Succès', 'Enregistré dans la galerie !');
        })
        .catch(err => {
            btn.innerText = oldText;
            console.error(err);
        });
    };
});

// --- FONCTIONS UTILITAIRES ---

function showModal(title, message, icon = '✅') {
    const modal = document.getElementById('customModal');
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalMessage').innerText = message;
    document.getElementById('modalIcon').innerText = icon;
    modal.style.display = 'flex';
    document.getElementById('modalCloseBtn').onclick = () => {
        modal.style.display = 'none';
        if(title === 'Succès') window.location.reload();
    };
}

// Fonction appelée directement depuis le HTML (onclick)
function deleteMeme(filename) {
    // Utilisation d'un confirm natif simple pour la suppression
    if(confirm("Voulez-vous vraiment supprimer ce mème de la galerie ?")) {
        fetch(`/delete_meme/${filename}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
            if(data.status === 'success') {
                // Animation de suppression
                const element = document.getElementById(`item-${filename}`);
                element.style.transform = "scale(0)";
                setTimeout(() => element.remove(), 300);
            } else {
                alert("Erreur lors de la suppression");
            }
        });
    }
}