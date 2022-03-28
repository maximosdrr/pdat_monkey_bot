import axios from "axios";
import { Message } from "discord.js";
import { AppConfig } from "../../../../config/env";

import { OnMessageReceiveActionCreator } from "../../../../interfaces";
import { RankBuilder } from "./build-rank.helper";
import { SummonerRankData } from "./interfaces";
import { RankPointsCalculator } from "./rank-points-calculator.helper";
import { RiotDataFetcher } from "./riot-data-fetcher.helper";

export class GuildLeagueOfLegendsRank implements OnMessageReceiveActionCreator {
  names = [
    "Percatinha",
    "odeio aquela cor",
    "Frank Destruição",
    "Belicous",
    "Rocàm",
    "ErickinPic4DeMel",
    "o TTu",
    "imolbmit",
    "TZora",
    "Cabo Acácio",
    "Iron Kaiser",
  ];

  async execute(message: Message<boolean>) {
    if (message.content === "@playersRank") {
      let data = "";
      let i = 1;
      const players = await this.getRank(this.names, message);

      for (const player of players) {
        data += `⭐ ${i} - ${player.summonerName} = ${player.points}\n`;
        i += 1;
      }

      message.reply(data);
    }
  }

  private async getRank(summoners: string[], message: Message<boolean>) {
    const playersRankData: SummonerRankData[] = [];

    const rankPointsCalculator = new RankPointsCalculator();
    const rankBuilder = new RankBuilder();
    const riotDataFetcher = new RiotDataFetcher(); 


    for (const summoner of summoners) {
      const summonerAccountInfo = await riotDataFetcher.getSummonerInfo(summoner);
      if(!summonerAccountInfo) {
        message.reply(`No data available for ${summoner}`)
      }

      
      const summonerQueueData = await riotDataFetcher.getSummonerLeagueData(summonerAccountInfo);

      if(!summonerQueueData) {
        message.reply(`No queue data available from ${summoner}`);
      }

      const playerRankPoints = rankPointsCalculator.calculateSummonerPoints(summonerQueueData);

      playersRankData.push(playerRankPoints);
    }


    return rankBuilder.buildRank(playersRankData);
  }
}
