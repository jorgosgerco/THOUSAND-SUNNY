// events/messageCreate.js
const { addBerries, getBerries } = require("../bounty.js");

// Kjo map do të jetë unike për këtë event
const lastMessageTimes = new Map();

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    const userId = message.author.id;
    const currentTime = Date.now();
    const lastTime = lastMessageTimes.get(userId) || 0;

    if (currentTime - lastTime > 30000) {
      const currentBerries = await getBerries(userId);
      let berriesToAdd = 10;

      if (currentBerries > 5000) {
        berriesToAdd = 8;
      }

      await addBerries(userId, berriesToAdd, message.channel);
      lastMessageTimes.set(userId, currentTime);
    }
  },
};