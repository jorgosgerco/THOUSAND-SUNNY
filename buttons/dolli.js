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

// Kjo map do të ruajë kohën e fundit të klikimit
const lastDolliTimes = new Map();

module.exports = {
  data: {
    name: "dolli",
  },
  async execute(interaction) {
    // Kjo siguron që boti të mos ngecë kur klikohet butoni
    await interaction.deferUpdate();

    const clicker = interaction.member;
    const bountyUserId = interaction.customId.split(":")[1];

    // Kontrolli i cooldown-it për klikuesin
    const currentTime = Date.now();
    const lastTime = lastDolliTimes.get(clicker.id) || 0;
    const cooldownAmount = 30 * 1000; // 30 sekonda në milisekonda

    if (currentTime - lastTime < cooldownAmount) {
      const remainingTime = Math.ceil((cooldownAmount - (currentTime - lastTime)) / 1000);
      return interaction.followUp({
        content: `Duhet të presësh ${remainingTime} sekonda përpara se të ngresh një dolli tjetër!`,
        ephemeral: true,
      });
    }

    let bountyUser;
    try {
      bountyUser = await interaction.guild.members.fetch(bountyUserId);
    } catch (e) {
      return interaction.followUp({
        content: "Nuk u gjet personi për të ngrerë dolli 😅",
        ephemeral: true,
      });
    }

    // Kontroll për vetveten
    if (clicker.id === bountyUser.id) {
      return interaction.followUp({
        content: "Dikush tjetër duhet të ngre dolli për ty 🍺",
        ephemeral: true,
      });
    }

    // Shtimi i pikëve dhe vendosja e kohës së fundit të klikimit
    await addBerries(clicker.id, 5, interaction.channel);
    await addBerries(bountyUser.id, 5, interaction.channel);
    lastDolliTimes.set(clicker.id, currentTime);

    // Mesazh publik i personalizuar
    const messageTemplate = dolliMessages[Math.floor(Math.random() * dolliMessages.length)];
    const message = messageTemplate
      .replace("{0}", clicker.toString())
      .replace("{1}", bountyUser.toString());

    // Dërgo mesazhin publikisht në kanal
    await interaction.channel.send(message);
  },
};