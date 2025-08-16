const { SlashCommandBuilder } = require("discord.js");
const { createBountyMessage } = require("../utils/bountyResponse.js"); // Funksioni që gjeneron bounty

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bounty")
    .setDescription("Shiko bounty e një anëtari")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("Zgjidh anëtarin")
        .setRequired(false)
    ),

  async execute(interaction) {
    // Merr user-in ose përdoruesin që ekzekuton komandën
    const user = interaction.options.getUser("user") || interaction.user;

    // Mund të marrësh edhe member nëse është në guild
    const member = interaction.guild?.members.cache.get(user.id);

    // Njofton Discord që do të përgjigjesh pas pak
    await interaction.deferReply();

    try {
      // Gjenero payload-in e mesazhit
      const messagePayload = await createBountyMessage(member || user);

      // Dërgo përgjigjen
      await interaction.editReply(messagePayload);

    } catch (error) {
      console.error("Gabim gjatë ekzekutimit të komandës:", error);

      // Jep një përgjigje fallback (pa ephemeral që të mos ngecë)
      await interaction.editReply("Pati një gabim të papritur!");
    }
  },
};