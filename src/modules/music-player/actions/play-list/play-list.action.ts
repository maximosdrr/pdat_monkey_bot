import { InternalDiscordGatewayAdapterCreator, Message } from "discord.js";
import {
  IParamsValidationResult,
  OnMessageReceiveActionCreator,
} from "../../../../shared/interfaces";
import { MessageUtils } from "../../../../utils/message.utils";
import { SongQueue } from "../../helpers/queue";
import { SongFinder } from "../../helpers/song-finder";
import { SongPlayer } from "../../helpers/song-player";
import { ISong } from "../../interfaces/interfaces";

export class PlayYoutubePlayList implements OnMessageReceiveActionCreator {
  actionTrigger: string;

  constructor(
    trigger: string,
    private player: SongPlayer,
    private songFinder: SongFinder,
    private queueManager: SongQueue
  ) {
    this.actionTrigger = trigger;
  }

  async execute(message: Message<boolean>) {
    try {
      if (!this.shouldExecute(message)) return;

      const channelId = message.member?.voice?.channel?.id;
      const guildId = message?.guild?.id;
      const adapterCreator = message?.guild?.voiceAdapterCreator;
      const link = MessageUtils.getArgument(message, this.actionTrigger);
      const [first, ...videos] = await this.songFinder.getPlaylistSongs(link);

      const { isValid, validationMessage } = this.validateParams(
        channelId,
        guildId,
        adapterCreator,
        link,
        first,
        videos
      );

      if (!isValid) {
        await message.reply(`${validationMessage}`);
        return;
      }

      await this.player.play(channelId, guildId, adapterCreator, first);
      this.queueManager.pushBatch(videos);

      await message.reply(`Playlist added to queue`);

      return;
    } catch (e) {
      await message.reply(`Something went wrong ${e?.message ?? "Unknown"}`);
    }
  }

  shouldExecute(message: Message<boolean>) {
    return message.content.includes(this.actionTrigger);
  }

  validateParams(
    channelId: string,
    guildId: string,
    adapterCreator: InternalDiscordGatewayAdapterCreator,
    link: string,
    firstVideo: ISong,
    restVideos: ISong[]
  ): IParamsValidationResult {
    if (!channelId || !guildId || !adapterCreator) {
      return {
        isValid: false,
        validationMessage: "You should be in a voice channel to play an music",
      };
    }

    if (!link) {
      return {
        isValid: false,
        validationMessage:
          "You should type a music you want to play after the message",
      };
    }

    if (!firstVideo) {
      return {
        isValid: false,
        validationMessage: "The list should have at least 1 video",
      };
    }

    if (!Array.isArray(restVideos)) {
      return {
        isValid: false,
        validationMessage: "Rest videos should be an array",
      };
    }

    return { isValid: true, validationMessage: "true" };
  }
}
