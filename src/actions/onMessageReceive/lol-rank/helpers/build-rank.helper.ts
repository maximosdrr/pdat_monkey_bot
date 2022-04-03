import { Message } from "discord.js";
import { riotGamesRepository } from "../../../../repositories/riot-games/riot-games.repository";
import { ISummoner } from "../../../../repositories/summoner/summoner.entity";
import { summonerRepository } from "../../../../repositories/summoner/summoner.repository";
import { SummonerRankData } from "../interfaces";
import { RankPointsCalculator } from "./rank-points-calculator.helper";

export class RankBuilder {
  private riotRepository = riotGamesRepository;

  private sortRank(playersQueueData: SummonerRankData[]): SummonerRankData[] {
    const sorted = playersQueueData.sort((a, b) => {
      if (a.points > b.points) {
        return -1;
      }

      if (b.points > a.points) {
        return 1;
      }

      return 0;
    });

    return sorted;
  }

  async buildRank(summoners: string[], message: Message<boolean>) {
    const summonersRankData: SummonerRankData[] = [];

    const rankPointsCalculator = new RankPointsCalculator();
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
        return [];
      }

      console.log(`[ ${summoner} ] Calculating ranking points`);
      const summonerPoints =
        rankPointsCalculator.calculateSummonerPoints(summonerQueueData);

      if (summonerPoints) {
        summonersRankData.push(summonerPoints);
      }
    }

    return this.sortRank(summonersRankData);
  }
}
