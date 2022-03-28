import axios from "axios";
import { Message } from "discord.js";
import { riotGamesRepository } from "../../../repositories/riot-games/riot-games.repository";
import { ISummoner } from "../../../repositories/summoner/summoner.entity";
import { summonerRepository } from "../../../repositories/summoner/summoner.repository";
import { MessageUtils } from "../../../utils/message.utils";

import { OnMessageReceiveActionCreator } from "../interfaces";
import { RankBuilder } from "./helpers/build-rank.helper";
import { RankPointsCalculator } from "./helpers/rank-points-calculator.helper";
import { SummonerRankData } from "./interfaces/interfaces";

export class GuildLeagueOfLegendsRank implements OnMessageReceiveActionCreator {
  actionTrigger: string;
  summonerRepository = summonerRepository;
  riotRepository = riotGamesRepository;

  constructor(actionTrigger: string) {
    this.actionTrigger = actionTrigger;
  }

  async execute(message: Message<boolean>) {
    if (message.content.includes(this.actionTrigger)) {
      const guildId = MessageUtils.getGuildId(message);

      if (!guildId) {
        message.reply("Guild id not provided");
        return;
      }

      const players = await this.summonerRepository.getAll(guildId);

      if (players.error) {
        message.reply(`Something went wrong ${players.message}`);
        return;
      }

      const playersName = this.getPlayersNames(players.data);

      const summonersRankData = await this.getRank(playersName, message);

      if (!summonersRankData.length) {
        message.reply("No data available yet");
        return;
      }

      const messageResponse = this.formatMessage(summonersRankData);

      message.reply(messageResponse);
    }
  }

  private formatMessage(players: SummonerRankData[]) {
    let data = "";
    let i = 1;

    for (const player of players) {
      data += `⭐ ${i} - ${player.summonerName} = ${player.points}\n`;
      i += 1;
    }

    return data;
  }

  private async getRank(summoners: string[], message: Message<boolean>) {
    const playersRankData: SummonerRankData[] = [];

    const rankPointsCalculator = new RankPointsCalculator();
    const rankBuilder = new RankBuilder();

    for (const summoner of summoners) {
      console.log(`[${summoner}] Fetching data`);
      const summonerAccountInfo = await this.riotRepository.getSummonerInfo(
        summoner
      );
      if (!summonerAccountInfo) {
        message.reply(`No data available for ${summoner}`);
      }

      const summonerQueueData = await this.riotRepository.getSummonerLeagueData(
        summonerAccountInfo
      );

      if (!summonerQueueData) {
        message.reply(`No queue data available from ${summoner}`);
      }

      console.log(`[${summoner}] Calculating ranking points`);
      const playerRankPoints =
        rankPointsCalculator.calculateSummonerPoints(summonerQueueData);

      playersRankData.push(playerRankPoints);
    }

    return rankBuilder.buildRank(playersRankData);
  }

  getPlayersNames(players: ISummoner[]) {
    return players.map((p) => p.summonerName);
  }
}
