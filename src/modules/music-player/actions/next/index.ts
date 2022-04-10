import { Message } from "discord.js";
import { SongPlayer } from "../../helpers/song-player";
import { Action } from "../../../../shared/action.abstract";

export class SkipMusic extends Action {
  constructor(trigger: string, private player: SongPlayer) {
    super(trigger);
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
}
