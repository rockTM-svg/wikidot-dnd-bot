import type { ChatInputCommandInteraction } from "discord.js";

export async function sendLargeMessage(content: string, interaction: ChatInputCommandInteraction) {
	let cycle = true;
	const messages: string[] = [];

	while (cycle) {
		const subEnd = content.lastIndexOf('\n', 2000);
		messages.push(content.substring(0, subEnd));

		if (content.length <= 2000) {
			cycle = false;
		}
		else {
			content = content.substring(subEnd);
		};
	};

	try {
		for (let i = 0; i < messages.length; i++) {
			if (i === 0) {
				interaction.deferred 
				? await interaction.editReply(`-----------\n${messages[i]}`)
				: await interaction.reply(`-----------\n${messages[i]}`);
			}
			else {
				await interaction.followUp(messages[i]);
			}
		};
	} 
	catch (error) {
		console.error(error.message);
		return;
	};
};