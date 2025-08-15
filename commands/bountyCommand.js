// commands/bountyCommand.js
const { SlashCommandBuilder } = require("discord.js");
const { createBountyMessage } = require("../utils/bountyResponse.js"); // E importojmë funksionin e ri

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bounty")
    .setDescription("Shiko bounty e një anëtari")
    .addUserOption(option =>
      option.setName("user")
        .setDescription("Zgjidh anëtarin")
        .setRequired(false)
    ),
  async execute(interaction) {
    const member = interaction.options.getMember("user") || interaction.member;

    await interaction.deferReply();

    try {
      const messagePayload = await createBountyMessage(member);
      await interaction.editReply(messagePayload);

    } catch (error) {
      console.error("Gabim gjatë ekzekutimit të komandës:", error);
      await interaction.editReply({ content: "Pati një gabim të papritur!", ephemeral: true });
    }
  },
};