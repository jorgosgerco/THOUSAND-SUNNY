// events/penalty.js
const { Events } = require('discord.js');
const { applyPenalties } = require('../bounty.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        const checkInterval = 24 * 60 * 60 * 1000;

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
        
        setInterval(checkForPenalties, checkInterval);

        console.log('Penalltite jane te planifikuara te ekzekutohen cdo 24 ore.');
    }
};