import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { Message } from "discord.js";

export class VoiceManager {
  static joinVoiceChannel(message: Message<boolean>): boolean {
    const channelId = message.member?.voice?.channel?.id;
    const guildId = message?.guild?.id;
    const adapterCreator = message?.guild?.voiceAdapterCreator;

    if (!channelId || !guildId || !adapterCreator) {
      return false;
    }

    joinVoiceChannel({ channelId, guildId, adapterCreator });
    return true;
  }

  static getConnection(message: Message<boolean>) {
    return getVoiceConnection(message.guild.id);
  }
}
