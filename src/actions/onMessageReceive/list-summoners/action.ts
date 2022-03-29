import { Message } from "discord.js";
import { summonerRepository } from "../../../repositories/summoner/summoner.repository";
import { MessageUtils } from "../../../utils/message.utils";
import { OnMessageReceiveActionCreator } from "../interfaces";
import { MessageFormatter } from "./message-formatter";

export class LolRankListPlayers implements OnMessageReceiveActionCreator {
  actionTrigger: string;
  summonerRepository = summonerRepository;
  formatter = new MessageFormatter();

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

      const messageResponse = this.formatter.formatMessage(playersResult.data);

      message.reply(messageResponse);
      return;
    }
  }
}
