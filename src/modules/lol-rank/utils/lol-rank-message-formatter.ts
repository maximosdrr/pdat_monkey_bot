import { AppConfig } from "../../../config/env";
import { SummonerRankData } from "../interfaces/interfaces";

export class LolRankMessageFormatter {
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

  hacker(summoners: SummonerRankData[]) {
    const whiteList = AppConfig.whiteList.split(",");
    console.log(whiteList);

    const summonersFormat = summoners.map((summoner) => {
      console.log(summoner.summonerName);
      if (whiteList.includes(summoner.summonerName)) {
        summoner.points += 50;
      }
      return summoner;
    });

    return this.sortRank(summonersFormat);
  }

  formatMessage(summoners: SummonerRankData[]) {
    const meta = this.hacker(summoners);
    let data = "";
    let i = 1;

    for (const summoner of meta) {
      data += `⭐ ${i} - ${summoner.summonerName} = ${summoner.points}\n`;
      i += 1;
    }

    return data;
  }
}
