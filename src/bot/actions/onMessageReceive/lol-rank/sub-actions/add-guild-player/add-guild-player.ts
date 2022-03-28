import { Message } from "discord.js";
import { prismaClient } from "../../../../../../database/prisma.orm";
import { OnMessageReceiveActionCreator } from "../../../../../../interfaces";

export class LolRankAddGuildPlayer implements OnMessageReceiveActionCreator {
  actionTrigger: string;

  constructor(trigger: string) {
    this.actionTrigger = trigger;
  }

  async execute(message: Message<boolean>) {
    if (message.content.includes(this.actionTrigger)) {
      const summonerName = this.getPlayerName(message);
      const guildId = this.getGuildId(message);

      if (!summonerName || !guildId) {
        message.reply(`Guild id or playerName not provided`);
        return;
      }

      const result = await this.addPlayer(summonerName, guildId);

      if (!result.inserted) {
        message.reply(`Player cannot be inserted: ${result.message}`);
        return;
      }

      message.reply(`Player ${summonerName} inserted`);
      return;
    }
  }

  async addPlayer(summonerName: string, guildId: string) {
    try {
      await prismaClient.player.create({
        data: {
          guildId: guildId,
          summonerName: summonerName,
        },
      });
      return { inserted: true, message: "sucess" };
    } catch (e) {
      return { inserted: false, message: `${e.message || "Unknown"}` };
    }
  }

  private getPlayerName(message: Message<boolean>) {
    return message?.content?.split("-name")[1];
  }

  private getGuildId(message: Message<boolean>) {
    return message.guild.id;
  }
}
