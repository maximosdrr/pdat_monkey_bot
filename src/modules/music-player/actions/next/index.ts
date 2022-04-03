import { Message } from "discord.js";
import { SongPlayer } from "../../helpers/song-player";
import { OnMessageReceiveActionCreator } from "../../../../shared/interfaces";

export class SkipMusic implements OnMessageReceiveActionCreator {
  actionTrigger: string;

  constructor(trigger: string, private player: SongPlayer) {
    this.actionTrigger = trigger;
  }

  async execute(message: Message<boolean>) {
    if (!this.shouldExecute(message)) {
      return;
    }

    try {
      await message.reply(`Skipping music`);
      await this.player.next();
    } catch (e) {
      message.reply(`Something went wrong ${e.message ?? "Unknown"}`);
    }
  }

  shouldExecute(message: Message<boolean>) {
    return message.content.includes(this.actionTrigger);
  }
}
