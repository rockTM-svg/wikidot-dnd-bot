const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Sends a pong message'),

	execute: async (interaction) => {
		await interaction.reply('Pong!');
	},
};