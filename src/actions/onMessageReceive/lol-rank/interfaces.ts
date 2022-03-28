import { ISummonerQueueData } from "../../../repositories/riot-games/summoner-queue-data.entity";

export interface SummonerRankData extends ISummonerQueueData {
  points: number;
}
