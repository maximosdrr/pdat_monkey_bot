import { Message } from "discord.js";
import { MessageUtils } from "../../../../utils/message.utils";
import {
  IParamsValidationResult,
  OnMessageReceiveActionCreator,
} from "../../../../shared/interfaces";
import { ListSummonerMessageFormatter } from "../../utils/list-summoner-formatter";
import { SummonerRepository } from "../../repositories/summoner/summoner.repository";

export class LolRankListPlayers implements OnMessageReceiveActionCreator {
  actionTrigger: string;

  constructor(
    trigger: string,
    private summonerRepository: SummonerRepository,
    private formatter: ListSummonerMessageFormatter
  ) {
    this.actionTrigger = trigger;
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

  shouldExecute(message: Message<boolean>) {
    return message.content.includes(this.actionTrigger);
  }

  validateParams(guildId: string): IParamsValidationResult {
    if (!guildId) {
      return { isValid: false, validationMessage: "Guild id not provided" };
    }

    return { isValid: true, validationMessage: "Success" };
  }
}
