// commands/bountyCommand.js
const { SlashCommandBuilder } = require("discord.js");
const { createBountyMessage } = require("../utils/bountyResponse.js");

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
        // Deferring the reply as the first action to prevent timeout.
        await interaction.deferReply();

        try {
            // Get the user from the command option, or default to the interaction user.
            const user = interaction.options.getUser("user") || interaction.user;
            const member = interaction.guild?.members.cache.get(user.id);
            
            const messagePayload = await createBountyMessage(member || user);

            if (messagePayload) {
                await interaction.editReply(messagePayload);
            } else {
                await interaction.editReply("Pati një gabim gjatë krijimit të posterit! Ju lutem provoni përsëri më vonë.");
            }

        } catch (error) {
            console.error(`Gabim gjatë ekzekutimit të komandës 'bounty':`, error);
            if (!interaction.deferred && !interaction.replied) {
                await interaction.reply("Pati një gabim të papritur!");
            } else {
                await interaction.editReply("Pati një gabim të papritur!");
            }
        }
    },
};