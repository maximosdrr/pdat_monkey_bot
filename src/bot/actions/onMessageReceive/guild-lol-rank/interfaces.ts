export interface IGetSummonerByNameResponse {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

export interface IGetSummonerDataResponse {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  summonerName: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

export interface IRankData extends IGetSummonerDataResponse {
  points: number;
}

export enum QueueTypes {
  FLEX = "RANKED_FLEX_SR",
  SOLO_DUAL = "RANKED_SOLO_5x5",
}
