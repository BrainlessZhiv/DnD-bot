const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shutdown")
    .setDescription("Shuts the bot down."),
  async execute(interaction) {
    console.log(
      "<@" +
        interaction.user.id +
        "> is trying to shut me down from slash command."
    );
    // Check if the user has the 'ADMINISTRATOR' permission
    if (!interaction.member.permissions.has("ADMINISTRATOR")) {
      await interaction.reply({
        content: "You do not have permission to use this command.",
        ephemeral: true,
      });
      return;
    }
      await interaction.reply({ content: 'Shutting down...', ephemeral: true });
      process.exit();
    }
};
