import express from "express";
import ViteExpress from "vite-express";
import authRoutes from "./routes/auth.js"; // Import the module
import accountInfoRoutes from "./routes/account-info.js"; // Preload account-info routes

const app = express();
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); // All routes in auth.js will start with /api/auth
app.use("/api/account-info", accountInfoRoutes); // Dynamic import for account-info routes

// Your existing search route can stay here or move to a routes/character.js later
app.get("/api/search/:name", async (req, res) => {
    // search logic...
});

ViteExpress.listen(app, 3000, () => console.log("🚀 Server running on http://localhost:3000"));