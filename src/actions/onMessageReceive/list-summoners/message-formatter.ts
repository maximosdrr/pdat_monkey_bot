import { ISummoner } from "../../../repositories/summoner/summoner.entity";

export class MessageFormatter {
  formatMessage(players: ISummoner[]): string {
    let data = "";

    for (const player of players) {
      data += `Id: ${player.id} - Summoner Name: ${player.summonerName}\n`;
    }

    return data;
  }
}
