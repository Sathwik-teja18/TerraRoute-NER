require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Import Routers/Controllers
const accountRoutes = require('./controllers/accountController');
const tripRoutes = require('./controllers/tripController');
const alertRoutes = require('./controllers/alertController');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database Connection
connectDB();

// Health Check Endpoint (Matches frontend checkBackendHealth function)
app.get('/api/health', async (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? 'healthy' : 'disconnected';
    const dbResponse = dbState === 1 ? 'MongoDB Connection Established' : 'MongoDB Connection Failed';

    res.status(200).json({
        backend: 'online',
        uptime: process.uptime(),
        database: dbStatus,
        databaseResponse: dbResponse
    });
});

// API Routes
app.use('/api/accounts', accountRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/analysis', require('./controllers/analysisController'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Smart Transport API running on port ${PORT}`);
});