// events/penalty.js
const { Events } = require('discord.js');
const { applyPenalties } = require('../bounty.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const checkInterval = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

        const checkForPenalties = async () => {
            console.log('Duke kontrolluar per perdorues inaktive...');
            await applyPenalties();
        };

        // This will run the function for the first time after 24 hours,
        // and then continue to run it every 24 hours thereafter.
        setInterval(checkForPenalties, checkInterval);

        console.log('Penalty check scheduled to run every 24 hours.');
    }
};