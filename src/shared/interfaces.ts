import DiscordJs from "discord.js";

export interface IParamsValidationResult {
  isValid: boolean;
  validationMessage: string;
}

export interface OnMessageReceiveActionCreator {
  actionTrigger: string;
  execute(message: DiscordJs.Message): any;
  shouldExecute(message: DiscordJs.Message): any;
}
