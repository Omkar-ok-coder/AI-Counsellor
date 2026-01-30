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

// 1. CORS Configuration - Ensure it matches your vercel.json headers
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

// 2. Health Check Route
app.get('/api', (req, res) => {
    res.status(200).json({ message: 'AI Counsellor API is running...' });
});

// 3. Mount Routes - Ensure these match your frontend NEXT_PUBLIC_API_URL
// If your frontend calls /api/auth/login, keep the '/api' prefix here
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/ai', aiRoutes);

// 4. Serverless-Friendly Database Connection
// We connect on every request but the driver caches the connection
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection failed:", error);
        res.status(500).json({ error: "Database connection error" });
    }
});

// 5. Local Development Listener
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}

// 6. Export for Vercel Serverless
module.exports = app;