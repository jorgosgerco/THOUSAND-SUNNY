// events/messageCreate.js
const { addBerries, getBerries } = require("../bounty.js");

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    const userId = message.author.id;
    const currentTime = Date.now();
    const lastTime = message.client.lastMessageTimes.get(userId) || 0; // Kjo merr te dhenat nga klienti

    if (currentTime - lastTime > 30000) {
      const currentBerries = await getBerries(userId);
      let berriesToAdd = 10;

      if (currentBerries > 5000) {
        berriesToAdd = 8;
      }

      await addBerries(userId, berriesToAdd, message.channel);
      message.client.lastMessageTimes.set(userId, currentTime);
    }
  },
};