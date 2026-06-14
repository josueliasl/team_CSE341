const router = require("express").Router();
const passport = require("passport");

console.log("🔧 Loading auth routes...");

// Test route to verify auth router works
router.get("/test", (req, res) => {
    res.json({
        message: "Auth router is working!",
        timestamp: new Date().toISOString(),
        sessionExists: !!req.session,
        sessionId: req.sessionID
    });
});

// Debug configuration route
router.get("/debug-config", (req, res) => {
    const hasClientId = !!process.env.GITHUB_CLIENT_ID;
    const hasClientSecret = !!process.env.GITHUB_CLIENT_SECRET;

    res.json({
        githubConfigured: hasClientId && hasClientSecret,
        clientIdPresent: hasClientId,
        clientSecretPresent: hasClientSecret,
        callbackUrl: "http://localhost:3002/auth/github/callback",
        sessionInfo: {
            sessionId: req.sessionID,
            sessionExists: !!req.session,
            authenticated: req.isAuthenticated ? req.isAuthenticated() : false
        },
        message: (hasClientId && hasClientSecret) ?
            "✅ GitHub OAuth is configured. Visit /auth/github to authenticate" :
            "❌ GitHub OAuth is NOT configured. Check your .env file"
    });
});

// GitHub authentication route
router.get("/github",
    (req, res, next) => {
        console.log("🚀 Starting GitHub authentication...");
        console.log("Session ID before auth:", req.sessionID);
        next();
    },
    passport.authenticate("github", {
        scope: ["user:email"]
    })
);

// GitHub callback route - THIS IS CRITICAL
router.get("/github/callback",
    (req, res, next) => {
        console.log("📍 GitHub callback received");
        console.log("Session ID in callback:", req.sessionID);
        next();
    },
    passport.authenticate("github", {
        failureRedirect: "/auth/failure",
        failureFlash: false
    }),
    (req, res) => {
        console.log("🎉 GitHub login successful!");
        console.log("User after authentication:", req.user);
        console.log("Session ID after auth:", req.sessionID);
        console.log("Is authenticated:", req.isAuthenticated());

        // Send success HTML page
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Login Successful</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    .success { color: green; }
                    .info { margin-top: 20px; padding: 20px; background: #f0f0f0; border-radius: 5px; }
                    button { padding: 10px 20px; font-size: 16px; margin: 10px; cursor: pointer; }
                    .close-btn { background: #28a745; color: white; border: none; border-radius: 5px; }
                </style>
            </head>
            <body>
                <h1 class="success">✅ Login Successful!</h1>
                <div class="info">
                    <p>Welcome, ${req.user.displayName || req.user.username}!</p>
                    <p>GitHub ID: ${req.user.id}</p>
                    <p>Session ID: ${req.sessionID}</p>
                    <p>You are now authenticated to use the API.</p>
                </div>
                <div>
                    <button onclick="window.location.href='/auth/status'" class="close-btn">Check Auth Status</button>
                    <button onclick="window.location.href='/api-docs'" class="close-btn">Go to API Docs</button>
                    <button onclick="window.close()" class="close-btn">Close Window</button>
                </div>
                <p><small>You can now close this window and use the API with your authenticated session.</small></p>
            </body>
            </html>
        `);
    }
);

// Failure route
router.get("/failure", (req, res) => {
    console.log("❌ GitHub authentication failed");
    res.status(401).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Login Failed</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                .error { color: red; }
                button { padding: 10px 20px; font-size: 16px; margin: 10px; cursor: pointer; }
                .retry-btn { background: #007bff; color: white; border: none; border-radius: 5px; }
            </style>
        </head>
        <body>
            <h1 class="error">❌ Authentication Failed</h1>
            <p>GitHub login was unsuccessful.</p>
            <button onclick="window.location.href='/auth/github'" class="retry-btn">Try Again</button>
        </body>
        </html>
    `);
});

// Logout route
router.get("/logout", (req, res) => {
    const userName = req.user?.displayName || req.user?.username || "User";
    console.log(`Logging out: ${userName}`);

    req.logout((err) => {
        if (err) {
            console.error("Logout error:", err);
            return res.status(500).json({ message: "Logout failed" });
        }
        req.session.destroy((err) => {
            if (err) {
                console.error("Session destruction error:", err);
            }
            res.redirect("/");
        });
    });
});

// Check authentication status
router.get("/status", (req, res) => {
    console.log("Auth status check");
    console.log("- isAuthenticated:", req.isAuthenticated?.());
    console.log("- Session ID:", req.sessionID);
    console.log("- User:", req.user);

    res.json({
        authenticated: req.isAuthenticated ? req.isAuthenticated() : false,
        sessionId: req.sessionID,
        user: req.user ? {
            id: req.user.id,
            username: req.user.username,
            displayName: req.user.displayName
        } : null,
        sessionExists: !!req.session,
        cookiesPresent: !!req.headers.cookie
    });
});

module.exports = router;