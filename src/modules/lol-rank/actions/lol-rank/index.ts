import { Message } from "discord.js";
import { ISummoner } from "../../repositories/summoner/summoner.entity";
import { SummonerRepository } from "../../repositories/summoner/summoner.repository";
import { MessageUtils } from "../../../../utils/message.utils";

import { IParamsValidationResult } from "../../../../shared/interfaces";
import { LolRankMessageFormatter } from "../../utils/lol-rank-message-formatter";
import { RankBuilder } from "../../utils/build-rank.helper";
import { Action } from "../../../../shared/action.abstract";

export class GuildLeagueOfLegendsRank extends Action {
  constructor(
    actionTrigger: string,
    private summonerRepository: SummonerRepository,
    private rankBuilder: RankBuilder,
    private messageFormatter: LolRankMessageFormatter
  ) {
    super(actionTrigger);
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

    const summoners = await this.summonerRepository.getAll(guildId);

    if (summoners.error) {
      message.reply(`Something went wrong ${summoners.message}`);
      return;
    }

    const playersNames = this.getPlayersNames(summoners.data);
    const summonersRankData = await this.rankBuilder.buildRank(
      playersNames,
      message
    );

    if (!summonersRankData.length) {
      message.reply("No data available yet");
      return;
    }

    const messageResponse =
      this.messageFormatter.formatMessage(summonersRankData);

    message.reply(messageResponse);
  }

  getPlayersNames(players: ISummoner[]) {
    return players.map((p) => p.summonerName);
  }

  validateParams(guildId: string): IParamsValidationResult {
    if (!guildId) {
      return {
        isValid: false,
        validationMessage: "Guild id not provided",
      };
    }

    return {
      isValid: true,
      validationMessage: "Success",
    };
  }
}
