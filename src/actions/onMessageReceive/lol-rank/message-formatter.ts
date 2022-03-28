import { SummonerRankData } from "./interfaces";

export class MessageFormatter {
  formatMessage(players: SummonerRankData[]) {
    let data = "";
    let i = 1;

    for (const player of players) {
      data += `⭐ ${i} - ${player.summonerName} = ${player.points}\n`;
      i += 1;
    }

    return data;
  }
}
