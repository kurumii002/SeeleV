import { PresenceStatusData } from "discord.js";
import { bot_version } from "../config";
import { Event } from "../structures";
import Logger from "../util/Logger";

export default new Event({
	name: "ready",
	once: true,
	execute: async (interaction) => {
		const status: PresenceStatusData =
			process.env.ENVIRONMENT === "prod" ? "online" : "idle";
		
		//setea el estado del bot
		interaction.user.setPresence({
			status: status,
			activities: [
				{
					type: "WATCHING", //actividad
					name: `v${bot_version}`, //estado del bot
				},
			],
		});

		Logger.log(`Inicio de sesión correcto. ${interaction.user.username} online`);
	},
});
