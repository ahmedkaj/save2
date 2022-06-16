/**
 * Validation du ID de l'utilisateur.
 * @param {number} idUser ID de l'utilisateur.
 * @returns Une valeur indiquant si le ID de l'utilisateur est valide.
 */
export const validateIdUser = (idUser) => {
    return typeof idUser === 'number' && !!idUser
}

/**
 * Validation du nom à rechercher.
 * @param {string} userSearch Nom à rechercher.
 * @returns Une valeur indiquant si le nom à rechercher est valide.
 */
export const validateUserSearch = (userSearch) => {
    return typeof userSearch === 'string' && !!userSearch
}

/**
 * Validation du texte d'une publication.
 * @param {string} postText Texte d'une publication.
 * @returns Une valeur indiquant si le texte d'une publication est valide.
 */
export const validatePostText = (postText) => {
    return typeof postText === 'string' && !!postText
}


// Validation de l'email
export const validateEmail = (email) =>
    typeof email === 'string' && !!email;
// Validation du password
export const validatePassword = (password) => 
    typeof password === 'string' && !!password;