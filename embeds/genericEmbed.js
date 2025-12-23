const { EmbedBuilder } = require('discord.js');

module.exports = {
	// unused for now
	genericEmbed: async (title) => {
		return new EmbedBuilder().setTitle(title);
		/* const builder = new EmbedBuilder()
			.setTitle(title)
			.addFields([

			]);
		*/
	},
};