import { Message } from "discord.js";
import { SongPlayer } from "../../helpers/song-player";
import { OnMessageReceiveActionCreator } from "../../../../shared/interfaces";

export class StopMusic implements OnMessageReceiveActionCreator {
  actionTrigger: string;

  constructor(trigger: string, private player: SongPlayer) {
    this.actionTrigger = trigger;
  }

  async execute(message: Message<boolean>) {
    if (!this.shouldExecute(message)) {
      return;
    }

    try {
      await message.reply(`Stopping music`);
      await this.player.stop();
    } catch (e) {
      await message.reply(`Something went wrong ${e.message}`);
    }
  }

  shouldExecute(message: Message<boolean>) {
    return message.content.includes(this.actionTrigger);
  }
}
