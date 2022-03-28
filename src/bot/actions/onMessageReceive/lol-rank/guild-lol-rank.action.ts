import { Player } from "@prisma/client";
import axios from "axios";
import { Message } from "discord.js";
import { AppConfig } from "../../../../config/env";
import { prismaClient } from "../../../../database/prisma.orm";

import { OnMessageReceiveActionCreator } from "../../../../interfaces";
import { RankBuilder } from "./helpers/build-rank.helper";
import { RankPointsCalculator } from "./helpers/rank-points-calculator.helper";
import { RiotDataFetcher } from "./helpers/riot-data-fetcher.helper";
import { SummonerRankData } from "./interfaces/interfaces";

export class GuildLeagueOfLegendsRank implements OnMessageReceiveActionCreator {
  actionTrigger: string;

  constructor(actionTrigger: string) {
    this.actionTrigger = actionTrigger;
  }

  async execute(message: Message<boolean>) {
    if (message.content.includes(this.actionTrigger)) {
      const guildId = this.getGuildId(message);

      if (!guildId) {
        message.reply("Guild id not provided");
        return;
      }

      const players = await this.getPlayers(guildId);

      if (players.error) {
        message.reply(`Something went wrong ${players.message}`);
        return;
      }

      const playersName = this.getPlayersNames(players.data);

      const summonersRankData = await this.getRank(playersName, message);
      const messageResponse = this.formatMessage(summonersRankData);

      message.reply(messageResponse);
    }
  }

  private formatMessage(players: SummonerRankData[]) {
    let data = "";
    let i = 1;

    for (const player of players) {
      data += `⭐ ${i} - ${player.summonerName} = ${player.points}\n`;
      i += 1;
    }

    return data;
  }

  getGuildId(message: Message<boolean>) {
    return message?.guild?.id;
  }

  private async getRank(summoners: string[], message: Message<boolean>) {
    const playersRankData: SummonerRankData[] = [];

    const rankPointsCalculator = new RankPointsCalculator();
    const rankBuilder = new RankBuilder();
    const riotDataFetcher = new RiotDataFetcher();

    for (const summoner of summoners) {
      console.log(`[${summoner}] Fetching data`);
      const summonerAccountInfo = await riotDataFetcher.getSummonerInfo(
        summoner
      );
      if (!summonerAccountInfo) {
        message.reply(`No data available for ${summoner}`);
      }

      const summonerQueueData = await riotDataFetcher.getSummonerLeagueData(
        summonerAccountInfo
      );

      if (!summonerQueueData) {
        message.reply(`No queue data available from ${summoner}`);
      }

      console.log(`[${summoner}] Calculating ranking points`);
      const playerRankPoints =
        rankPointsCalculator.calculateSummonerPoints(summonerQueueData);

      playersRankData.push(playerRankPoints);
    }

    return rankBuilder.buildRank(playersRankData);
  }

  getPlayersNames(players: Player[]) {
    return players.map((p) => p.summonerName);
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
