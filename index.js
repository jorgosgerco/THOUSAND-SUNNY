// index.js
const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
require("dotenv").config();

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

client.commands = new Collection(); // Për komandat Slash (/)
client.prefixCommands = new Collection(); // Për komandat me Prefiks (!)
client.buttons = new Collection();
client.events = new Collection();

// ========== Command Loader and Deployer ==========
const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  if ("data" in command && "execute" in command) {
    // Ngarkon komandat Slash
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
  } else if ("name" in command && "execute" in command) {
    // Ngarkon komandat me prefiks
    client.prefixCommands.set(command.name, command);
  } else {
    console.log(`[WARNING] Komanda te ${filePath} i mungon 'data' ose 'name' dhe 'execute'.`);
  }
}

// ========== Button Loader ==========
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

// ========== Event Loader ==========
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// ========== Slash Command Deployment ==========
const { REST, Routes } = require("discord.js");
(async () => {
  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
  try {
    console.log("Started refreshing application (/) commands.");
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

// ========== Events (Lidhja me event handler) ==========
client.on("interactionCreate", async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
    }
    return;
  }

  if (interaction.isButton()) {
    const buttonName = interaction.customId.split(":")[0];
    const button = interaction.client.buttons.get(buttonName);
    if (!button) return;
    try {
      await button.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: "There was an error while executing this button!", ephemeral: true });
    }
    return;
  }
});

// Event Handler për komandat me Prefiks
client.on("messageCreate", async message => {
  const prefix = "!";

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.prefixCommands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('Pati një gabim gjatë ekzekutimit të kësaj komande.');
  }
});

client.once("ready", () => {
  console.log(`🤖 Sunny u lidh si ${client.user.tag}`);
});

client.login(process.env.TOKEN);