-- CreateTable
CREATE TABLE "Summoner" (
    "id" SERIAL NOT NULL,
    "summonerName" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "Summoner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Summoner_summonerName_guildId_key" ON "Summoner"("summonerName", "guildId");
