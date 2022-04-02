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
import { SongQueue } from "./queue";

export class SongPlayer {
  connection: VoiceConnection;
  subscription: PlayerSubscription;
  audioPlayer = createAudioPlayer();

  constructor(private songQueue: SongQueue) {}

  play(message: Message<boolean>, song: ISong) {
    const playerConnected = this.connectPlayer(message);

    if (!playerConnected) {
      message.reply(`You should be in a guild voice channel to play your song`);
      return;
    }

    this.songQueue.addSong(message, song);

    if (!this.isPlayingSomething()) {
      this.next(message);
    }
  }

  stop(message: Message<boolean>) {
    try {
      message.reply(`Stopping player`);
      this.connection.destroy();
      this.subscription.unsubscribe();
    } catch (e) {
      message.reply(`Cannot stop: ${e?.message ?? "Unknown"}`);
    }
  }

  next(message: Message<boolean>) {
    const song = this.songQueue.getNext();
    if (!song) {
      message.reply(`Queue is empty`);
      return;
    }

    message.reply(`Now playing ${song.title} [${song.duration} seconds]`);
    const audioResource = this.getAudioResource(song);
    this.audioPlayer.play(audioResource);
  }

  private isPlayingSomething() {
    return this.audioPlayer.state.status === AudioPlayerStatus.Playing;
  }

  private getAudioResource(song: ISong) {
    const stream = ytdl(song.url, { filter: "audioonly" });
    return createAudioResource(stream);
  }

  private connectPlayer(message: Message<boolean>): boolean {
    if (this.isPlayingSomething()) {
      return true;
    }

    const isConnected = VoiceManager.joinVoiceChannel(message);

    if (!isConnected) {
      return false;
    }

    this.connection = VoiceManager.getConnection(message);
    this.subscription = this.connection.subscribe(this.audioPlayer);

    this.audioPlayer.on("error", async (err) => {
      this.stop(message);

      await message.channel.send(
        `Error caught when play song, stopping music ${err.message}`
      );

      console.log(err);
    });

    this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
      if (this.songQueue.isEmpty()) {
        this.stop(message);
      }

      this.next(message);
    });

    return true;
  }
}
