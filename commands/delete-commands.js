const { REST, Routes } = require("discord.js");
require("dotenv").config();

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

// Më poshtë, zëvendësoni CLIENT_ID me ID-në e botit tuaj
const CLIENT_ID = process.env.CLIENT_ID;

// Kjo eshte komanda per te fshire te gjitha komandat GLOBALE
rest.put(Routes.applicationCommands(CLIENT_ID), { body: [] })
    .then(() => console.log('Successfully deleted all application commands.'))
    .catch(console.error);

// Për të fshirë komandat nga një server specifik (guild), përdorni këtë:
// Zëvendësoni GUILD_ID me ID-në e serverit tuaj
// const GUILD_ID = 'ID_E_SERVERIT_TUAJ';
// rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] })
//     .then(() => console.log('Successfully deleted all guild commands.'))
//     .catch(console.error);