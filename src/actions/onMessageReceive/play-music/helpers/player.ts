import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  PlayerSubscription,
  VoiceConnection,
} from "@discordjs/voice";
import { Message } from "discord.js";
import { ISong } from "../interfaces";
import { VoiceManager } from "./voice-manager";
import { SongQueue } from "./queue";
import play from "play-dl";

export class SongPlayer {
  connection: VoiceConnection;
  subscription: PlayerSubscription;
  audioPlayer = createAudioPlayer();

  constructor(private songQueue: SongQueue) {}

  async play(message: Message<boolean>, song: ISong) {
    const playerConnected = this.connectPlayer(message);

    if (!playerConnected) {
      await message.reply(
        `You should be in a guild voice channel to play your song`
      );
      return;
    }

    this.songQueue.addSong(message, song);

    if (!this.isPlayingSomething()) {
      await this.next(message);
    }
  }

  async stop(message: Message<boolean>) {
    this.songQueue.clearQueue();

    try {
      await message.reply(`Stopping player`);
      this.connection.destroy();
      this.subscription.unsubscribe();
    } catch (e) {
      await message.reply(`Cannot stop: ${e?.message ?? "Unknown"}`);
    }
  }

  async next(message: Message<boolean>) {
    const song = this.songQueue.getNext();
    if (!song) {
      await message.reply(`Queue is empty`);
      await this.stop(message);
      return;
    }

    await message.reply(`Now playing ${song.title} [${song.duration} seconds]`);
    const audioResource = await this.getAudioResource(song, message);

    this.audioPlayer.play(audioResource);
  }

  private isPlayingSomething() {
    return this.audioPlayer.state.status === AudioPlayerStatus.Playing;
  }

  private async getAudioResource(song: ISong, message: Message<boolean>) {
    const { stream, type } = await play.stream(song.url, {
      discordPlayerCompatibility: true,
    });

    stream.on("end", () => {
      this.next(message);
    });

    return createAudioResource(stream, { inputType: type });
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
      await this.stop(message);

      await message.channel.send(
        `Error caught when play song, stopping music ${err.message}`
      );

      console.log(err);
    });
    return true;
  }
}
