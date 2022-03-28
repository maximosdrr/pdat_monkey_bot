import DiscordJs from "discord.js";

export interface OnMessageReceiveActionCreator {
  execute(message: DiscordJs.Message): any;
}
