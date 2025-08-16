// events/bountyMilestone.js
const { Events } = require("discord.js");
const { createBountyMessage } = require("../utils/bountyResponse.js");

const achievementMessages = [
    "{user} sapo ka grumbulluar {berries} Berries! Ekuipazhi po feston në Thousand Sunny!",
    "Marina po të kërkon {user}! Bounty jot është rritur në {berries} Berries!",
    "Luffy e ka dëgjuar për arritjen tënde! {user} sapo arriti {berries} Berries!",
    "Mbledhja e thesarit po shkon mirë! {user} sapo arriti {berries} Berries!"
];

module.exports = {
    // Kjo eshte vetem per lexim, nuk eshte nje event i vertete i Discord.js
    name: "bountyMilestone", 
    async execute(client, user, newBerries, channel) {
        // Zgjidh një mesazh të rastësishëm
        const userMention = user.toString();
        const randomIndex = Math.floor(Math.random() * achievementMessages.length);
        const randomMessage = achievementMessages[randomIndex]
            .replace("{user}", userMention)
            .replace("{berries}", newBerries);

        // Krijon posterin e bounty me te dhenat e reja
        const messagePayload = await createBountyMessage(user, channel);

        // Dërgon mesazhin dhe posterin në kanal
        if (channel) {
            await channel.send({ content: randomMessage, embeds: messagePayload.embeds, files: messagePayload.files, components: messagePayload.components });
        }
    },
};