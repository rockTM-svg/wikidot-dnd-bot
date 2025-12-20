const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('spell')
		.setDescription('Returns information about spell if it exists')
		.addStringOption((option) =>
			option
				.setName('system')
				.setDescription('System from where the spell is from')
				.setRequired(true)
				.addChoices(
					{ name: 'DND 5e', value: 'dnd5e' },
					{ name: 'DND 5e (2024)', value: 'dnd5e2024' },
				)),
	execute: async (interaction) => {
		await interaction.reply(`System: ${interaction.options.getString('system')}`);
	},
};