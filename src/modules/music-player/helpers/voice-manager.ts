import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { InternalDiscordGatewayAdapterCreator, Message } from "discord.js";

export class VoiceManager {
  joinVoiceChannel(
    channelId: string,
    guildId: string,
    adapterCreator: InternalDiscordGatewayAdapterCreator
  ): boolean {
    if (!channelId || !guildId || !adapterCreator) {
      return false;
    }

    joinVoiceChannel({ channelId, guildId, adapterCreator });
    return true;
  }

  getConnection(guildId: string) {
    return getVoiceConnection(guildId);
  }
}
