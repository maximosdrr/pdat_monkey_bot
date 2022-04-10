import { ISummonerQueueData } from "./summoner-queue-data.entity";

export interface SummonerRankData extends ISummonerQueueData {
  points: number;
}
