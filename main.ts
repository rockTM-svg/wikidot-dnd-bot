import path from "node:path";
import fs from "node:fs";
import dotenvx from "@dotenvx/dotenvx";
dotenvx.config();

import { fileURLToPath } from "node:url";
import {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	type Interaction,
	MessageFlags,
} from "discord.js";

import type DiscordChatCommand from "./src/interface/discordCommand.js";

// -------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------

const client: Client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(process.env.BOT_TOKEN);

client.commands = new Collection<string, DiscordChatCommand>();

// ------------------------

const foldersPath = path.join(__dirname, "/src/commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		try {
			const command: DiscordChatCommand = await import(`${filePath}`);
			client.commands.set(command.data.name, command);
		} catch (err) {
			console.error(err);
		}
	}
}

// -------------------------

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: "There was an error while executing this command!",
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: "There was an error while executing this command!",
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});

// -------------------------

process.on("unhandledRejection", (error) => {
	console.error("Unhandled promise rejection:", error);
});
