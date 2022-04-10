import { Message } from "discord.js";
import { OnMessageReceiveActionCreator } from "../../../../shared/interfaces";
import { SongQueue } from "../../helpers/queue";

export class GetQueueInfo implements OnMessageReceiveActionCreator {
  actionTrigger: string;

  constructor(trigger: string, private songQueue: SongQueue) {
    this.actionTrigger = trigger;
  }

  async execute(message: Message<boolean>) {
    if (!this.shouldExecute(message)) {
      return;
    }

    const replyMessage = this.getReplyMessage();
    await message.reply(replyMessage);
  }

  getReplyMessage() {
    const message = this.songQueue.getSongsAsString();

    if (!message.length) {
      return "No more songs ahead";
    }

    return message;
  }

  shouldExecute(message: Message<boolean>) {
    return message.content.includes(this.actionTrigger);
  }
}
