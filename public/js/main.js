let searchForm = document.getElementById('search-form');
let searchName = document.getElementById('search-name');
let searchNameError = document.querySelector('#search-form .error-field');

// Validation client du champ de recherche d'utilisateur
const validateSearchName = () => {
    // Affichage de l'erreur seulement si le champ est invalide
    searchName.classList.toggle('error', !searchName.validity.valid);
    searchNameError.classList.toggle('active', !searchName.validity.valid)
}

searchForm.addEventListener('submit', validateSearchName);
searchName.addEventListener('input', validateSearchName);

// Redirection vers la page de recherche d'un utilisateur lorsqu'on envoit le
// formulaire de recherche.
searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Redirection vers la page de recherche d'un utilisateur
    if (searchForm.checkValidity()) {
        window.location.replace(`/search?name=${searchName.value}`);
    }
});