require('dotenv').config();

// DNS fix for Windows
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const app = express();
const mongodb = require('./data/database');
const bodyParser = require('body-parser');
const session = require("express-session");
const passport = require("passport");

const port = process.env.PORT || 3002;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware - CRITICAL: Must be configured properly
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'mysecretkey',
        resave: false,
        saveUninitialized: true,  // Set to true to ensure session is created
        cookie: {
            secure: false,  // false for HTTP, true for HTTPS
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            httpOnly: true,
            sameSite: 'lax'
        },
        name: 'sessionId'  // Custom session cookie name
    })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Load passport configuration
require("./config/passport");

// CORS middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3002');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

// Debug middleware to log authentication status
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log(`  - Session ID: ${req.sessionID}`);
    console.log(`  - Authenticated: ${req.isAuthenticated ? req.isAuthenticated() : false}`);
    console.log(`  - User: ${req.user ? req.user.id : 'undefined'}`);
    next();
});

// Routes
app.use('/', require('./routes/index'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Database initialization
mongodb.initDb((err) => {
    if (err) {
        console.log('❌ Database initialization error:', err);
        process.exit(1);
    } else {
        app.listen(port, () => {
            console.log(`✅ Server running on port ${port}`);
            console.log(`📚 Swagger UI: http://localhost:${port}/api-docs`);
            console.log(`🔐 GitHub Auth: http://localhost:${port}/auth/github`);
            console.log(`🧪 Test auth: http://localhost:${port}/auth/test`);
            console.log(`🔍 Auth status: http://localhost:${port}/auth/status`);
        });
    }
});