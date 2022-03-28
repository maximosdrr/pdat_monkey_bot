import DiscordJs from "discord.js";

export interface OnMessageReceiveActionCreator {
  actionTrigger: string;
  execute(message: DiscordJs.Message): any;
}
