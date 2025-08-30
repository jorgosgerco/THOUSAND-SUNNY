// events/messageCreate.js
const { updateBounty, getBerries } = require("../bounty.js");

const lastMessageTimes = new Map();
const COOLDOWN_SECONDS = 30; // 30-second cooldown

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        const userId = message.author.id;
        const currentTime = Date.now();
        const lastTime = lastMessageTimes.get(userId) || 0;
        const cooldownAmount = COOLDOWN_SECONDS * 1000;

        if (currentTime - lastTime > cooldownAmount) {
            const userData = await getBerries(userId);
            const currentBerries = userData ? userData.berries : 0; 
            let berriesToAdd = Math.max(2, 10 - Math.floor(currentBerries / 5000));

            await updateBounty(userId, berriesToAdd);
            
            lastMessageTimes.set(userId, currentTime);
        }
    },
};