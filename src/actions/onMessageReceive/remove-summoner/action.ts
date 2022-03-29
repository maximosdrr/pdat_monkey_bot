import { Message } from "discord.js";
import { summonerRepository } from "../../../repositories/summoner/summoner.repository";
import { MessageUtils } from "../../../utils/message.utils";
import { OnMessageReceiveActionCreator } from "../interfaces";

export class LolRankRemoveGuildPlayer implements OnMessageReceiveActionCreator {
  actionTrigger: string;
  summonerRepository = summonerRepository;

  constructor(trigger: string) {
    this.actionTrigger = trigger;
  }

  async execute(message: Message<boolean>) {
    if (message.content.includes(this.actionTrigger)) {
      const guildId = MessageUtils.getGuildId(message);
      const summonerName = MessageUtils.getArgument(message, "-name");

      if (!guildId) {
        message.reply(`Guild id not provided`);
        return;
      }

      if (!summonerName) {
        message.reply(`SummonerName name not provided`);
        return;
      }

      const result = await this.summonerRepository.deleteOne(
        summonerName,
        guildId
      );

      if (result.error) {
        message.reply(`Something went wrong ${result.message}`);
        return;
      }

      message.reply(`${summonerName} deleted`);
      return;
    }
  }
}
