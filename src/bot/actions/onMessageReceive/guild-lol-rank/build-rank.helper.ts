import { IGetSummonerDataResponse, IRankData, QueueTypes } from "./interfaces";

export class RankBuilder {
  constructor(private rankData: IGetSummonerDataResponse[][]) {}

  buildRank() {
    const flexData = this.getQueueData(QueueTypes.FLEX);
    const soloDualData = this.getQueueData(QueueTypes.SOLO_DUAL);

    const merged = this.mergeQueues(flexData, soloDualData);
    const sorted = merged.sort((i, j) => {
      if (i.points > j.points) {
        return -1;
      }

      if (j.points > i.points) {
        return 1;
      }

      return 0;
    });

    return sorted;
  }

  private getQueueData(queueType: QueueTypes) {
    const data: IGetSummonerDataResponse[] = [];
    for (const player of this.rankData) {
      const flexData = player?.find((league) => league.queueType === queueType);
      if (flexData) {
        data.push(flexData);
      }
    }
    return data;
  }

  private getPlayersIds(
    flex: IGetSummonerDataResponse[],
    soloDual: IGetSummonerDataResponse[]
  ) {
    const ids = [];

    for (const player of [...flex, ...soloDual]) {
      if (!ids.includes(player.summonerId)) {
        ids.push(player.summonerId);
      }
    }

    return ids;
  }

  private mergeQueues(
    flex: IGetSummonerDataResponse[],
    soloDual: IGetSummonerDataResponse[]
  ) {
    const players = this.getPlayersIds(flex, soloDual);
    const output: IRankData[] = [];

    for (const player of players) {
      const flexInfo = flex.find((value) => value.summonerId === player);
      const soloDualInfo = soloDual.find(
        (value) => value.summonerId === player
      );

      if (flexInfo && soloDualInfo) {
        output.push({
          ...flexInfo,
          wins: flexInfo.wins + soloDualInfo.wins,
          losses: soloDualInfo.losses + soloDualInfo.losses,
          rank: `Solo Dual ${soloDualInfo.rank} | Flex: ${flexInfo.rank}`,
          points:
            flexInfo.wins +
            soloDualInfo.wins * 3 -
            (flexInfo.losses + soloDualInfo.losses * 2),
        });

        continue;
      }

      if (!flexInfo && soloDualInfo) {
        output.push({
          ...soloDualInfo,
          points: soloDualInfo.wins * 3 - soloDualInfo.losses * 2,
        });

        continue;
      }

      if (!soloDualInfo && flexInfo) {
        output.push({
          ...flexInfo,
          points: flexInfo.wins * 3 - flexInfo.losses * 2,
        });

        continue;
      }
    }

    return output;
  }
}
