// src/routes/authRoutes.js
const express = require('express');
const { check, validationResult } = require('express-validator');
const { registerUser, loginUser, verifyUser } = require('../controllers/authController');

const router = express.Router();

router.post(
    '/register',
    [
        check('email', 'Ungültige Email').isEmail(),
        check('password', 'Passwort muss mindestens 6 Zeichen lang sein').isLength({ min: 6 })
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    registerUser
);

router.post('/login', loginUser);
router.post('/verify', verifyUser);

module.exports = router;
