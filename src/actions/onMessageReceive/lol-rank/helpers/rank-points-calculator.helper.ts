import {
  ISummonerQueueData,
  QueueTypes,
} from "../../../../repositories/riot-games/summoner-queue-data.entity";
import { SummonerRankData } from "../interfaces";

export class RankPointsCalculator {
  private getQueueData(
    queueType: QueueTypes,
    playerQueueInfo: ISummonerQueueData[]
  ) {
    return playerQueueInfo?.find((league) => league.queueType === queueType);
  }

  calculateSummonerPoints(
    summonerData: ISummonerQueueData[]
  ): SummonerRankData {
    const flexInfo = this.getQueueData(QueueTypes.FLEX, summonerData);
    const soloDualInfo = this.getQueueData(QueueTypes.SOLO_DUAL, summonerData);

    if (flexInfo && soloDualInfo) {
      return {
        ...flexInfo,
        wins: flexInfo.wins + soloDualInfo.wins,
        losses: soloDualInfo.losses + soloDualInfo.losses,
        rank: `Solo Dual ${soloDualInfo.rank} | Flex: ${flexInfo.rank}`,
        points:
          (flexInfo.wins + soloDualInfo.wins) * 3 -
          (flexInfo.losses + soloDualInfo.losses) * 2,
      };
    }

    if (!flexInfo && soloDualInfo) {
      return {
        ...soloDualInfo,
        points: soloDualInfo.wins * 3 - soloDualInfo.losses * 2,
      };
    }

    if (!soloDualInfo && flexInfo) {
      return {
        ...flexInfo,
        points: flexInfo.wins * 3 - flexInfo.losses * 2,
      };
    }

    return null;
  }
}
