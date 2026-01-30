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

// Connect to Database
// Note: In serverless, we call this inside routes/handlers, but calling it here initiates the promise
connectDB();

const app = express();

app.use(cors({
    origin: "*", // Simplify for initial deployment; restrict in production if needed
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/ai', aiRoutes);

const PORT = process.env.PORT || 5000;

// Only listen if running locally (not exported)
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Export for Vercel
module.exports = app;