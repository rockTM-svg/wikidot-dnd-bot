import {
	SlashCommandBuilder,
	type ChatInputCommandInteraction,
} from "discord.js";

// const { genericEmbed } = require('../../embeds/genericEmbed.js');
import { checkPage, fetchHTML } from "root/utility/requests.js";
import type ParsedHTMLText from "interface/parsedHTMLText.js";

import sendLargeMessage from "utility/sendLargeMessage.js";

import sites from "../../../sites.json" with { type: "json" };

// ---------------------------------

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

	const option: string = interaction.options.getString("system")!;
	const spellName: string = interaction.options
		.getString("name")!
		.replaceAll(/[:']/g, "")
		.replaceAll(" ", "-")
		.toLowerCase();

	let url = "";
	switch (option) {
		case "dnd5e":
			url = `${sites.dnd5e}/spell:${spellName}`;
			break;
		case "dnd2024":
			url = `${sites.dnd2024}/spell:${spellName}`;
			break;
	}

	// ------------- Fetching info -------------

	const reqTestResult: number = await checkPage(url);
	switch (reqTestResult) {
		case 404:
			// test if it's in UA
			if ((await checkPage(`${url}-ua`)) < 300) url += "-ua";
			else {
				await interaction.editReply("Error: page not found. Please try again.");
				return;
			}
			break;
		default:
			if (reqTestResult > 400) {
				await interaction.editReply("Unknown error. Please try again.");
				return;
			}
	}

	const parsedContent: ParsedHTMLText[] = await fetchHTML(url);
	if (parsedContent.length === 0) {
		await interaction.editReply(
			"Error: Could not fetch data. Please try again.",
		);
		return;
	}

	// ------------- Sending the info to the chat --------------

	let tempcontent = "";
	parsedContent.forEach((value: ParsedHTMLText) => {
		tempcontent += `${value.content}\n\n`;
	});

	if (tempcontent.length > 2000) {
		await sendLargeMessage(tempcontent, interaction);
	} else {
		await interaction.editReply(
			`-------\n
			**${option} - ${spellName}**\n
			${tempcontent}`,
		);
	}
};
