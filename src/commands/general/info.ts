import { Command } from "../../structures";
import { Guild, MessageEmbed } from "discord.js";
import {
	bot_github,
	bot_invitation,
	bot_version,
	developers,
	embed_color,
} from "../../config";
import { ram } from "../../util";
import moment from "moment";
import "moment-duration-format";

export default new Command({
	data: {
		name: "info",
		description: "Colección de comandos que muestra la información de un usuario, servidor o de mí",
		options: [
			{
				name: "usuario",
				description: "Info de ti o de un usuario que me indiques",
				type: "SUB_COMMAND",
				options: [
					{
						name: "usuario",
						description: "El usuario del cual quieres ver su información",
						type: "USER",
					},
				],
			},
			{
				name: "servidor",
				description: "Info del servidor actual",
				type: "SUB_COMMAND",
			},
			{
				name: "bot",
				description: "Info sobre mí n//n",
				type: "SUB_COMMAND",
			},
		],
	},
	example: "/info bot",
	execute: async ({ interaction, args, client }) => {
		switch (args.getSubcommand()) {
			case "usuario": {
				const user = args.getUser("usuario"); //obtiene el usuario del que se requiere su informacion
				const member = user
					? interaction.guild?.members.cache.get(user.id) //si se menciona al usuario obtiene su info
					: interaction.guild?.members.cache.get(interaction.user.id); //si no se menciona, entonces obtiene la info del autor

				const user_id = user ? user.id : interaction.user.id;
				const username = user
					? `${user.username}#${user.discriminator}`
					: `${interaction.user.username}#${interaction.user.discriminator}`;
				const nickname = user
					? `${member?.nickname || "`No tiene`"}`
					: `${member?.nickname || "`No tiene`"}`;
				const avatar = user
					? user.displayAvatarURL({ dynamic: true })
					: interaction.user.displayAvatarURL({ dynamic: true });
				const cuenta_creada = user
					? `${user.createdAt.toLocaleDateString("es-pe")}`
					: `${interaction.user.createdAt.toLocaleDateString("es-pe")}`;
				const fecha_ingreso = user
					? `${member?.joinedAt?.toLocaleDateString("es-pe")}`
					: `${member?.joinedAt?.toLocaleDateString("es-pe")}`;
				const roles = user
					? member?.roles.cache.map((role) => role.toString()).join(" ")
					: member?.roles.cache.map((role) => role.toString()).join(" ");

				const us_embed = new MessageEmbed()
					.setTitle(":information_source: Información de usuario:")
					.setColor(embed_color)
					.setThumbnail(avatar)
					.addField("ID:", `\`${user_id}\``, true)
					.addField("Nombre de usuario:", username, true)
					.addField("Apodo:", nickname, true)
					.addField("Cuenta creada:", `\`${cuenta_creada}\``, true)
					.addField("Fecha de ingreso:", `\`${fecha_ingreso}\``, true)
					.addField("Fecha de ingreso:", `\`${fecha_ingreso}\``, true)
					.addField("Roles:", `${roles}`)
					.setFooter({text: "Si deseas ver el avatar en tamaño grande escribe: /tools avatar"});

				return await interaction.reply({ embeds: [us_embed] });
			}

			case "servidor": {
				const server = interaction.guild as Guild;

				//obtiene el # de canales de texto, voz y stage
				const text = server.channels.cache.filter(
					(ch) => ch.type == "GUILD_TEXT"
				).size;
				const voice = server.channels.cache.filter(
					(ch) => ch.type == "GUILD_VOICE"
				).size;
				const stage = server.channels.cache.filter(
					(ch) => ch.type == "GUILD_STAGE_VOICE"
				).size;
				const news = server.channels.cache.filter(
					(ch) => ch.type == "GUILD_NEWS"
				).size;

				await server.fetch();

				const sv_embed = new MessageEmbed()
					.setTitle(`:information_source: ${server.name}`)
					.addField(
						"Detalles:",
						`ID: \`${server.id}\`\nDueño actual: <@!${
							server.ownerId
						}>\nFecha creación: \`${server.createdAt.toLocaleDateString()}\`\nNivel verificación: \`${
							server.verificationLevel
						}\``
					)
					.addField(
						"Estadísticas:",
						`Miembros: \`${server.approximateMemberCount}\`\nMiembros online: \`${server.approximatePresenceCount}\`\nRoles: \`${server.roles.cache.size}\`\nEmojis: \`${server.emojis.cache.size}\``,
						true
					)
					.addField(
						"Server boost:",
						`Mejoras: \`${server.premiumSubscriptionCount}\`\nNivel: \`${server.premiumTier}\``,
						true
					)
					.addField(
						"Canales:",
						`Texto: \`${text}\`\nVoz: \`${voice}\`\nStage: \`${stage}\`\nAnuncios: \`${news}\``,
						true
					)
					.setColor(embed_color)
					.setThumbnail(server.iconURL()!);

				return await interaction.reply({ embeds: [sv_embed] });
			}

			case "bot": {
				const devs: string[] = [];
				const online = moment.duration(client.uptime).format(" D [dias], H [hrs], m [mins], s [secs]");
				
				for (const dev of developers) {
					const user = await client.users.fetch(dev);
					devs.push(`${user.username}#${user.discriminator}`);
				}

				const bt_embed = new MessageEmbed()
					.setTitle(":cherry_blossom: Sobre mí >/./<")
					.setDescription(
						"Hola!, soy una bot multifuncional con el propósito de serte de utilidad en cualquier momento, aún soy pequeña y es por ello que si observas algún error o sugerencia no dudes en reportarlo en mi servidor o creador. Próximamente tendré más funciones!"
					)
					.setThumbnail(client.user!.avatarURL()!)
					.addField(
						"Equipo:",
						`Desarrollador/es: \`${devs}\`\nAgradecimientos: \`@-Cynos-\`\n`
					)
					.addField(
						"Estadísticas:",
						`Servidores: \`${client.guilds.cache.size}\`\nComandos: \`${client.commands.size}\`\nEventos: \`${client.events.size}\``,
						true
					)
					.addField(
						"Información técnica:",
						`Versión: \`${bot_version}\`\nLibrería: Djs v13\nRam: \`${ram} MB\`\nOnline: ${online}`,
						true
					)
					.addField(
						"Enlaces útiles:",
						`[Invítame a un servidor](${bot_invitation})\n[Mi servidor de soporte]({})\n[Mi página web]({})\n[Mi código fuente](${bot_github})`,
						true
					)
					.setColor(embed_color);

				return await interaction.reply({ embeds: [bt_embed] });
			}
		}
	},
});
