// events/penalty.js
const { Events } = require('discord.js');
const { applyPenalties } = require('../bounty.js');

let hasExecuted = false;

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        if (hasExecuted) return;
        hasExecuted = true;

        const checkInterval = 24 * 60 * 60 * 1000; // 24 ore ne milisekonda

        const checkForPenalties = async () => {
            console.log('Duke kontrolluar per perdorues inaktive...');
            await applyPenalties();
        };

        // Nis kontrollin per here te pare
        checkForPenalties();

        // Vendos nje interval per te kontrolluar cdo 24 ore
        setInterval(checkForPenalties, checkInterval);
    }
};