import { Bot } from "./bot";
import { prismaClient } from "./database/prisma.orm";

async function main() {
  const bot = new Bot();
  await prismaClient.$connect();

  bot.run();
}

main();
