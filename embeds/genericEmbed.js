import { EmbedBuilder } from 'discord.js';

async function genericEmbed(title) {
	return new EmbedBuilder().setTitle(title);
	/* const builder = new EmbedBuilder()
		.setTitle(title)
		.addFields([

		]);
	*/
};

export default genericEmbed;