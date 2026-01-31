require('dotenv').config(); // MUST be the first line
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const universityRoutes = require('./routes/universityRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

// 1. CORS
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
    credentials: true
}));

app.use(express.json());

// 2. DATABASE MIDDLEWARE
app.use(async (req, res, next) => {
    try {
        console.log(`Incoming Request: ${req.method} ${req.path}`); // Verification log
        await connectDB(); 
        next();
    } catch (error) {
        console.error("Database connection failed in middleware:", error);
        return res.status(500).json({ error: "Database Error", details: error.message });
    }
});

// 3. ROUTES
app.get('/api', (req, res) => {
    res.status(200).json({ status: 'success', message: 'API is live!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/ai', aiRoutes);

// 4. CATCH-ALL 404
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// 5. LISTENER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running locally on http://localhost:${PORT}`);
});

module.exports = app;