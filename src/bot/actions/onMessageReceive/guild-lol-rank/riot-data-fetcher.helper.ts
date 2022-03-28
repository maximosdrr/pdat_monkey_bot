import { AppConfig } from "../../../../config/env";
import { SummonerAccountInfo, SummonerQueueData } from "./interfaces";

import axios from 'axios';

export class RiotDataFetcher {
    async getSummonerInfo(
        summonerName: string
      ): Promise<SummonerAccountInfo> {
        try {
          const url = encodeURI(
            `${AppConfig.brRiotBaseUrl}/lol/summoner/v4/summoners/by-name/${summonerName}`
          );
          const { data } = await axios.get<SummonerAccountInfo>(url, {
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
    
    async getSummonerLeagueData(summonerAccountInfo: SummonerAccountInfo): Promise<SummonerQueueData[]> {
        try {
          const url = `${AppConfig.brRiotBaseUrl}/lol/league/v4/entries/by-summoner/${summonerAccountInfo.id}`;
          const { data } = await axios.get<SummonerQueueData[]>(url, {
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