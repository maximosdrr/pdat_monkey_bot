import { PrismaClient } from "@prisma/client";
import { prismaClient } from "../../database/prisma.orm";

class SummonerRepository {
  private prismaClient: PrismaClient = prismaClient;

  async addSummoner(summonerName: string, guildId: string) {
    try {
      await this.prismaClient.summoner.create({
        data: {
          guildId: guildId,
          summonerName: summonerName,
        },
      });
      return { inserted: true, message: "sucess" };
    } catch (e) {
      return { inserted: false, message: `${e.message || "Unknown"}` };
    }
  }

  private async getByNameAndGuild(summonerName: string, guildId: string) {
    try {
      const result = await prismaClient.summoner.findFirst({
        where: {
          summonerName,
          guildId,
        },
      });

      return { error: false, message: "success", data: result };
    } catch (e) {
      return { error: true, message: e.message, data: null };
    }
  }

  async getAll(guildId: string) {
    try {
      const players = await prismaClient.summoner.findMany({
        where: {
          guildId: guildId,
        },
      });

      return { data: players, message: "Found", error: false };
    } catch (e) {
      return { data: [], message: e.message, error: true };
    }
  }

  async deleteOne(summonerName: string, guildId: string) {
    const playerData = await this.getByNameAndGuild(summonerName, guildId);

    if (playerData.error || !playerData.data) {
      return {
        error: true,
        message: "error trying found player",
        deleted: false,
      };
    }
    try {
      await prismaClient.summoner.delete({
        where: { summonerName_guildId: { guildId, summonerName } },
      });

      return {
        error: false,
        message: "success",
        deleted: true,
      };
    } catch (e) {
      return {
        error: true,
        message: "error when trying delete player",
        deleted: false,
      };
    }
  }
}

export const summonerRepository = new SummonerRepository();
