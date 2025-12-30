import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Sends a pong message');

export const execute = async (interaction: ChatInputCommandInteraction) => {
	await interaction.reply('Pong!');
};