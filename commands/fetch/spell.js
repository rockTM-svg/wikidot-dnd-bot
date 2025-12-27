import { SlashCommandBuilder } from 'discord.js';
// const { genericEmbed } = require('../../embeds/genericEmbed.js');
import parseHTML from '../../utility/parseHTML.js';

import sites from '../../sites.json' with { type: 'json' };

export const data = new SlashCommandBuilder()
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
			.setRequired(true));

export const execute = async (interaction) => {
	await interaction.deferReply();

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

	// todo: find how to use embed
	const tempcontent = await fetch(url)
		.then((res) => res.text())
		.then(text => parseHTML(text));

	let content = '';
	tempcontent.forEach((value) => {
		content += value.content + '\n\n';
	});

	await interaction.editReply(
		`\n**${option} - ${spellName}**\n\n` +
		`${content}`,
	);
};