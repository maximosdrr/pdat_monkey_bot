import { getVoiceConnection, joinVoiceChannel } from "@discordjs/voice";
import { Message } from "discord.js";

export class VoiceManager {
  static joinVoiceChannel(message: Message<boolean>) {
    const channelId = message.member.voice.channel.id;
    const guildId = message.guild.id;
    const adapterCreator = message.guild.voiceAdapterCreator;

    joinVoiceChannel({ channelId, guildId, adapterCreator });
  }

  static getConnection(message: Message<boolean>) {
    return getVoiceConnection(message.guild.id);
  }
}
