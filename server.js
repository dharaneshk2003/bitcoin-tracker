require('dotenv').config();
const express = require('express');
const mongoose = require('./src/config/db');
const cryptoRoutes = require('./src/routes/cryptoRoutes');
const { startScheduler } = require('./src/utils/scheduler');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', cryptoRoutes);

// Start Scheduler
startScheduler();

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
