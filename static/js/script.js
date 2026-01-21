document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('memeCanvas');
    const ctx = canvas.getContext('2d');
    
    const imageInput = document.getElementById('imageInput');
    let currentImage = null;

    // --- VARIABLES TEXTE ---
    const topText = document.getElementById('topText');
    const topColor = document.getElementById('topColor');
    const topSize = document.getElementById('topSize');
    const topFont = document.getElementById('topFont');

    const bottomText = document.getElementById('bottomText');
    const bottomColor = document.getElementById('bottomColor');
    const bottomSize = document.getElementById('bottomSize');
    const bottomFont = document.getElementById('bottomFont');

    const allInputs = [topText, topColor, topSize, topFont, bottomText, bottomColor, bottomSize, bottomFont];

    function drawMeme() {
        if (!currentImage) return;
        canvas.width = currentImage.width;
        canvas.height = currentImage.height;
        ctx.drawImage(currentImage, 0, 0);
        ctx.textAlign = 'center';

        // Texte HAUT
        if (topText.value) {
            const sizeH = (topSize.value / 500) * canvas.width;
            ctx.font = `bold ${sizeH}px ${topFont.value}`;
            ctx.fillStyle = topColor.value;
            ctx.strokeStyle = 'black';
            ctx.lineWidth = sizeH / 8;
            ctx.textBaseline = 'top';
            ctx.strokeText(topText.value.toUpperCase(), canvas.width / 2, 20);
            ctx.fillText(topText.value.toUpperCase(), canvas.width / 2, 20);
        }

        // Texte BAS
        if (bottomText.value) {
            const sizeB = (bottomSize.value / 500) * canvas.width;
            ctx.font = `bold ${sizeB}px ${bottomFont.value}`;
            ctx.fillStyle = bottomColor.value;
            ctx.strokeStyle = 'black';
            ctx.lineWidth = sizeB / 8;
            ctx.textBaseline = 'bottom';
            ctx.strokeText(bottomText.value.toUpperCase(), canvas.width / 2, canvas.height - 20);
            ctx.fillText(bottomText.value.toUpperCase(), canvas.width / 2, canvas.height - 20);
        }
    }

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

    allInputs.forEach(el => el.addEventListener('input', drawMeme));

    // Bouton Télécharger
    document.getElementById('downloadBtn').onclick = () => {
        if (!currentImage) return showModal('Oups', 'Choisissez une image !', '🖼️');
        const link = document.createElement('a');
        link.download = 'meme.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    // Bouton Sauvegarder
    document.getElementById('saveBtn').onclick = () => {
        if (!currentImage) return showModal('Erreur', 'Rien à sauvegarder !', '❌');
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
        });
    };

    // --- LOGIQUE PARTAGER (WEB SHARE API) ---
    document.getElementById('shareBtn').onclick = async () => {
        if (!currentImage) return showModal('Oups', 'Rien à partager !', '🖼️');

        try {
            const dataUrl = canvas.toDataURL('image/png');
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], 'meme.png', { type: 'image/png' });

            // Vérifie si le navigateur supporte le partage de fichiers
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'Mon Mème',
                    text: 'Regardez le mème que je viens de créer avec MemeGen !'
                });
            } else {
                showModal('Info', 'Le partage direct n\'est pas supporté par votre navigateur. Téléchargez l\'image pour la partager.', 'ℹ️');
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                showModal('Erreur', 'Impossible d\'ouvrir le menu de partage.', '⚠️');
            }
        }
    };
});

// MODALES
function showModal(title, message, icon = '✅') {
    const modal = document.getElementById('infoModal');
    document.getElementById('modalTitle').innerText = title;
    document.getElementById('modalMessage').innerText = message;
    document.getElementById('modalIcon').innerText = icon;
    modal.style.display = 'flex';
    document.getElementById('modalCloseBtn').onclick = () => {
        modal.style.display = 'none';
        if(title === 'Succès') window.location.reload();
    };
}

let imageToDelete = null;
function requestDelete(filename) {
    imageToDelete = filename;
    document.getElementById('confirmModal').style.display = 'flex';
}
document.getElementById('cancelDeleteBtn').onclick = () => document.getElementById('confirmModal').style.display = 'none';
document.getElementById('confirmDeleteBtn').onclick = () => {
    if (imageToDelete) {
        fetch(`/delete_meme/${imageToDelete}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
            document.getElementById('confirmModal').style.display = 'none';
            if(data.status === 'success') {
                const element = document.getElementById(`item-${imageToDelete}`);
                element.style.transform = "scale(0)";
                setTimeout(() => element.remove(), 300);
            }
        });
    }
};