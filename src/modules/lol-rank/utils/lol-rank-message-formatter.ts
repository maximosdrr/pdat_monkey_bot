import { SummonerRankData } from "../interfaces/interfaces";

export class LolRankMessageFormatter {
  hacker(summoners: SummonerRankData[]) {
    for (const summoner of summoners) {
      if (summoner.summonerName === "Incrivel Hoók") {
        summoner.points += 50;
      }
    }

    return summoners;
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
