// deploy-commands.js
const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
require("dotenv").config();

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] Komanda te ${filePath} i mungon 'data' ose 'execute'.`);
        }
    }
}

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`Po filloj të regjistroj ${commands.length} komanda aplikacioni.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log(`U regjistruan ${data.length} komanda aplikacioni.`);
    } catch (error) {
        console.error(error);
    }
})();