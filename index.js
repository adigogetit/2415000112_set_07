const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const flash = require('connect-flash');
const methodOverride = require('method-override');

const User = require('./models/User');
const authRoutes = require('./routes/auth');
const scholarshipRoutes = require('./routes/scholarship');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/web7')
    .then(() => {
        console.log('MongoDB connected')
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err)
    })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(
    session({
        secret: 'web7-secret-key',
        resave: false,
        saveUninitialized: false,
    })
);
app.use(flash());



app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }
            const validPassword = await user.verifyPassword(password);
            if (!validPassword) {
                return done(null, false, { message: 'Incorrect email or password.' });
            }
            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success')[0] || null;
    res.locals.error = req.flash('error')[0] || null;
    next();
});



app.use('/', authRoutes);
app.use('/scholarship', scholarshipRoutes);

app.get('/', (req, res) => {
    res.redirect('/scholarship');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});