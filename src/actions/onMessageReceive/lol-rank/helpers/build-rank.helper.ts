import {  SummonerRankData } from "../interfaces/interfaces";

export class RankBuilder {
  buildRank(playersQueueData: SummonerRankData[]): SummonerRankData[] {
    const sorted = playersQueueData.sort((a, b) => {
      if(a.points > b.points) {
        return -1;
      }

      if(b.points > a.points) {
        return 1
      }

      return 0;
    });

    return sorted;
  }

}
