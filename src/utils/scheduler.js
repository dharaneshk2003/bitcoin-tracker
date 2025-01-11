const cron = require('node-cron');
const { updateCryptoData } = require('../jobs/cryptoJob');

function startScheduler() {
    console.log('Scheduler started');
    cron.schedule('0 */2 * * *', updateCryptoData); // Runs every 2 hours
    updateCryptoData(); // Run immediately on start
}

module.exports = { startScheduler };
