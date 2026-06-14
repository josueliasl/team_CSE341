const router = require('express').Router();

// Debug: Log when index.js loads
console.log("📡 Loading index.js routes");

router.use('/', require('./swagger'));

router.get('/', (req, res) => {
    //#swagger.tags=['Final Project']
    res.send('Final Project');
});

router.get('/debug', (req, res) => {
    res.json({
        message: "Routes working",
        authRoutes: "/auth/github exists",
        session: req.session ? "Session active" : "No session",
        authenticated: req.isAuthenticated ? req.isAuthenticated() : "Passport not initialized"
    });
});

// Check if these modules exist
console.log("Loading route modules...");
console.log("- authors module:", require.resolve('./authors'));
console.log("- books module:", require.resolve('./books'));
console.log("- users module:", require.resolve('./users'));
console.log("- libraries module:", require.resolve('./libraries'));
console.log("- auth module:", require.resolve('./auth'));

router.use('/authors', require('./authors'));
router.use('/books', require('./books'));
router.use('/users', require('./users'));
router.use('/libraries', require('./libraries'));
router.use('/auth', require('./auth'));

console.log("✅ All routes mounted successfully");

module.exports = router;