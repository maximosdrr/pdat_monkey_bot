import axios from "axios";
import { Message } from "discord.js";
import { AppConfig } from "../../../../config/env";

import { OnMessageReceiveActionCreator } from "../../../../interfaces";
import { RankBuilder } from "./build-rank.helper";
import {
  IGetSummonerByNameResponse,
  IGetSummonerDataResponse,
} from "./interfaces";

export class GuildLeagueOfLegendsRank implements OnMessageReceiveActionCreator {
  names = [
    "Percatinha",
    "odeio aquela cor",
    "Frank Destruição",
    "Belicous",
    "Rocàm",
    "ErickinPic4DeMel",
    "o TTu",
    "imolbmit",
    "TZora",
    "Cabo Acácio",
    "Iron Kaiser",
  ];

  async execute(message: Message<boolean>) {
    if (message.content === "@playersRank") {
      let data = "";
      let i = 1;
      const players = await this.getRankFor(this.names, message);

      for (const player of players) {
        data += `⭐ ${i} - ${player.summonerName} = ${player.points}\n`;
        i += 1;
      }

      message.reply(data);
    }
  }

  validate(message: Message<boolean>) {
    if (!(message.content === "@playersRank")) {
      return;
    }
  }

  private async getSummonerInfo(
    summonerName: string
  ): Promise<IGetSummonerByNameResponse> {
    try {
      const url = encodeURI(
        `${AppConfig.brRiotBaseUrl}/lol/summoner/v4/summoners/by-name/${summonerName}`
      );
      const { data } = await axios.get<IGetSummonerByNameResponse>(url, {
        params: {
          api_key: AppConfig.riotApiKey,
        },
      });

      return data;
    } catch (e) {
      console.log(e.message);
      return null;
    }
  }

  private async getSummonerLeagueData(
    summonerName: string,
    summonerData: IGetSummonerByNameResponse,
    message: Message<boolean>
  ): Promise<IGetSummonerDataResponse[]> {
    try {
      if (!summonerData) {
        message.reply(`Summoner data not available for ${summonerName}`);
        return;
      }

      const url = `${AppConfig.brRiotBaseUrl}/lol/league/v4/entries/by-summoner/${summonerData.id}`;
      const { data } = await axios.get<IGetSummonerDataResponse[]>(url, {
        params: {
          api_key: AppConfig.riotApiKey,
        },
      });

      return data;
    } catch (e) {
      message.reply(`Ocorreu um erro: ${e?.message ?? "desconhecido"}`);
      console.log(e.message);
    }
  }

  private async getRankFor(summoners: string[], message: Message<boolean>) {
    const rawData: IGetSummonerDataResponse[][] = [];

    for (const summoner of summoners) {
      const summonerData = await this.getSummonerInfo(summoner);
      const summonerLeagueData = await this.getSummonerLeagueData(
        summoner,
        summonerData,
        message
      );

      rawData.push(summonerLeagueData);
    }

    const rankBuilder = new RankBuilder(rawData);

    return rankBuilder.buildRank();
  }
}
