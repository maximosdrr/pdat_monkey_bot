import {
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
} from "@discordjs/voice";
import { Message } from "discord.js";
import ytdl from "ytdl-core";
import { ISong } from "../interfaces";
import { VoiceManager } from "./voice-manager";

export class SongPlayer {
  playSong(message: Message<boolean>, song: ISong) {
    const voiceManager = new VoiceManager();

    voiceManager.joinVoiceChannel(message);
    const connection = getVoiceConnection(message.guild.id);
    const stream = ytdl(song.url, { filter: "audioonly" });

    const audioResource = createAudioResource(stream);
    const audioPlayer = createAudioPlayer();

    const subscription = connection.subscribe(audioPlayer);

    if (subscription) {
      setTimeout(() => {
        subscription.unsubscribe();
        connection.destroy();
      }, 10000);
    }

    audioPlayer.play(audioResource);
  }
}
