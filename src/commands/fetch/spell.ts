import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
// const { genericEmbed } = require('../../embeds/genericEmbed.js');
import parseHTML from '../../utility/parseHTML.js';
import ParsedHTMLText from '../../interface/parsedHTMLText.js';

import sites from '../../../sites.json' with {'type': 'json'};

// ----------------------------------

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

export const execute = async (interaction: ChatInputCommandInteraction) => {
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

	// todo: check against 404s
	const parsedContent = await fetch(url)
		.then((res) => res.text())
		.then(text => parseHTML(text));

	let tempcontent = '';
	parsedContent.forEach((value: ParsedHTMLText) => {
		tempcontent += value.content + '\n\n';
	});

	if (tempcontent.length > 2000) {
		let cycle = true;

		while (cycle) {
			const subEnd = tempcontent.lastIndexOf('\n', 2000);

			if (tempcontent.length == parsedContent.length) {
				await interaction.editReply(
					'-------\n' +
					`\n**${option} - ${spellName}**\n\n` +
					`${tempcontent.substring(0, subEnd)}`,
				);
			}
			else {
				await interaction.followUp(tempcontent.substring(0, subEnd));
			};

			if (tempcontent.length <= 2000) {
				cycle = false;
			}
			else {
				tempcontent = tempcontent.substring(subEnd);
			};
		};
	}
	else {
		await interaction.editReply(
			'-------\n' +
			`\n**${option} - ${spellName}**\n\n` +
			`${parsedContent}`,
		);
	};
};