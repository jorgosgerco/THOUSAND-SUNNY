// delete-commands.js
const { REST, Routes } = require("discord.js");
require("dotenv").config();

// Këtu vendos ID-në e botit tënd
const CLIENT_ID = process.env.CLIENT_ID;
// Këtu vendos ID-në e serverit ku ke dy komandat
const GUILD_ID = process.env.GUILD_ID;

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Duke fshirë të gjitha komandat e serverit...');

        await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: [] },
        );

        console.log('Komandat u fshinë me sukses!');
    } catch (error) {
        console.error(error);
    }
})();