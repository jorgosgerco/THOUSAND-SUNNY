// events/messageReactionAdd.js
const { addBerries } = require("../bounty.js");

// Kjo map do të jetë unike për këtë event
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
      await addBerries(userId, 5);
      lastReactionTimes.set(userId, currentTime);
    }
  },
};