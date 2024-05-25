const { SlashCommandBuilder } = require('discord.js');
const { calculateDice } = require('../../backend/calculateRoll');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roll')
		.setDescription('Rolls a dice')
		.addStringOption((option) =>
			option
				.setName('formula')
				.setDescription('The dice formula to roll')
				.setRequired(true),
		)
		.addIntegerOption((option) =>
			option
				.setName('target')
				.setDescription('The target number to compare the roll to')
				.setRequired(false),
		)
		.addBooleanOption((option) =>
			option
				.setName('lower')
				.setDescription(
					'Whether the dice check is for lower rather than higher than the target number',
				)
				.setRequired(false),
		),
	async execute(interaction) {
		const reply = await interaction.deferReply();

		const calculation = calculateDice(interaction.options.getString('formula'), interaction.user.id);
		let diceResults = calculation.diceResults;
		let modResults = calculation.modResults;
		const result = calculation.result;

		diceResults = diceResults.join(' + ');
		modResults = modResults.join('');

		if (interaction.options.getInteger('target')) {
			if (interaction.options.getBoolean('lower')) {
				if (result <= interaction.options.getInteger('target')) {
					checkResult = 'Success';
				}
				else {
					checkResult = 'Failure';
				}
			}
			else if (result >= interaction.options.getInteger('target')) {
				checkResult = 'Success';
			}
			else {
				checkResult = 'Failure';
			}
		}

		await interaction.editReply({
			content:
        '``' +
        interaction.options.getString('formula') +
        '`` = ``' +
        diceResults +
        '' +
        modResults +
        ' = ' +
        result +
        '``' +
        (interaction.options.getInteger('target')
        	? ' Target: ``' +
            interaction.options.getInteger('target') +
            '`` Result: ``' +
            checkResult +
            '``'
        	: ''),
			ephemeral: false,
		});
	},
};
