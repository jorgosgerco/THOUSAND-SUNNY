// events/penalty.js
const { Events } = require('discord.js');
const { applyPenalties } = require('../bounty.js');

// hasExecuted isn't needed here

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const checkInterval = 24 * 60 * 60 * 1000; // 24 ore ne milisekonda

        const checkForPenalties = async () => {
            console.log('START: Duke kontrolluar per perdorues inaktive...');
            try {
                await applyPenalties();
                console.log('SUCCESS: Kontrolli per perdorues inaktive ka perfunduar me sukses.');
            } catch (error) {
                console.error('ERROR: Nje gabim ndodhi gjate ekzekutimit te penalltive:', error);
            }
            console.log('END: Kontrolli i penalltive u mbyll.');
        };

        // This will run the function for the first time after 24 hours,
        // and then continue to run it every 24 hours thereafter.
        // For testing purposes, you can uncomment the line below to run it immediately
        // checkForPenalties(); 
        
        setInterval(checkForPenalties, checkInterval);

        console.log('Penalltite jane te planifikuara te ekzekutohen cdo 24 ore.');
    }
};