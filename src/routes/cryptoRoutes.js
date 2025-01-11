const express = require('express');
const CryptoStats = require('../models/CryptoStats');
const router = express.Router();

// Get latest stats for a cryptocurrency
router.get('/stats', async (req, res) => {
    const { coin } = req.query;

    if (!coin) {
        return res.status(400).json({ error: 'Coin query parameter is required' });
    }

    try {
        const cryptoData = await CryptoStats.findOne({ coin }).sort({ createdAt: -1 });
        if (!cryptoData) {
            return res.status(404).json({ error: 'Data not found' });
        }

        res.json({
            price: cryptoData.price,
            marketCap: cryptoData.marketCap,
            '24hChange': cryptoData.change24h,
        });
    } catch (error) {
        console.error('Error fetching stats:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get price standard deviation for a cryptocurrency
router.get('/deviation', async (req, res) => {
    const { coin } = req.query;

    if (!coin) {
        return res.status(400).json({ error: 'Coin query parameter is required' });
    }

    try {
        const cryptoData = await CryptoStats.find({ coin })
            .sort({ createdAt: -1 })
            .limit(100);

        if (cryptoData.length === 0) {
            return res.status(404).json({ error: 'Data not found' });
        }

        const prices = cryptoData.map((item) => item.price);
        const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
        const variance =
            prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length;
        const deviation = Math.sqrt(variance);

        res.json({ deviation: deviation.toFixed(2) });
    } catch (error) {
        console.error('Error calculating deviation:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
