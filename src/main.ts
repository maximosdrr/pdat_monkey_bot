import { Bot } from "./bot/bot";
import { AuthServer } from "./bot/auth-server";
import { AppConfig } from "./config/env";

function main() {
  const bot = new Bot();
  const authServer = new AuthServer();

  authServer.runServer();
  bot.run(AppConfig.botToken);
}

main();
