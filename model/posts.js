import connectionPromise from './connection.js';

/**
 * Retourne toutes les publications de la base de données avec le nom de 
 * l'utilisateur, le nombre de like ainsi qu'une date lisible. Le tout est
 * ordonné en ordre décroissant de date.
 * @returns Toutes les publications.
 */
export const getPosts = async () => {
    let connection = await connectionPromise;
    let result = await connection.all(
        `SELECT p.id_post, u.id_user, u.name, p.text, datetime(p.timestamp, 'unixepoch') as datetime, COUNT(l.id_post) AS nb_likes 
        FROM posts p
        INNER JOIN users u ON p.id_user = u.id_user
        LEFT JOIN likes l ON p.id_post = l.id_post
        GROUP BY p.id_post
        ORDER BY p.timestamp DESC`
    );
    return result;
}

/**
 * Retourne toutes les publications d'un utilisateur spécifique dans la base 
 * de données avec le nom de l'utilisateur, le nombre de like ainsi qu'une 
 * date lisible. Le tout est ordonné en ordre décroissant de date.
 * @param {number} idUser ID de l'utilisateur.
 * @returns Toutes les publications d'un utilisateur spécifique.
 */
export const getPostsFromUser = async (idUser) => {
    let connection = await connectionPromise;
    let result = await connection.all(
        `SELECT p.id_post, u.id_user, u.name, p.text, datetime(p.timestamp, 'unixepoch') as datetime, COUNT(l.id_post) AS nb_likes 
        FROM posts p
        INNER JOIN users u ON p.id_user = u.id_user
        LEFT JOIN likes l ON p.id_post = l.id_post
        WHERE p.id_user = ?
        GROUP BY p.id_post
        ORDER BY p.timestamp DESC`,
        [idUser]
    );
    return result;
}

/**
 * Ajoute une publication dans la base de données à la date et heure courante.
 * @param {string} text 
 * @returns Le ID de la publication.
 */
export const addPost = async (text) => {
    let connection = await connectionPromise;
    let { lastID } = await connection.run(
        `INSERT INTO posts (id_user, text, timestamp)
        VALUES (1, ?, strftime('%s', 'now'))`,
        [text]
    )

    return lastID;
}
