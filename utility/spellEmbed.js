const { EmbedBuilder } = require('discord.js');

module.exports = {
	embed: async (title) => {
		return new EmbedBuilder()
			.setColor(0x524b9e)
			.setTitle(title)
			.addFields(
				{ name: 'Title', value: title },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Test1', value: 'test1', inline: true },
				{ name: 'Test2', value: 'test2', inline: true },
			);
	},
};