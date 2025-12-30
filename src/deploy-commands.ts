import { REST, Routes } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';

import DiscordChatCommand from 'interface/discordCommand.js';

import dotenv from 'dotenv';
dotenv.config();

// -------------------------

const commands = [];

const foldersPath = path.join(__dirname, '/commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command: DiscordChatCommand = await import (filePath);

		try {
			commands.push(command.data.toJSON());
		}
		catch {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		};
	};
};

// -------------------------

const rest = new REST().setToken(process.env.BOT_TOKEN!);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: commands });

		console.log('Successfully reloaded all application commands.');
	}
	catch (error) {
		console.error(error);
	}
})();