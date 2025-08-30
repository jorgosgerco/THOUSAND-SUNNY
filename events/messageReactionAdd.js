// events/messageReactionAdd.js
const { updateBounty, getBerries } = require("../bounty.js");

const lastReactionTimes = new Map();

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user) {
        if (user.bot) return;
        if (reaction.partial) await reaction.fetch();

        const userId = user.id;
        const currentTime = Date.now();
        const lastTime = lastReactionTimes.get(userId) || 0;

        if (currentTime - lastTime > 10000) {
            const userData = await getBerries(userId);
            // This is the fix to prevent crashing for new users
            const currentBerries = userData ? userData.berries : 0;
            
            let berriesToAdd = 5;

            if (currentBerries > 5000 && currentBerries <= 10000) {
                berriesToAdd = 4;
            } else if (currentBerries > 10000 && currentBerries <= 20000) {
                berriesToAdd = 3;
            } else if (currentBerries > 20000 && currentBerries <= 50000) {
                berriesToAdd = 2;
            } else if (currentBerries > 50000) {
                berriesToAdd = 1;
            }

            await updateBounty(userId, berriesToAdd, reaction.message.channel);
            lastReactionTimes.set(userId, currentTime);
        }
    },
};