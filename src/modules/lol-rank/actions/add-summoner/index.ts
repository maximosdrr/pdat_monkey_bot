import { Message } from "discord.js";
import { AppConfig } from "../../../../config/env";
import {
  IParamsValidationResult,
  OnMessageReceiveActionCreator,
} from "../../../../shared/interfaces";
import { MessageUtils } from "../../../../utils/message.utils";
import { SummonerRepository } from "../../repositories/summoner/summoner.repository";

export class LolRankAddGuildPlayer implements OnMessageReceiveActionCreator {
  actionTrigger: string;

  constructor(trigger: string, private summonerRepository: SummonerRepository) {
    this.actionTrigger = trigger;
  }

  async execute(message: Message<boolean>) {
    if (!this.shouldExecute(message)) {
      return;
    }

    const summonerName = MessageUtils.getArgument(message, this.actionTrigger);
    const guildId = MessageUtils.getGuildId(message);

    const { isValid, validationMessage } = this.validateParams(
      summonerName,
      guildId
    );

    if (!isValid) {
      await message.reply(validationMessage);
      return;
    }

    const result = await this.summonerRepository.addSummoner(
      summonerName,
      guildId
    );

    if (!result.inserted) {
      message.reply(`Player cannot be inserted: ${result.message}`);
      return;
    }

    message.reply(`Player ${summonerName} inserted`);
    return;
  }

  shouldExecute(message: Message<boolean>) {
    return message.content.includes(this.actionTrigger);
  }

  validateParams(
    summonerName: string,
    guildId: string
  ): IParamsValidationResult {
    if (summonerName.includes(AppConfig.commands.prefix)) {
      return {
        isValid: false,
        validationMessage: "Summoner name cannot include the bot prefix",
      };
    }

    if (!summonerName || !guildId) {
      return {
        isValid: false,
        validationMessage: "Guild id or playerName not provided",
      };
    }

    return { isValid: true, validationMessage: "success" };
  }
}
