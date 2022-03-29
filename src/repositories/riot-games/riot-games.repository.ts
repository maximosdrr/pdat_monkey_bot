import axios from "axios";
import { AppConfig } from "../../config/env";
import { ISummonerAccountInfo } from "./summoner-account-info.entity";
import { ISummonerQueueData } from "./summoner-queue-data.entity";

class RiotGamesRepository {
  async getSummonerInfo(summonerName: string): Promise<ISummonerAccountInfo> {
    try {
      const url = encodeURI(
        `${AppConfig.brRiotBaseUrl}/lol/summoner/v4/summoners/by-name/${summonerName}`
      );
      const { data } = await axios.get<ISummonerAccountInfo>(url, {
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

  async getSummonerLeagueData(
    summonerAccountInfo: ISummonerAccountInfo
  ): Promise<ISummonerQueueData[]> {
    try {
      const url = `${AppConfig.brRiotBaseUrl}/lol/league/v4/entries/by-summoner/${summonerAccountInfo.id}`;
      const { data } = await axios.get<ISummonerQueueData[]>(url, {
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
}

export const riotGamesRepository = new RiotGamesRepository();
