// utils/bountyResponse.js
const { EmbedBuilder, AttachmentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { createBountyPoster } = require("../bountyPoster.js");
const { getBerries } = require("../bounty.js");

// Funksioni që krijon dhe kthen të gjithë komponentët e bounty
async function createBountyMessage(member, channel) {
  const userBerries = await getBerries(member.id);

  const bountyPoster = await createBountyPoster(member, userBerries);

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

  const attachment = new AttachmentBuilder(bountyPoster.attachment, { name: bountyPoster.name });

  return {
    embeds: [bountyEmbed],
    files: [attachment],
    components: [row]
  };
}

module.exports = { createBountyMessage };