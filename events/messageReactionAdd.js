// events/messageReactionAdd.js
const { addBerries, getBerries } = require("../bounty.js");

// Map për cooldown
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
      const currentBerries = await getBerries(userId);
      let berriesToAdd = 5; // default

      // 🔹 Option 1: step-based scaling
      if (currentBerries > 5000 && currentBerries <= 10000) {
        berriesToAdd = 4;
      } else if (currentBerries > 10000 && currentBerries <= 20000) {
        berriesToAdd = 3;
      } else if (currentBerries > 20000 && currentBerries <= 50000) {
        berriesToAdd = 2;
      } else if (currentBerries > 50000) {
        berriesToAdd = 1;
      }

      // 🔹 Option 2: formula-based scaling (comment out above if you prefer this)
      // berriesToAdd = Math.max(1, 5 - Math.floor(currentBerries / 5000));

      await addBerries(userId, berriesToAdd, reaction.message.channel);
      lastReactionTimes.set(userId, currentTime);
    }
  },
};
