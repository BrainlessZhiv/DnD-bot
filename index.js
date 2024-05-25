// Require the necessary discord.js classes
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config();
const BOT_TOKEN = process.env.BOT_TOKEN;

// Deploy commands to Discord from deploy-commands.js
require('./deploy-commands');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Create a new Collection to store your commands
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandFiles = fs
		.readdirSync(`${foldersPath}/${folder}`)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`${foldersPath}/${folder}/${file}`);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
			console.log(
				`[INFO]: Command ${file} at ${foldersPath}/${folder} has been loaded.`,
			);
		}
		else {
			console.error(
				`[WARNING]: Command ${file} at ${foldersPath}/${folder} is not a valid command file.`,
			);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`${eventsPath}/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Login to Discord with your client's token
client.login(BOT_TOKEN);
