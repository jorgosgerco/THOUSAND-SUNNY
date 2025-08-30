// utils/bountyResponse.js
const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { createBountyPoster } = require("../bountyPoster.js");
const { getBerries } = require("../bounty.js");

async function createBountyMessage(member) {
    // FIX: Ensure we are passing the member's ID to getBerries
    const userData = await getBerries(member.id);

    // This is the line that fixes the 'null' in the message title.
    const userBerries = userData ? userData.berries : 0; 

    const bountyPoster = await createBountyPoster(member, userBerries);

    if (!bountyPoster) {
      console.error("Gabim: Poster u kthye null. Nuk mund të dërgoj mesazhin.");
      return null;
    }

    const bountyEmbed = new EmbedBuilder()
        .setTitle(`🎯 Marine ka vlerësuar kokën e ${member.displayName} me një total prej ${userBerries} berries! 🏴‍☠️`)
        .setImage("attachment://bounty.png")
        .setColor("Gold");

    const dolliButton = new ButtonBuilder()
        .setLabel("🍻 Dolli")
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`dolli:${member.id}`);

    const logPoseButton = new ButtonBuilder()
        .setLabel("🧭 Log Pose")
        .setStyle(ButtonStyle.Success)
        .setCustomId("bounty_log_pose");

    const row = new ActionRowBuilder()
        .addComponents(dolliButton, logPoseButton);

    const attachment = bountyPoster;

    return {
        embeds: [bountyEmbed],
        files: [attachment],
        components: [row]
    };
}

module.exports = { createBountyMessage };