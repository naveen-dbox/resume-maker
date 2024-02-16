const bcrypt = require('bcrypt');

async function hashPassword(password){
    hash = await bcrypt.hash(password,10);
    return hash;
}

async function compareHash(password,hash){
    password_hash = await bcrypt.compare(password,hash);
    return password_hash;
}

function generateSalt(length=6) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let salt = '';
    for (let i = 0; i < length; i++) {
        salt += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return salt;
}

module.exports = { hashPassword, generateSalt, compareHash };
