import connectionPromise from './connection.js';

/**
 * Cherche un utilisateur dans la base de données par son ID.
 * @param {number} idUser ID de l'utilisateur.
 * @returns L'utilisateur ou null s'il n'existe pas.
 */
export const getUser = async (idUser) => {
    let connection = await connectionPromise;
    let result = await connection.get(
        'SELECT * FROM users WHERE id_user = ?',
        [idUser]
    );
    return result;
}

/**
 * Recherche un utilisateur par son nom dans la base de données.
 * @param {string} name Partie du nom à rechercher.
 * @returns Une liste de tous les utilisateurs dont le nom contient la partie du nom à rechercher.
 */
export const searchUser = async (name) => {
    let connection = await connectionPromise;
    let result = await connection.all(
        'SELECT * FROM users WHERE name LIKE ?',
        ['%' + name + '%']
    );
    return result;
}