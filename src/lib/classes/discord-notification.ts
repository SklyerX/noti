import { env } from "@/env";
import { REST } from "@discordjs/rest";
import {
  type APIEmbed,
  type RESTPostAPICurrentUserCreateDMChannelResult,
  Routes,
} from "discord-api-types/v10";

export class DiscordNotificationClient {
  private rest: REST;
  private discordId: string;

  constructor(discordId: string) {
    this.rest = new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN);
    this.discordId = discordId;
  }

  private async createDM() {
    return this.rest.post(Routes.userChannels(), {
      body: { recipient_id: this.discordId },
    }) as Promise<RESTPostAPICurrentUserCreateDMChannelResult>;
  }

  async send(embed: APIEmbed) {
    const channel = await this.createDM();

    this.rest.post(Routes.channelMessages(channel.id), {
      body: {
        embeds: [embed],
      },
    });
  }
}
