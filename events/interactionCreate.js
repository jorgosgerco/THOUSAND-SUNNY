// events/interactionCreate.js
const { InteractionType } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        // Check if the interaction is a slash command
        if (interaction.isCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }

        // Check if the interaction is a button
        if (interaction.isButton()) {
            // Split the customId to handle buttons with dynamic IDs (e.g., "dolli:1234")
            const [buttonName, ...args] = interaction.customId.split(':');
            const button = interaction.client.buttons.get(buttonName);

            if (!button) {
                console.error(`No button matching ${buttonName} was found.`);
                return;
            }

            try {
                // Pass the button arguments to the execute function
                await button.execute(interaction, args);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this button!', ephemeral: true });
            }
        }
    },
};