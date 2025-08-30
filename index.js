// index.js
const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const { REST, Routes } = require("discord.js");
require("dotenv").config();

// Load the database setup function
const setupDatabase = require('./database/setupDatabase.js');

// Initialize the bot client with necessary intents and partials
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [Partials.Message, Partials.Reaction],
});

// Create Collections to store commands, buttons, and events
client.commands = new Collection();
client.prefixCommands = new Collection();
client.buttons = new Collection();
client.events = new Collection();

// --- Command Loader ---
const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    } else if ("name" in command && "execute" in command) {
        client.prefixCommands.set(command.name, command);
    } else {
        console.log(`[WARNING] Komanda te ${filePath} i mungon 'data' ose 'name' dhe 'execute'.`);
    }
}

// --- Button Loader ---
const buttonsPath = path.join(__dirname, "buttons");
const buttonFiles = fs.readdirSync(buttonsPath).filter(file => file.endsWith(".js"));

for (const file of buttonFiles) {
    const filePath = path.join(buttonsPath, file);
    const button = require(filePath);
    if ("data" in button && "execute" in button) {
        client.buttons.set(button.data.name, button);
    } else {
        console.log(`[WARNING] Butoni te ${filePath} i mungon 'data' ose 'execute'.`);
    }
}

// --- Event Loader ---
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, async (...args) => {
            try {
                await event.execute(...args);
            } catch (error) {
                console.error(`An error occurred in a '${event.name}' once event:`, error);
            }
        });
    } else {
        client.on(event.name, async (...args) => {
            try {
                await event.execute(...args);
            } catch (error) {
                console.error(`An error occurred in a '${event.name}' event:`, error);
            }
        });
    }
}

// --- Slash Command Deployment ---
(async () => {
    try {
        console.log("Started refreshing application (/) commands.");
        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );
        console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();

// --- Final Login ---
async function startBot() {
    console.log("Setting up database...");
    await setupDatabase();
    console.log("Database setup complete. Logging in to Discord.");

    client.login(process.env.TOKEN);
}

startBot();