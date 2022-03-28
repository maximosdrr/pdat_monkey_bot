import { Message } from "discord.js";
import { prismaClient } from "../../../../../../database/prisma.orm";
import { OnMessageReceiveActionCreator } from "../../../../../../interfaces";

export class LolRankRemoveGuildPlayer implements OnMessageReceiveActionCreator {
  actionTrigger: string;

  constructor(trigger: string) {
    this.actionTrigger = trigger;
  }

  async execute(message: Message<boolean>) {
    if (message.content.includes(this.actionTrigger)) {
      const guildId = this.getGuildId(message);
      const summonerName = this.getPlayerName(message);

      if (!guildId) {
        message.reply(`Guild id not provided`);
        return;
      }

      if (!summonerName) {
        message.reply(`SummonerName name not provided`);
        return;
      }

      const result = await this.deletePlayer(summonerName, guildId);

      if (result.error) {
        message.reply(`Something went wrong ${result.message}`);
        return;
      }

      message.reply(`${summonerName} deleted`);
      return;
    }
  }

  private getGuildId(message: Message<boolean>) {
    return message?.guild?.id;
  }

  private getPlayerName(message: Message<boolean>) {
    return message?.content?.split("-name")[1];
  }

  private async getSummonerByNameAndGuild(
    summonerName: string,
    guildId: string
  ) {
    try {
      const result = await prismaClient.player.findFirst({
        where: {
          summonerName,
          guildId,
        },
      });

      return { error: false, message: "success", data: result };
    } catch (e) {
      return { error: true, message: e.message, data: null };
    }
  }

  private async deletePlayer(summonerName: string, guildId: string) {
    const playerData = await this.getSummonerByNameAndGuild(
      summonerName,
      guildId
    );

    if (playerData.error || !playerData.data) {
      return {
        error: true,
        message: "error trying found player",
        deleted: false,
      };
    }
    try {
      await prismaClient.player.delete({
        where: { summonerName_guildId: { guildId, summonerName } },
      });

      return {
        error: false,
        message: "success",
        deleted: true,
      };
    } catch (e) {
      return {
        error: true,
        message: "error when trying delete player",
        deleted: false,
      };
    }
  }
}
