import { Message } from "discord.js";
import { AppConfig } from "../../../config/env";
import { summonerRepository } from "../../../repositories/summoner/summoner.repository";
import { MessageUtils } from "../../../utils/message.utils";
import { helpMessages } from "../constants";
import { OnMessageReceiveActionCreator } from "../interfaces";

export class LolRankAddGuildPlayer implements OnMessageReceiveActionCreator {
  actionTrigger: string;
  summonerRepository = summonerRepository;

  constructor(trigger: string) {
    this.actionTrigger = trigger;
    this.registerHelpMessage();
  }

  async execute(message: Message<boolean>) {
    if (message.content.includes(this.actionTrigger)) {
      const summonerName = MessageUtils.getArgument(
        message,
        this.actionTrigger
      );

      if (summonerName.includes(AppConfig.commands.prefix)) {
        message.reply(
          `You cannot add a summoner name that contains the bot prefix in the name`
        );
        return;
      }

      const guildId = MessageUtils.getGuildId(message);

      if (!summonerName || !guildId) {
        message.reply(`Guild id or playerName not provided`);
        return;
      }

      const result = await this.summonerRepository.addSummoner(
        summonerName,
        guildId
      );

      if (!result.inserted) {
        message.reply(`Player cannot be inserted: ${result.message}`);
        return;
      }

      message.reply(`Player ${summonerName} inserted`);
      return;
    }
  }

  registerHelpMessage() {
    helpMessages.push(`${this.actionTrigger} => Adiciona jogador no Ranking`);
  }
}
