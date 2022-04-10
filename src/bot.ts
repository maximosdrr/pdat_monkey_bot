import DiscordJs, { Client, Intents } from "discord.js";
import { AppConfig } from "./config/env";
import Actions from "./bootstrap";
import { Action } from "./shared/action.abstract";

export class Bot {
  public run() {
    const client = new DiscordJs.Client({
      intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES,
      ],
    });

    this.registerOnMessageReceiveActions(client, Actions);

    client.login(AppConfig.botToken);

    console.log("Pdat team monkey is running 🐵🐵");
  }

  private registerOnMessageReceiveActions(client: Client, actions: Action[]) {
    for (const action of actions) {
      client.on("messageCreate", (message) => action.execute(message));
    }
  }
}
