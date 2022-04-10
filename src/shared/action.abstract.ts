import { Message } from "discord.js";

export abstract class Action {
  abstract execute(message: Message): any;
  actionTrigger: string;

  constructor(trigger: string) {
    this.actionTrigger = trigger;
  }

  shouldExecute(message: Message<boolean>) {
    const triggerContent = this.actionTrigger.toLocaleLowerCase();
    const messageContent = message.content.toLocaleLowerCase();

    return messageContent.includes(triggerContent);
  }
}
