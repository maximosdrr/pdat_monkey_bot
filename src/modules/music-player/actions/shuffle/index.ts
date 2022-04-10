import { Message } from "discord.js";
import { Action } from "../../../../shared/action.abstract";
import { SongQueue } from "../../helpers/queue";

export class ShuffleQueue extends Action {
  constructor(trigger: string, private readonly queueManager: SongQueue) {
    super(trigger);
  }

  async execute(message: Message<boolean>) {
    try {
      if (!this.shouldExecute(message)) {
        return;
      }

      this.queueManager.shuffleQueue();

      message.reply(`Queue shuffled`);
    } catch (e) {
      message.reply(`Something went wrong ${e?.message ?? "unknown"}`);
    }
  }
}
