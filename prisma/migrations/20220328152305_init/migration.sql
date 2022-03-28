-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "summonerName" TEXT NOT NULL,
    "guildId" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_summonerName_guildId_key" ON "Player"("summonerName", "guildId");
