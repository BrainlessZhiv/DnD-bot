const { SlashCommandBuilder } = require("discord.js");
const { calculateDice } = require("../../backend/calculateRoll");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Rolls a dice")
    .addStringOption(option =>
      option
        .setName("formula")
        .setDescription("The dice formula to roll")
        .setRequired(true)
    ),
  async execute(interaction) {
    calculateDice(interaction.options.getString("formula"));
    
    await interaction.reply({ content: interaction.options.getString("formula") + " = " + calculateDice(interaction.options.getString("formula")), ephemeral: false });
    
},
};
