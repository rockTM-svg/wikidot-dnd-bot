const { SlashCommandBuilder } = require('discord.js');
const { genericEmbed } = require('../../embeds/genericEmbed.js');
const { parse } = require('../../utility/parser.js');

const sites = require('../../sites.json');

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

		let url = '';
		switch (option) {
		case 'dnd5e':
			url = `${sites.dnd5e}/spell:${spellName}`;
			break;
		case 'dnd2024':
			url = `${sites.dnd2024}/spell:${spellName}`;
			break;
		};

		const tempcontent = await fetch(url)
			.then((res) => res.text())
			.then(text => parse(text));

		await interaction.reply({
			embeds: [ await genericEmbed(`${option} - ${spellName}`, tempcontent) ],
		});
	},
};