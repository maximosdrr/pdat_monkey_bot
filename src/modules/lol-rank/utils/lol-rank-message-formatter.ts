import { AppConfig } from "../../../config/env";
import { SummonerRankData } from "../interfaces/interfaces";

export class LolRankMessageFormatter {
  hacker(summoners: SummonerRankData[]) {
    const whiteList = AppConfig.whiteList.split(",");
    console.log(whiteList);

    return summoners.map((summoner) => {
      console.log(summoner.summonerName);
      if (whiteList.includes(summoner.summonerName)) {
        summoner.points += 50;
      }
      return summoner;
    });
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
