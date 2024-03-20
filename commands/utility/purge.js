const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prune')
        .setDescription('Deletes a specified amount of messages from the channel.')
        .addIntegerOption(option => 
            option.setName('amount')
            .setDescription('The number of messages to delete')
            .setRequired(true)
        ),
    async execute(interaction) {
        // Check if the user has the 'MANAGE_MESSAGES' permission
        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) {
            await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            return;
        }

        const amount = interaction.options.getInteger('amount');
        // Add your code to delete the messages here

        await interaction.deferReply({content: `Deleting ${amount} messages.`, ephemeral: true});
        await interaction.channel.bulkDelete(amount);
        await interaction.editReply(`Deleted ${amount} messages.`);
    },
};