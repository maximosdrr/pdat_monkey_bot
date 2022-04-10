import { SummonerRankData } from "../interfaces/interfaces";

export class LolRankMessageFormatter {
  formatMessage(summoners: SummonerRankData[]) {
    let data = "";
    let i = 1;

    for (const summoner of summoners) {
      data += `⭐ ${i} - ${summoner.summonerName} = ${summoner.points}\n`;
      i += 1;
    }

    return data;
  }
}
