import connectionPromise from './connection.js';
import bcrypt from 'bcrypt';

export const addUser = async (email , password, name) => {
    let connection = await connectionPromise;

    let passwordHash = await bcrypt.hash(password, 10);

    let info = await connection.run(
        'INSERT INTO users (id_user_type, email, password, name) VALUES(1,?,?,?)',
        [email, passwordHash, name]

    );

    return info.lastID;
}

export const getUser = async (email) => {
    let connection = await connectionPromise;

    let result = await connection.get(
        'SELECT id_user, email, password, name FROM users WHERE email = ?',
        [email]
    );

    return result;
}