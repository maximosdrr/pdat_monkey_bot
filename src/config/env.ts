import { config } from "dotenv";

config({ path: ".env" });

export const AppConfig = {
  botToken: process.env.BOT_TOKEN,
  riotApiKey: process.env.RIOT_API_KEY,
  brRiotBaseUrl: process.env.BR_RIOT_GAMES_BASE_URL,
};
