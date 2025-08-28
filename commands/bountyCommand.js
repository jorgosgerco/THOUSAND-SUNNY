// bounty.js
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
        // Log the start of the command execution
        console.log(`[LOG] Starting bounty command execution for user: ${interaction.user.tag}`);

        const user = interaction.options.getUser("user") || interaction.user;
        const member = interaction.guild?.members.cache.get(user.id);

        await interaction.deferReply();

        try {
            // Log the start of the bounty message creation
            console.log(`[LOG] Creating bounty message payload for user ID: ${user.id}`);

            const messagePayload = await createBountyMessage(member || user);

            // Log a successful message payload creation
            console.log(`[LOG] Successfully created message payload. Replying to interaction.`);

            await interaction.editReply(messagePayload);

        } catch (error) {
            // Log any errors that occur
            console.error(`[ERROR] Gabim gjatë ekzekutimit të komandës 'bounty':`, error);

            await interaction.editReply("Pati një gabim të papritur!");
        }
    },
};