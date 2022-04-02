import DiscordJs from "discord.js";

export interface OnMessageReceiveActionCreator {
  actionTrigger: string;
  registerHelpMessage(): any;
  execute(message: DiscordJs.Message): any;
}
