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

// 1. ADVANCED CORS
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true
}));

app.use(express.json());

// 2. DATABASE MIDDLEWARE - Critical for Serverless Handshake
app.use(async (req, res, next) => {
    try {
        // Ensure the connection is fully established before proceeding
        await connectDB(); 
        next();
    } catch (error) {
        console.error("Critical: Database connection failed in middleware:", error);
        return res.status(500).json({ 
            error: "Database Connection Error", 
            details: error.message 
        });
    }
});

// 3. HEALTH CHECK & BASE ROUTES
app.get('/api', (req, res) => {
    res.status(200).json({ status: 'success', message: 'AI Counsellor API is live!' });
});

// 4. MOUNT ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/ai', aiRoutes);

// 5. CATCH-ALL 404
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found on this server` });
});

// 6. LOCAL DEVELOPMENT LISTENER
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}

// 7. EXPORT FOR VERCEL
module.exports = app;