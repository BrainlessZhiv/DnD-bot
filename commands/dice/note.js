const { SlashCommandBuilder, Events } = require('discord.js');
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { SubmitDataToNotes } = require('../../backend/database/databaseSubmit');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('note')
		.setDescription('Manage notes')
		.addSubcommand((createSubcommand) =>
			createSubcommand
				.setName('create')
				.setDescription('Add a note'),
		)
		.addSubcommand((listSubcommand) =>
			listSubcommand
				.setName('list')
				.setDescription('List all notes'),
		)
		.addSubcommand((deleteSubcommand) =>
			deleteSubcommand
				.setName('delete')
				.setDescription('Delete a note')
				.addIntegerOption((option) =>
					option
						.setName('id')
						.setDescription('The ID of the note')
						.setRequired(true),
				)),
	async execute(commandInteraction) {
		if (commandInteraction.options.getSubcommand() === 'create') {

			const fields = {
				title: new TextInputBuilder()
					.setCustomId('noteCreateTitle')
					.setLabel('What is the title of the note?')
					.setPlaceholder('Note')
					.setStyle(TextInputStyle.Short),
				content: new TextInputBuilder()
					.setCustomId('noteCreateContent')
					.setLabel('What is the content of the note?')
					.setStyle(TextInputStyle.Paragraph),
			};


			// eslint-disable-next-line no-unused-vars
			const modal = new ModalBuilder()
				.setCustomId('noteCreate')
				.setTitle('Creating a note...');

			const titleRow = new ActionRowBuilder().addComponents(fields.title);
			const textRow = new ActionRowBuilder().addComponents(fields.content);

			modal.addComponents(titleRow, textRow);

			await commandInteraction.showModal(modal);

			let noteTitle;
			let noteContent;

			commandInteraction.client.on(Events.InteractionCreate, (modalInteraction) => {
				if (modalInteraction.isModalSubmit()) {
					noteTitle = modalInteraction.fields.getTextInputValue('noteCreateTitle');
					noteContent = modalInteraction.fields.getTextInputValue('noteCreateContent');

					SubmitDataToNotes(noteTitle, noteContent);

					modalInteraction.reply('Note "' + noteTitle + '" created successfully!');
				}
			});
		}
		else if (commandInteraction.options.getSubcommand() === 'list') {
			// TODO: Implement list notes
		}
		else if (commandInteraction.options.getSubcommand() === 'delete') {
			// TODO: Implement delete note
		}
	},
};
