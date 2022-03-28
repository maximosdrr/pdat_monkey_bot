import { Player } from "@prisma/client";
import { Message } from "discord.js";
import { prismaClient } from "../../../../../../database/prisma.orm";
import { OnMessageReceiveActionCreator } from "../../../../../../interfaces";

export class LolRankListPlayers implements OnMessageReceiveActionCreator {
  actionTrigger: string;

  constructor(trigger: string) {
    this.actionTrigger = trigger;
  }

  async execute(message: Message<boolean>) {
    if (message.content.includes(this.actionTrigger)) {
      const guildId = this.getGuildId(message);

      if (!guildId) {
        message.reply("Guild id not provided");
        return;
      }

      const playersResult = await this.getPlayers(guildId);

      if (playersResult.error) {
        message.reply(`Something went wrong ${playersResult.message}`);
        return;
      }

      const messageResponse = this.formatPlayers(playersResult.data);

      message.reply(messageResponse);
      return;
    }
  }

  getGuildId(message: Message<boolean>) {
    return message?.guild?.id;
  }

  formatPlayers(players: Player[]): string {
    let data = "";

    for (const player of players) {
      data += `Id: ${player.id} - Summoner Name: ${player.summonerName}\n`;
    }

    return data;
  }

  async getPlayers(guildId: string) {
    try {
      const players = await prismaClient.player.findMany({
        where: {
          guildId: guildId,
        },
      });

      return { data: players, message: "Found", error: false };
    } catch (e) {
      return { data: [], message: e.message, error: true };
    }
  }
}
