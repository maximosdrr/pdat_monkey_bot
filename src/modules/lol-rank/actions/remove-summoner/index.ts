import { Message } from "discord.js";
import { Action } from "../../../../shared/action.abstract";
import { IParamsValidationResult } from "../../../../shared/interfaces";
import { MessageUtils } from "../../../../utils/message.utils";
import { SummonerRepository } from "../../repositories/summoner/summoner.repository";

export class LolRankRemoveGuildPlayer extends Action {
  constructor(trigger: string, private summonerRepository: SummonerRepository) {
    super(trigger);
  }

  async execute(message: Message<boolean>) {
    if (!this.shouldExecute(message)) {
      return;
    }

    const guildId = MessageUtils.getGuildId(message);
    const summonerName = MessageUtils.getArgument(message, this.actionTrigger);

    const { isValid, validationMessage } = this.validateParams(
      summonerName,
      guildId
    );

    if (!isValid) {
      await message.reply(validationMessage);
      return;
    }

    const result = await this.summonerRepository.deleteOne(
      summonerName,
      guildId
    );

    if (result.error) {
      message.reply(`Something went wrong ${result.message}`);
      return;
    }

    message.reply(`${summonerName} deleted`);
    return;
  }

  validateParams(
    summonerName: string,
    guildId: string
  ): IParamsValidationResult {
    if (!guildId) {
      return {
        isValid: false,
        validationMessage: "Guild id not provided",
      };
    }

    if (!summonerName) {
      return {
        isValid: false,
        validationMessage: "Summoner Name name not provided",
      };
    }

    return {
      isValid: true,
      validationMessage: "success",
    };
  }
}
