require('dotenv').config();

const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const app = express();
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

const port = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
    cors({
        origin: [
            'http://localhost:3002',
            'https://team-cse341.onrender.com'
        ],
        credentials: true
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'mysecretkey',
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: false,
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'lax'
        },
        name: 'sessionId'
    })
);

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport');

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log(`  - Session ID: ${req.sessionID}`);
    console.log(`  - Authenticated: ${req.isAuthenticated ? req.isAuthenticated() : false}`);
    console.log(`  - User: ${req.user ? req.user.id : 'undefined'}`);
    next();
});

app.use('/', require('./routes/index'));

app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        message: 'Internal server error',
        error: err.message
    });
});

mongodb.initDb((err) => {
    if (err) {
        console.log('❌ Database initialization error:', err);
        process.exit(1);
    } else {
        app.listen(port, () => {
            console.log(`✅ Server running on port ${port}`);
        });
    }
});