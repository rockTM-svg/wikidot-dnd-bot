import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { REST, Routes } from "discord.js";
import dotenvx from "@dotenvx/dotenvx";
dotenvx.config();

import type DiscordChatCommand from "root/interface/discordCommand.js";

// -------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -------------------------

const commands = [];

const foldersPath = path.join(__dirname, "/src/commands");

const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".ts"));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command: DiscordChatCommand = await import(filePath);

		try {
			commands.push(command.data.toJSON());
		} catch {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
			);
		}
	}
}

// -------------------------

const rest = new REST().setToken(process.env.BOT_TOKEN!);

(async () => {
	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`,
		);
		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), {
			body: commands,
		});

		console.log("Successfully reloaded all application commands.");
	} catch (error) {
		console.error(error);
	}
})();
