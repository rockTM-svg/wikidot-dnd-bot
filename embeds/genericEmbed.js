const { EmbedBuilder } = require('discord.js');

module.exports = {
	/* todo: add build for content (hopefully) */
	genericEmbed: async (title) => {
		return new EmbedBuilder()
			.setTitle(title)
			.addFields(
				{ name: 'test', value: 'test' },
			);
	},
};