import { Message } from "discord.js";

export class MessageUtils {
  static getGuildId(message: Message<boolean>) {
    return message?.guild?.id;
  }

  static getArgument(message: Message<boolean>, arg: string) {
    return message?.content
      ?.toLocaleLowerCase()
      .split(arg.toLocaleLowerCase())[1];
  }
}
