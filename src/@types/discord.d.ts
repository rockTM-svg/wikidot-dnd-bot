import type { Collection } from "discord.js";

import type DiscordChatCommand from "../interface/discordCommand.ts";

declare module "discord.js" {
	export interface Client {
		commands: Collection<string, DiscordChatCommand>;
	}
}
