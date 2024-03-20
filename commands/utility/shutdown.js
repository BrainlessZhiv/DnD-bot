const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shutdown')
        .setDescription('Shuts the bot down.'),
    async execute(interaction) {
        await interaction.reply({content: 'Shutting down...', ephemeral: true});
        console.log('<@' + interaction.user.id + '> is shutting me down from slash command.');
        process.exit();
    },
};