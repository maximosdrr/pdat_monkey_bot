import { Message } from "discord.js";
import { ISummoner } from "../../../repositories/summoner/summoner.entity";
import { summonerRepository } from "../../../repositories/summoner/summoner.repository";
import { MessageUtils } from "../../../utils/message.utils";
import { helpMessages } from "../constants";

import { OnMessageReceiveActionCreator } from "../interfaces";
import { RankBuilder } from "./helpers/build-rank.helper";
import { MessageFormatter } from "./message-formatter";

export class GuildLeagueOfLegendsRank implements OnMessageReceiveActionCreator {
  actionTrigger: string;
  summonerRepository = summonerRepository;
  messageFormatter = new MessageFormatter();
  rankBuilder = new RankBuilder();

  constructor(actionTrigger: string) {
    this.actionTrigger = actionTrigger;
    this.registerHelpMessage();
  }

  async execute(message: Message<boolean>) {
    if (message.content.includes(this.actionTrigger)) {
      const guildId = MessageUtils.getGuildId(message);

      if (!guildId) {
        message.reply("Guild id not provided");
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
  }

  getPlayersNames(players: ISummoner[]) {
    return players.map((p) => p.summonerName);
  }

  registerHelpMessage() {
    helpMessages.push(
      `${this.actionTrigger} => Mostra a pontuação dos jogadores no ranking (Vitorias +3pts, Derrotas -2pts)`
    );
  }
}
