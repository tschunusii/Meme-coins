const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const usersFile = path.join(__dirname, '../../data/users.json');

async function saveUser(user) {
    const users = await getUsers();
    const updatedUsers = users.map(u => (u.email === user.email ? user : u));
    fs.writeFileSync(usersFile, JSON.stringify(updatedUsers, null, 2));
}

async function getUsers() {
    if (!fs.existsSync(usersFile)) return [];
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
}

async function findUserByEmail(email) {
    const users = await getUsers();
    return users.find(user => user.email === email);
}

async function createUser(email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email, password: hashedPassword, isVerified: false };
    await saveUser(newUser);
    return newUser;
}

module.exports = { createUser, findUserByEmail, saveUser };
