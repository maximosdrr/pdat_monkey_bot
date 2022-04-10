import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  PlayerSubscription,
  VoiceConnection,
} from "@discordjs/voice";
import { InternalDiscordGatewayAdapterCreator, Message } from "discord.js";
import { VoiceManager } from "./voice-manager";
import { SongQueue } from "./queue";
import { ISong } from "../interfaces/interfaces";
import { YoutubeStreamProvider } from "../../../libs/youtube-stream-provider";

export class SongPlayer {
  private connection: VoiceConnection;
  subscription: PlayerSubscription;
  audioPlayer = createAudioPlayer();

  constructor(
    private songQueue: SongQueue,
    private youtubeStreamProvider: YoutubeStreamProvider,
    private voiceManager: VoiceManager
  ) {}

  async play(
    channelId: string,
    guildId: string,
    adapterCreator: InternalDiscordGatewayAdapterCreator,
    song: ISong
  ) {
    const playerConnected = this.connectPlayer(
      channelId,
      guildId,
      adapterCreator
    );

    if (!playerConnected) {
      throw new Error(
        `You should be in a guild voice channel to play your song`
      );
    }

    this.songQueue.addSong(song);

    if (!this.isPlayingSomething()) {
      await this.next();
    }
  }

  async stop() {
    this.songQueue.clearQueue();
    this.connection.destroy();
    this.subscription.unsubscribe();
  }

  async next() {
    const song = this.songQueue.getNext();
    if (!song) {
      await this.stop();
      return;
    }

    const audioResource = await this.getAudioResource(song);
    this.audioPlayer.play(audioResource);
  }

  isPlayingSomething() {
    return this.audioPlayer.state.status === AudioPlayerStatus.Playing;
  }

  private async getAudioResource(song: ISong) {
    const { stream, type } = await this.youtubeStreamProvider.stream(song.url);

    stream.on("end", () => {
      this.next();
    });

    return createAudioResource(stream, { inputType: type });
  }

  private connectPlayer(
    channelId: string,
    guildId: string,
    adapterCreator: InternalDiscordGatewayAdapterCreator
  ): boolean {
    if (this.isPlayingSomething()) {
      return true;
    }

    const isConnected = this.voiceManager.joinVoiceChannel(
      channelId,
      guildId,
      adapterCreator
    );

    if (!isConnected) {
      return false;
    }

    this.connection = this.voiceManager.getConnection(guildId);
    this.subscription = this.connection.subscribe(this.audioPlayer);

    this.audioPlayer.on("error", async (err) => {
      await this.stop();
      console.log(err);
    });
    return true;
  }
}
