const { SlashCommandBuilder } = require('discord.js');
const { spellEmbed } = require('../../utility/spellEmbed.js');

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
				))
		.addStringOption((option) =>
			option
				.setName('name')
				.setDescription('Spell name')
				.setRequired(true)),
	execute: async (interaction) => {
		const option = interaction.options.getString('system');
		const spellName = interaction.options.getString('name');

		await interaction.reply({
			embeds: [ await spellEmbed(`${option} - ${spellName}`) ],
		});
	},
};