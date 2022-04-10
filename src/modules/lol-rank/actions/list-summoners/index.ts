import { Message } from "discord.js";
import { MessageUtils } from "../../../../utils/message.utils";
import { IParamsValidationResult } from "../../../../shared/interfaces";
import { ListSummonerMessageFormatter } from "../../utils/list-summoner-formatter";
import { SummonerRepository } from "../../repositories/summoner/summoner.repository";
import { Action } from "../../../../shared/action.abstract";

export class LolRankListPlayers extends Action {
  constructor(
    trigger: string,
    private summonerRepository: SummonerRepository,
    private formatter: ListSummonerMessageFormatter
  ) {
    super(trigger);
  }

  async execute(message: Message<boolean>) {
    if (!this.shouldExecute(message)) {
      return;
    }

    const guildId = MessageUtils.getGuildId(message);
    const { isValid, validationMessage } = this.validateParams(guildId);

    if (!isValid) {
      await message.reply(validationMessage);
      return;
    }

    const playersResult = await this.summonerRepository.getAll(guildId);

    if (!playersResult.data.length) {
      message.reply(`No summoners registered yet`);
      return;
    }

    if (playersResult.error) {
      message.reply(`Something went wrong ${playersResult.message}`);
      return;
    }

    const messageResponse = this.formatter.formatMessage(playersResult.data);

    message.reply(messageResponse);
    return;
  }

  validateParams(guildId: string): IParamsValidationResult {
    if (!guildId) {
      return { isValid: false, validationMessage: "Guild id not provided" };
    }

    return { isValid: true, validationMessage: "Success" };
  }
}
