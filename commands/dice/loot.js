const { SlashCommandBuilder } = require("discord.js");
const { calculateDice } = require("../../backend/calculateRoll");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loot")
    .setDescription("Manages current loot entries")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Adds a new loot entry")
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("delete")
            .setDescription("Deletes a loot entry")
        )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("get")
            .setDescription("Lists all loot entries")
            .addStringOption((option) =>
                option
                    .setName("id")
                    .setDescription("The ID of the loot entry to get. Use 'all' to get all entries")
                    .setRequired(true)
                    .autocomplete(true)
            )
        )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("update")
            .setDescription("Updates a loot entry")
        ),
    async execute(interaction) {
};

