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
    // Shtojmë këtë rresht, i cili menjëherë i përgjigjet Discord-it
    await interaction.deferReply({ ephemeral: true }); // Bëjmë defer ephemeral që mesazhi i ardhshëm të jetë privat
    
    const clicker = interaction.member;
    const customId = interaction.customId;

    const bountyUserId = customId.split(":")[1];

    let bountyUser;
    try {
      bountyUser = await interaction.guild.members.fetch(bountyUserId);
    } catch (e) {
      console.error("Nuk u gjet përdoruesi i bounty:", e);
      return interaction.editReply({ content: "Nuk u gjet personi për të ngre dolli 😅" });
    }

    if (clicker.id === bountyUser.id) {
      // Përdorim editReply sepse `deferReply` ishte i vetëm
      return interaction.editReply({ content: "Dikush tjetër duhet të ngre dolli për ty 🍺" });
    }

    const randomIndex = Math.floor(Math.random() * dolliMessages.length);
    const messageTemplate = dolliMessages[randomIndex];
    const message = messageTemplate.replace("{0}", clicker.toString()).replace("{1}", bountyUser.toString());

    await addBerries(clicker.id, 5);
    await addBerries(bountyUser.id, 5);

    // Këtu, do të përdorim `followUp` sepse mesazhi është publik
    await interaction.followUp({ content: message, ephemeral: false }); 
  },
};