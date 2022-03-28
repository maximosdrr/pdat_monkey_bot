/*
  Warnings:

  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Player";

-- CreateTable
CREATE TABLE "Summoner" (
    "id" SERIAL NOT NULL,
    "summonerName" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "Summoner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Summoner_summonerName_guildId_key" ON "Summoner"("summonerName", "guildId");
