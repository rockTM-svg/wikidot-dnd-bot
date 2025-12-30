import { ChatInputCommandInteraction, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js';

interface DiscordChatCommand {
	data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder,
	execute: (interaction: ChatInputCommandInteraction) => Promise<void>
};

export default DiscordChatCommand;
