import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
} from "discord.js";

// const { genericEmbed } = require('../../embeds/genericEmbed.js');
import parseHTML from "../../utility/parseHTML.js";
import type ParsedHTMLText from "../../interface/parsedHTMLText.js";

import { sendLargeMessage } from "utility/sendLargeMessage.js";

import sites from "../../../sites.json" with { type: "json" };

// ----------------------------------

export const data = new SlashCommandBuilder()
	.setName("spell")
	.setDescription("Returns information about spell if it exists")
	.addStringOption((option) =>
		option
			.setName("system")
			.setDescription("System from where the spell is from")
			.setRequired(true)
			.addChoices(
				{ name: "DND 5e", value: "dnd5e" },
				{ name: "DND 5e (2024)", value: "dnd5e2024" },
			),
	)
	.addStringOption((option) =>
		option.setName("name").setDescription("Spell name").setRequired(true),
	);

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.deferReply();

	const option: string = interaction.options.getString('system')!;
	// TODO: figure out how to support Unearthed Arcana spells
	const spellName: string = interaction.options.getString('name')!
		.replaceAll('\'', '')
		.replaceAll(' ', '-')
		.toLowerCase();

	let url = "";
	switch (option) {
		case "dnd5e":
			url = `${sites.dnd5e}/spell:${spellName}`;
			break;
		case "dnd2024":
			url = `${sites.dnd2024}/spell:${spellName}`;
			break;
	};

	// ------------- Fetching info -------------

	const parsedContent = await fetch(url)
		.then((res) => {
			if (res.ok) return res.text();
			return Promise.reject(res);
		})
		.then(text => parseHTML(text))
		.catch(async (res: Response) => {
			switch (res.status) {
			case 404:
				await interaction.editReply('Error: spell page not found. Please try again.');
				break;
			default:
				await interaction.editReply('Unknown error.');
				break;
			}

			console.error(`${res.status} - ${res.statusText}`);
		});

	if (!parsedContent) return;

	// ------------- Sending the info to the chat --------------

	let tempcontent = '';
	parsedContent.forEach((value: ParsedHTMLText) => {
		tempcontent += `${value.content}\n\n`;
	});

	if (tempcontent.length > 2000) {
		await sendLargeMessage(tempcontent, interaction);
	}
	else {
		await interaction.editReply(
			'-------\n' +
			`\n**${option} - ${spellName}**\n\n` +
			`${tempcontent}`,
		);
	};
};