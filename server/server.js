const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const universityRoutes = require('./routes/universityRoutes');
const aiRoutes = require('./routes/aiRoutes');

dotenv.config();

const app = express();

// 1. ADVANCED CORS - Handles "Preflight" OPTIONS requests to prevent 405 errors
app.use(cors({
    origin: "*", // For development; in production, use your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true
}));

app.use(express.json());

// 2. DATABASE MIDDLEWARE - Critical for Serverless
// This ensures the DB is connected for every request without leaking connections
app.use(async (req, res, next) => {
    try {
        await connectDB(); // Ensure your connectDB function checks 'readyState' to avoid duplicate connections
        next();
    } catch (error) {
        console.error("Database connection failed:", error);
        return res.status(500).json({ error: "Internal Server Database Error" });
    }
});

// 3. HEALTH CHECK & BASE ROUTES
// Root /api route to verify backend is live
app.get('/api', (req, res) => {
    res.status(200).json({ status: 'success', message: 'AI Counsellor API is running...' });
});

// 4. MOUNT ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/ai', aiRoutes);

// 5. CATCH-ALL 404
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// 6. LOCAL DEVELOPMENT LISTENER
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

// 7. EXPORT FOR VERCEL
module.exports = app;