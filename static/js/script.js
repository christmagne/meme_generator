document.addEventListener('DOMContentLoaded', () => {
    // 1. Récupération des éléments HTML
    const canvas = document.getElementById('memeCanvas');
    const ctx = canvas.getContext('2d');
    
    const imageInput = document.getElementById('imageInput');
    const topTextInput = document.getElementById('topText');
    const bottomTextInput = document.getElementById('bottomText');
    const downloadBtn = document.getElementById('downloadBtn');
    const saveBtn = document.getElementById('saveBtn');

    let currentImage = null;

    // 2. Fonction principale : Dessiner le mème
    function drawMeme() {
        // Si pas d'image, on ne fait rien ou on met un fond blanc
        if (!currentImage) return;

        // On adapte la taille du canvas à l'image
        canvas.width = currentImage.width;
        canvas.height = currentImage.height;

        // On dessine l'image
        ctx.drawImage(currentImage, 0, 0);

        // Configuration du style du texte (Style classique de mème)
        ctx.font = `bold ${canvas.width / 10}px Impact`; // Taille relative à l'image
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = canvas.width / 150;
        ctx.textAlign = 'center';

        // Texte du haut
        if (topTextInput.value) {
            ctx.textBaseline = 'top';
            // strokeText pour le contour noir, fillText pour le blanc
            ctx.strokeText(topTextInput.value.toUpperCase(), canvas.width / 2, 10);
            ctx.fillText(topTextInput.value.toUpperCase(), canvas.width / 2, 10);
        }

        // Texte du bas
        if (bottomTextInput.value) {
            ctx.textBaseline = 'bottom';
            ctx.strokeText(bottomTextInput.value.toUpperCase(), canvas.width / 2, canvas.height - 10);
            ctx.fillText(bottomTextInput.value.toUpperCase(), canvas.width / 2, canvas.height - 10);
        }
    }

    // 3. Charger l'image depuis l'ordinateur
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    currentImage = img;
                    drawMeme(); // Une fois l'image chargée, on dessine
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // 4. Mettre à jour en temps réel quand on tape
    topTextInput.addEventListener('input', drawMeme);
    bottomTextInput.addEventListener('input', drawMeme);

    // 5. Bouton Télécharger
    downloadBtn.addEventListener('click', () => {
        if (!currentImage) return alert("Veuillez d'abord charger une image !");
        
        // Crée un lien temporaire pour forcer le téléchargement
        const link = document.createElement('a');
        link.download = 'mon-meme.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    // 6. Bouton Sauvegarder (Envoie au backend Python)
    saveBtn.addEventListener('click', () => {
        if (!currentImage) return alert("Rien à sauvegarder !");

        const dataURL = canvas.toDataURL(); // L'image en format texte base64

        fetch('/save_meme', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: dataURL })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Mème sauvegardé dans la galerie !');
                // On recharge la page pour voir le nouveau mème dans la galerie
                window.location.reload();
            }
        })
        .catch(error => console.error('Erreur:', error));
    });


    function showModal(title, message, icon = '✅') {
    const modal = document.getElementById('customModal');
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalMessage').innerText = message;
    document.getElementById('modalIcon').innerText = icon;
    
    modal.style.display = 'flex';

    // Fermer la modale au clic sur le bouton
    document.getElementById('modalCloseBtn').onclick = () => {
        modal.style.display = 'none';
        if(title === 'Succès') window.location.reload(); // Recharge si succès
    };
}
});