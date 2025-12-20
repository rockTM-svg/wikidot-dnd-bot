const { EmbedBuilder } = require('discord.js');

module.exports = {
	spellEmbed: async (title, description) => {
		return new EmbedBuilder()
			.setColor(0x524b9e)
			.setTitle(title)
			.addFields(
				/*
				{ name: 'Title', value: title },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Classes', value: classes, inline: true },
				{ name: 'Source', value: source, inline: true },
				*/
				{ name: 'Description', value: description, inline: true },
			);
	},
};