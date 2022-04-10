import { Message } from "discord.js";
import { Action } from "../../../../shared/action.abstract";
import { SongQueue } from "../../helpers/queue";

export class GetQueueInfo extends Action {
  actionTrigger: string;

  constructor(trigger: string, private songQueue: SongQueue) {
    super(trigger);
  }

  async execute(message: Message<boolean>) {
    try {
      if (!this.shouldExecute(message)) {
        return;
      }

      const replyMessage = this.getReplyMessage();
      await message.reply(replyMessage);
    } catch (e) {
      await message.reply(`Something went wrong: ${e?.message ?? "unknown"}`);
    }
  }

  getReplyMessage() {
    let message = this.songQueue.getSongsAsString();
    message = this.sliceMessage(message);

    if (!message.length) {
      return "No more songs ahead";
    }

    return message;
  }

  sliceMessage(message: string) {
    const messageSlice = message.slice(0, 1990);
    return `${messageSlice}\n...`;
  }
}
