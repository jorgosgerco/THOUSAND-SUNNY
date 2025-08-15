// buttons/dolli.js
const { addBerries } = require("../bounty.js");

const dolliMessages = [
  "{0} e fton {1} në Grand Line për një dolli 🍻!",
  "{0} ngre dolli me {1} duke thënë: 'Për aventurën tonë!'",
  "{0} dhe {1} shtrëngojnë gotat në Sunny 🍺",
  "{0} fton {1} në një toast për 'One Piece Forever!'",
  "{0} ngre dolli dhe thotë: 'Le të shkojmë drejt Skarlet Line!' për {1}",
  "{0} dhe {1} shijojnë një birrë në Thousand Sunny 🍻",
  "{0} thotë: 'Le të festojmë fitoren!' dhe ngre dolli me {1}",
  "{0} ngre gotën për {1} dhe thotë: 'Për Luffy dhe ekuipazhin!'",
  "{0} fton {1} në një dolli nën Shenjën e Jolly Roger 🏴‍☠️",
  "{0} thotë: 'Për të gjetur One Piece!' dhe ngre dolli me {1}",
  "{0} dhe {1} bëjnë një toast duke parë oqeanin e Grand Line 🌊",
  "{0} e thërret {1}: 'Ej, bashkohuni me mua për një birrë në Sunny!' 🍺",
  "{0} ngre dolli me {1} dhe thotë: 'Të gjitha aventurat na presin!'",
  "{0} fton {1} në një toast për Shanks dhe ekuipazhin e tij 🏴‍☠️",
  "{0} dhe {1} bëjnë dolli për Skypiea dhe qiellin e pafund 🌤️",
  "{0} thotë: 'Për thesarët dhe Devil Fruits!' dhe ngre dolli me {1}",
  "{0} dhe {1} ngrejnë gotat në Thousand Sunny duke qeshur 😄",
  "{0} fton {1} në një toast për të kapur të gjitha Devil Fruits 🍇",
  "{0} thotë: 'Për vullnetin e D!' dhe ngre dolli me {1}",
  "{0} ngre dolli me {1} duke thënë: 'Për ShqipCinema dhe aventurat anime! 🎬🍻'"
];

module.exports = {
  data: {
    name: "dolli",
  },
  async execute(interaction) {
    const clicker = interaction.member;
    const bountyUserId = interaction.customId.split(":")[1];

    let bountyUser;
    try {
      bountyUser = await interaction.guild.members.fetch(bountyUserId);
    } catch (e) {
      console.error("Nuk u gjet përdoruesi i bounty:", e);
      return interaction.reply({ 
        content: "Nuk u gjet personi për të ngre dolli 😅", 
        ephemeral: true 
      });
    }

    // Kontroll për vetveten
    if (clicker.id === bountyUser.id) {
      return interaction.reply({ 
        content: "Dikush tjetër duhet të ngre dolli për ty 🍺", 
        ephemeral: true 
      });
    }

    // Mesazh publik i personalizuar
    const messageTemplate = dolliMessages[Math.floor(Math.random() * dolliMessages.length)];
    const message = messageTemplate
      .replace("{0}", clicker.toString())
      .replace("{1}", bountyUser.toString());

    // Shto pikët
    await addBerries(clicker.id, 5);
    await addBerries(bountyUser.id, 5);

    // Dërgo mesazhin publikisht në kanal, jo me reply
    await interaction.channel.send(message);

    // Përgjigje bosh për të mbyllur interaction
    if (interaction.deferred || interaction.replied) {
      // nëse është deferuar më parë, mos bë asgjë
    } else {
      await interaction.deferUpdate();
    }
  },
};