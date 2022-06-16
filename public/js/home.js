let postForm = document.getElementById('post-form');
let postMessage = document.getElementById('post-message');
let postMessageError = document.querySelector('#post-form .error-field');

// Validation client du champ de texte de publication
const validatePostMessage = () => {
    // Affichage de l'erreur seulement si le champ est invalide
    postMessage.classList.toggle('error', !postMessage.validity.valid);
    postMessageError.classList.toggle('active', !postMessage.validity.valid)
}

postForm.addEventListener('submit', validatePostMessage);
postMessage.addEventListener('input', validatePostMessage);

// Ajout d'un post et rafraichissement de la page lorsqu'on envoie le 
// forumulaire de post au serveur.
postForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Si le formulaire n'est pas valide, on ne l'envoie pas
    if (!postForm.checkValidity()) {
        return;
    }

    // Préparation des données
    let data = {
        text: postMessage.value
    };

    // Envoi de l'ajout du post au serveur
    let response = await fetch('/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    // Rafraichissement de la page
    if (response.ok) {
        window.location.reload();
    }
});
