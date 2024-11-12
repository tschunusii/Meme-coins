// src/controllers/authController.js
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { createUser, findUserByEmail, saveUser } = require('../models/userModel');

// Registrierung mit E-Mail-Bestätigung
const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await findUserByEmail(email);
        if (existingUser) return res.status(400).json({ message: 'Email bereits registriert' });

        // Benutzer erstellen
        const newUser = await createUser(email, password);

        // Bestätigungscode erstellen
        const verificationCode = crypto.randomInt(100000, 999999).toString();
        newUser.verificationCode = verificationCode;
        newUser.isVerified = false;
        await saveUser(newUser);

        // E-Mail senden
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        await transporter.sendMail({
            from: '"Memecoins Support" <support@memecoins.com>',
            to: email,
            subject: 'Verifizierung Ihrer Memecoins-Registrierung',
            text: `Ihre Verifizierungscode lautet: ${verificationCode}`
        });

        res.status(201).json({ message: 'Registrierung erfolgreich. Überprüfen Sie Ihre E-Mail für den Bestätigungscode.' });
    } catch (error) {
        res.status(500).json({ message: 'Fehler bei der Registrierung', error });
    }
};

// Verifizierung der E-Mail
const verifyUser = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await findUserByEmail(email);

        if (!user || user.verificationCode !== code) {
            return res.status(400).json({ message: 'Ungültiger Code oder Benutzer' });
        }

        user.isVerified = true;
        await saveUser(user);
        res.status(200).json({ message: 'Verifizierung erfolgreich' });
    } catch (error) {
        res.status(500).json({ message: 'Fehler bei der Verifizierung', error });
    }
};

// Benutzer-Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Login-Logik kann hier hinzugefügt werden
        res.status(200).json({ message: 'Login erfolgreich' });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Login', error });
    }
};

module.exports = { registerUser, verifyUser, loginUser };
