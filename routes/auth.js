const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword, age, phoneNumber, courseName } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Email is already registered.');
            return res.redirect('/register');
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            age,
            phoneNumber,
            courseEnrolled: { courseName },
        });

        await user.save();
        req.flash('success', 'Registration successful. Please log in.');
        res.redirect('/login');
    } catch (err) {
        console.error('Register error:', err);
        req.flash('error', 'Unable to register. Please try again.');
        res.redirect('/register');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: true,
    }),
    (req, res) => {
        req.flash('success', `Welcome back, ${req.user.name}!`);
        res.redirect('/scholarship');
    }
);

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out successfully.');
        res.redirect('/login');
    });
});

module.exports = router;