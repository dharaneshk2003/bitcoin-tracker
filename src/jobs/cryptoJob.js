const axios = require('axios');
const CryptoStats = require('../models/CryptoStats');

async function updateCryptoData() {
    try {
        const response = await axios.get(
            `https://api.coingecko.com/api/v3/simple/price`,
            {
                params: {
                    ids: 'bitcoin,ethereum,matic-network',
                    vs_currencies: 'usd',
                    include_market_cap: true,
                    include_24hr_change: true,
                },
            }
        );

        const data = response.data;

        for (const [coin, stats] of Object.entries(data)) {
            await CryptoStats.create({
                coin,
                price: stats.usd,
                marketCap: stats.usd_market_cap,
                change24h: stats.usd_24h_change,
            });
            console.log(`Saved data for ${coin}`);
        }
    } catch (error) {
        console.error('Error fetching data from CoinGecko:', error.message);
    }
}

module.exports = { updateCryptoData };
