import { joinVoiceChannel } from "@discordjs/voice";
import { Message } from "discord.js";

export class VoiceManager {
  joinVoiceChannel(message: Message<boolean>) {
    const channelId = message.member.voice.channel.id;
    const guildId = message.guild.id;
    const adapterCreator = message.guild.voiceAdapterCreator;

    joinVoiceChannel({ channelId, guildId, adapterCreator });
  }
}
