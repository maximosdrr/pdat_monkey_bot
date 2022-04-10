import { Message } from "discord.js";
import { SongPlayer } from "../../helpers/song-player";
import { Action } from "../../../../shared/action.abstract";

export class StopMusic extends Action {
  constructor(trigger: string, private player: SongPlayer) {
    super(trigger);
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
}
