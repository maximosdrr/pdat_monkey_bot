export enum QueueTypes {
  FLEX = "RANKED_FLEX_SR",
  SOLO_DUAL = "RANKED_SOLO_5x5",
}

export interface ISummonerQueueData {
  leagueId: string;
  queueType: QueueTypes;
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
