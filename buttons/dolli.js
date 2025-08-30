// buttons/dolli.js
const { updateBounty } = require("../bounty.js");

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

// This map will store the last click time for cooldown
const lastDolliTimes = new Map();

module.exports = {
    data: {
        name: "dolli",
    },
    async execute(interaction, args) {
        const bountyUserId = args[0];
        const clicker = interaction.member;

        // Cooldown control for the user
        const currentTime = Date.now();
        const lastTime = lastDolliTimes.get(clicker.id) || 0;
        const cooldownAmount = 30 * 1000; // 30 seconds

        if (currentTime - lastTime < cooldownAmount) {
            const remainingTime = Math.ceil((cooldownAmount - (currentTime - lastTime)) / 1000);
            return interaction.reply({
                content: `Duhet të presësh ${remainingTime} sekonda përpara se të ngresh një dolli tjetër!`,
                ephemeral: true,
            });
        }

        const bountyUser = interaction.guild.members.cache.get(bountyUserId);

        // Check if the user is trying to toast themselves
        if (clicker.id === bountyUser?.id) {
            return interaction.reply({
                content: "🍻 Dikush tjeter duhet te ngre dolli me ty",
                ephemeral: true,
            });
        }

        // Check if the person to toast was not found
        if (!bountyUser) {
            return interaction.reply({
                content: "🍻 Nuk u gjet personi.",
                ephemeral: true,
            });
        }

        const dolliAmount = 5;

        try {
            // Update both the clicker's and the bounty user's berries
            await updateBounty(clicker.id, dolliAmount);
            await updateBounty(bountyUser.id, dolliAmount);
            lastDolliTimes.set(clicker.id, currentTime);

            // Public personalized message
            const messageTemplate = dolliMessages[Math.floor(Math.random() * dolliMessages.length)];
            const message = messageTemplate
                .replace("{0}", clicker.toString())
                .replace("{1}", bountyUser.toString());

            await interaction.reply({ content: message });
        } catch (error) {
            console.error("Gabim gjatë ekzekutimit të dolli:", error);
            await interaction.reply({ content: "Ndodhi një gabim gjatë ekzekutimit të këtij butoni!", ephemeral: true });
        }
    },
};