import { InternalDiscordGatewayAdapterCreator, Message } from "discord.js";
import { SongPlayer } from "../../helpers/song-player";
import { IParamsValidationResult } from "../../../../shared/interfaces";
import { SongFinder } from "../../helpers/song-finder";
import { MessageUtils } from "../../../../utils/message.utils";
import { ISong } from "../../interfaces/interfaces";
import { Action } from "../../../../shared/action.abstract";

export class PlayMusic extends Action {
  constructor(
    actionTrigger: string,
    private songFinder: SongFinder,
    private player: SongPlayer
  ) {
    super(actionTrigger);
  }

  async execute(message: Message<boolean>) {
    if (!this.shouldExecute(message)) {
      return;
    }

    const channelId = message.member?.voice?.channel?.id;
    const guildId = message?.guild?.id;
    const adapterCreator = message?.guild?.voiceAdapterCreator;
    const searchTerm = MessageUtils.getArgument(message, this.actionTrigger);

    const { isValid, validationMessage } = this.validateParams(
      channelId,
      guildId,
      adapterCreator,
      searchTerm
    );

    if (!isValid) {
      await message.reply(validationMessage);
      return;
    }

    try {
      const song = await this.songFinder.getSong(searchTerm);
      const replyMessage = this.getReplyMessage(song);

      await message.reply(replyMessage);
      await this.player.play(channelId, guildId, adapterCreator, song);
    } catch (e) {
      await message.reply(`Something went wrong ${e?.message}`);
    }
  }

  getReplyMessage(song: ISong) {
    if (!this.player.isPlayingSomething()) {
      return `Now playing: ${song.title} - Duration ${song.duration} seconds`;
    }

    return `added ${song.title} to queue - Duration ${song.duration} seconds`;
  }

  validateParams(
    channelId: string,
    guildId: string,
    adapterCreator: InternalDiscordGatewayAdapterCreator,
    searchTerm: string
  ): IParamsValidationResult {
    if (!channelId || !guildId || !adapterCreator) {
      return {
        isValid: false,
        validationMessage: "You should be in a voice channel to play an music",
      };
    }

    if (!searchTerm) {
      return {
        isValid: false,
        validationMessage:
          "You should type a music you want to play after the message",
      };
    }

    return { isValid: true, validationMessage: "true" };
  }
}
