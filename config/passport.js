const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;

console.log("📌 Loading passport configuration...");

// Debug: Check environment variables
console.log("GitHub Client ID:", process.env.GITHUB_CLIENT_ID ? "✅ Present" : "❌ MISSING");
console.log("GitHub Client Secret:", process.env.GITHUB_CLIENT_SECRET ? "✅ Present" : "❌ MISSING");

if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
    console.error("❌ ERROR: GitHub credentials missing in .env file!");
    console.error("Please check your .env file has:");
    console.error("GITHUB_CLIENT_ID=your_client_id");
    console.error("GITHUB_CLIENT_SECRET=your_client_secret");
}

// Configure GitHub Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "http://localhost:3002/auth/github/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            console.log("✅ GitHub authentication successful!");
            console.log("Profile ID:", profile.id);
            console.log("Username:", profile.username);
            
            // Create a simple user object
            const user = {
                id: profile.id,
                username: profile.username,
                displayName: profile.displayName || profile.username,
                provider: profile.provider,
                accessToken: accessToken
            };
            
            console.log("User object created:", user);
            return done(null, user);
        }
    )
);

// Serialize user - put user ID into session
passport.serializeUser((user, done) => {
    console.log("🔐 Serializing user:", user.id);
    // Store just the essential info
    done(null, {
        id: user.id,
        username: user.username,
        displayName: user.displayName
    });
});

// Deserialize user - get user data from session
passport.deserializeUser((userData, done) => {
    console.log("🔓 Deserializing user:", userData.id);
    // Return the user data stored in session
    done(null, userData);
});

console.log("✅ Passport configuration loaded");