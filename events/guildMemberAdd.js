// events/guildMemberAdd.js
const { createBountyMessage } = require("../utils/bountyResponse.js");
const welcomeMessages = require("../welcome_messages.js");

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    console.log(`[LOG] Anëtar i ri u fut: ${member.user.tag}`); // Shiko nëse ky rresht ekzekutohet
    try {
      const channelId = "1136334194218389685";
      const channel = member.guild.channels.cache.get(channelId);
      if (!channel) {
        console.log(`[GABIM] Kanali me ID ${channelId} nuk u gjet.`);
        return;
      }
      console.log(`[LOG] Kanali i mirëseardhjes u gjet: ${channel.name}`); // Shiko nëse ky rresht ekzekutohet
      
      const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
      const randomMessage = welcomeMessages[randomIndex].replace(/@nickname/g, `<@${member.id}>`);

      const messagePayload = await createBountyMessage(member);

      await channel.send({
        content: randomMessage,
        embeds: messagePayload.embeds,
        files: messagePayload.files,
        components: messagePayload.components,
      });

      console.log(`[LOG] Mesazhi i mirëseardhjes u dërgua me sukses.`); // Shiko nëse ky rresht ekzekutohet
    } catch (err) {
      console.error("Gabim gjatë eventit guildMemberAdd:", err);
    }
  },
};