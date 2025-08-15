// buttons/logpose.js
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: {
    name: "bounty_log_pose",
  },
  async execute(interaction) {
    // Krijimi i embed-it me ID-në e saktë të emoji-t
    const embed = new EmbedBuilder()
      .setTitle("🧭 LogPose")
      .setDescription(
        "Mirë se erdhe në anijen tonë të Komunitetit **ShqipCinema 👒**!\n\n" +
        "🏴‍☠️ | <#1280616378486755378>\n" +
        "🏴‍☠️ | <#1147640602557685952>\n" +
        "🏴‍☠️ | <#1148977859856183388>\n" +
        "🏴‍☠️ | <#1136334194218389685>\n" +
        "🏴‍☠️ | <#1156592067984760872>\n" +
        "🏴‍☠️ | <#1149654948041212025>\n" +
        "<:shqipcinema:1402661462756954212> | https://shqipcinema.info/\n\n" +
        "_Nuk ka rëndësi destinacioni, por udhëtimi!_ 🌊"
      )
      .setImage("https://c.tenor.com/wEP-YHFtBLYAAAAC/tenor.gif")
      .setColor("Gold");

    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};