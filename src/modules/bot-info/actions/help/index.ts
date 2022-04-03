import { Message } from "discord.js";
import { AppConfig } from "../../../../config/env";
import { OnMessageReceiveActionCreator } from "../../../../shared/interfaces";

export class GetHelp implements OnMessageReceiveActionCreator {
  actionTrigger: string;

  constructor(trigger: string) {
    this.actionTrigger = trigger;
  }

  execute(message: Message<boolean>) {
    if (!this.shouldExecute(message)) {
      return;
    }

    message.reply("messageContent");
    return;
  }

  shouldExecute(message: Message<boolean>) {
    return message.content.includes(this.actionTrigger);
  }
}
