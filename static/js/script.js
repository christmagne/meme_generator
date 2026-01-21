document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('memeCanvas');
    const ctx = canvas.getContext('2d');
    
    // Eléments de texte et style
    const imageInput = document.getElementById('imageInput');
    const topTextInput = document.getElementById('topText');
    const bottomTextInput = document.getElementById('bottomText');
    const textColor = document.getElementById('textColor');
    const textSize = document.getElementById('textSize');
    const textFont = document.getElementById('textFont');

    let currentImage = null;

    function drawMeme() {
        if (!currentImage) return;

        canvas.width = currentImage.width;
        canvas.height = currentImage.height;
        ctx.drawImage(currentImage, 0, 0);

        // Appliquer les réglages de l'utilisateur
        const fontSize = (textSize.value / 500) * canvas.width;
        ctx.font = `bold ${fontSize}px ${textFont.value}`;
        ctx.fillStyle = textColor.value;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = fontSize / 8;
        ctx.textAlign = 'center';

        if (topTextInput.value) {
            ctx.textBaseline = 'top';
            ctx.strokeText(topTextInput.value.toUpperCase(), canvas.width / 2, 20);
            ctx.fillText(topTextInput.value.toUpperCase(), canvas.width / 2, 20);
        }

        if (bottomTextInput.value) {
            ctx.textBaseline = 'bottom';
            ctx.strokeText(bottomTextInput.value.toUpperCase(), canvas.width / 2, canvas.height - 20);
            ctx.fillText(bottomTextInput.value.toUpperCase(), canvas.width / 2, canvas.height - 20);
        }
    }

    // Écouteurs pour mise à jour en temps réel
    [topTextInput, bottomTextInput, textColor, textSize, textFont].forEach(el => {
        el.addEventListener('input', drawMeme);
    });

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

    document.getElementById('downloadBtn').onclick = () => {
        if (!currentImage) return showModal('Oups', 'Choisissez une image !', '🖼️');
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    document.getElementById('saveBtn').onclick = () => {
        if (!currentImage) return showModal('Erreur', 'Rien à sauvegarder !', '❌');
        fetch('/save_meme', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: canvas.toDataURL() })
        })
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') showModal('Succès', 'Enregistré dans la galerie !');
        });
    };
});

// Fonctions Globales
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

function deleteMeme(filename) {
    if(confirm("Voulez-vous vraiment supprimer ce mème ?")) {
        fetch(`/delete_meme/${filename}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
            if(data.status === 'success') {
                document.getElementById(`item-${filename}`).remove();
            }
        });
    }
}