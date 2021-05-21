import { getTokenInfo, revokeToken } from '@twurple/auth';
import { Client, MessageEmbed } from 'discord.js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

declare global {
	namespace NodeJS {
		export interface ProcessEnv {
			DISCORD_BOT_TOKEN: string;
		}
	}
}

const client = new Client({
	intents: ['GUILDS', 'GUILD_MESSAGES']
});

client.on('ready', () => console.log('Bot ready'));

const tokenRE = /^[a-z0-9]+$/;
client.on('message', async msg => {
	const prefixes = [
		new RegExp(`^<@!?${client.user!.id}>$`),
		/^!token$/
	];
	const [pref, cmd/*, ...args*/] = msg.content.split(/ +/);
	if (!pref || !prefixes.some(pat => pat.test(pref))) {
		return;
	}
	if (cmd === 'purge') {
		if (msg.type === 'REPLY') {
			const ref = await msg.fetchReference();
			let contentPromises: Array<Promise<string>> = [];
			for (const attachment of ref.attachments.values()) {
				const contentType = attachment.contentType?.split(/; */)?.[0];
				if (contentType === 'text/plain') {
					contentPromises.push(fetch(attachment.url).then(resp => resp.text()));
				}
			}
			if (contentPromises.length) {
				const embed = new MessageEmbed({
					title: 'Purge',
					description: '⌛ Downloading attachment(s)...'
				});
				const reply = await msg.reply(embed);
				const tokens = (await Promise.all(contentPromises)).flat().filter(tk => tk && tokenRE.test(tk));
				const amount = tokens.length;
				embed.setDescription(`⌛ ${amount} tokens found, purging... (${amount} left)`);
				await reply.edit(embed);

				while (tokens.length) {
					const chunk = tokens.splice(0, 100);
					// don't really care about the outcome, this shouldn't fail on invalid tokens
					await Promise.allSettled(chunk.map(async token => {
						const tokenInfo = await getTokenInfo(token);
						await revokeToken(tokenInfo.clientId, token);
					}));
					if (tokens.length) {
						embed.setDescription(`⌛ ${amount} tokens found, purging... (${tokens.length} left)`);
						await reply.edit(embed);
					}
				}

				embed.setDescription(`☑ ${amount} tokens purged`);
				await reply.edit(embed);
				return;
			}
		}
		await msg.reply('Purge what?');
	}
});

client.login(process.env.DISCORD_BOT_TOKEN);
