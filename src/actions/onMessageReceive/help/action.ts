import { Message } from "discord.js";
import { OnMessageReceiveActionCreator } from "../interfaces";
import { helpMessages } from "../constants";
import { AppConfig } from "../../../config/env";

export class GetHelp implements OnMessageReceiveActionCreator {
  actionTrigger: string;

  constructor(trigger: string) {
    this.actionTrigger = trigger;
    this.registerHelpMessage();
  }

  execute(message: Message<boolean>) {
    if (message.content.includes(this.actionTrigger)) {
      const messageContent = this.getMessageContent();
      message.reply(messageContent);
      return;
    }
  }

  getMessageContent() {
    const messageContent = helpMessages
      .map((message) => message.replace(AppConfig.commands.prefix, ""))
      .join("\n");

    return messageContent;
  }

  registerHelpMessage() {
    helpMessages.push(`Todos os comandos devem começar com `);
  }
}
