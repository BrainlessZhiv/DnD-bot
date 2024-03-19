const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll")
    .setDescription("Rolls a dice")
    .addStringOption((formula) =>
      option
        .setName("formula")
        .setDescription("The dice formula to roll")
        .setRequired(true)
    ),
  async execute(interaction) {
    const formula = interaction.options.getString("formula");
    const parts = formula.split(/d|\+/);
    const numDice = parseInt(parts[0]);
    const numSides = parseInt(parts[1]);
    const modifier = parts[2] ? parseInt(parts[2]) : 0;

    let total = 0;
    for (let i = 0; i < numDice; i++) {
      total += Math.floor(Math.random() * numSides) + 1;
    }
    total += modifier;

    await interaction.reply(`Rolled ${formula}: ${total}`);
  },
};
