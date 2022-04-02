import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  PlayerSubscription,
  VoiceConnection,
} from "@discordjs/voice";
import { Message } from "discord.js";
import ytdl from "ytdl-core";
import { ISong } from "../interfaces";
import { VoiceManager } from "./voice-manager";
import { songQueue } from "../constants";

export class SongPlayer {
  connection: VoiceConnection;
  subscription: PlayerSubscription;
  audioPlayer = createAudioPlayer();

  play(message: Message<boolean>, song: ISong) {
    this.addSongToQueue(message, song);
    this.setupPlayer(message);

    if (!this.isPlayingSomething()) {
      this.next(message);
    }
  }

  stop(message: Message<boolean>) {
    message.reply(`Stopping player`);
    this.connection.destroy();
    this.subscription.unsubscribe();
  }

  next(message: Message<boolean>) {
    const song = songQueue.shift();
    if (!song) {
      message.reply(`Queue is empty`);
      return;
    }

    message.reply(`Now playing ${song.title} [${song.duration} seconds]`);
    const audioResource = this.getAudioResource(song);
    this.audioPlayer.play(audioResource);
  }

  private addSongToQueue(message: Message<boolean>, song: ISong) {
    message.reply(`${song.title} added to queue`);
    songQueue.push(song);
  }

  private isPlayingSomething() {
    return this.audioPlayer.state.status === AudioPlayerStatus.Playing;
  }

  private getAudioResource(song: ISong) {
    const stream = ytdl(song.url, { filter: "audioonly" });
    return createAudioResource(stream);
  }

  private setupPlayer(message: Message<boolean>) {
    if (this.isPlayingSomething()) {
      return;
    }

    VoiceManager.joinVoiceChannel(message);
    this.connection = VoiceManager.getConnection(message);
    this.subscription = this.connection.subscribe(this.audioPlayer);

    this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      if (!songQueue.length) {
        this.stop(message);
      }

      this.next(message);
    });
  }
}
