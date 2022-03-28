import { Message } from "discord.js";
import { ISummoner } from "../../../repositories/summoner/summoner.entity";
import { summonerRepository } from "../../../repositories/summoner/summoner.repository";
import { MessageUtils } from "../../../utils/message.utils";
import { OnMessageReceiveActionCreator } from "../interfaces";

export class LolRankListPlayers implements OnMessageReceiveActionCreator {
  actionTrigger: string;
  summonerRepository = summonerRepository;

  constructor(trigger: string) {
    this.actionTrigger = trigger;
  }

  async execute(message: Message<boolean>) {
    if (message.content.includes(this.actionTrigger)) {
      const guildId = MessageUtils.getGuildId(message);

      if (!guildId) {
        message.reply("Guild id not provided");
        return;
      }

      const playersResult = await this.summonerRepository.getAll(guildId);

      if (!playersResult.data.length) {
        message.reply(`No summoners registered yet`);
        return;
      }

      if (playersResult.error) {
        message.reply(`Something went wrong ${playersResult.message}`);
        return;
      }

      const messageResponse = this.formatPlayers(playersResult.data);

      message.reply(messageResponse);
      return;
    }
  }

  formatPlayers(players: ISummoner[]): string {
    let data = "";

    for (const player of players) {
      data += `Id: ${player.id} - Summoner Name: ${player.summonerName}\n`;
    }

    return data;
  }
}
