-- CreateTable
CREATE TABLE "Summoner" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "summonerName" TEXT NOT NULL,
    "guildId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Summoner_summonerName_guildId_key" ON "Summoner"("summonerName", "guildId");
