// events/messageCreate.js
const { addBerries } = require("../bounty.js");

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
      await addBerries(userId, 10);
      lastMessageTimes.set(userId, currentTime);
    }
  },
};