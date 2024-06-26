const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

require('dotenv').config();
const BOT_TOKEN = process.env.BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandFiles = fs.readdirSync(`${foldersPath}/${folder}`).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const command = require(`${foldersPath}/${folder}/${file}`);
		if ('data' in command) {
			commands.push(command.data.toJSON());
			console.log(`[INFO]: Command ${file} at ${foldersPath}/${folder} has been loaded.`);
		}
		else {
			console.error(`[WARNING]: Command ${file} at ${foldersPath}/${folder} is not a valid command file.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(BOT_TOKEN);

// and deploy your commands!
(async () => {
	try {
		// Get rid of the old commands
		await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
			.then(() => console.log('Successfully deleted all guild commands.'))
			.catch(console.error);

		await rest.put(Routes.applicationCommands(clientId), { body: [] })
			.then(() => console.log('Successfully deleted all application commands.'))
			.catch(console.error);

		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();