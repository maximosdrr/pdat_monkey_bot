import DiscordJs, { Client, Intents } from "discord.js";
import { AppConfig } from "./config/env";
import { OnMessageReceiveActionCreator } from "./shared/interfaces";
import Actions from "./bootstrap";

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

  private registerOnMessageReceiveActions(
    client: Client,
    actions: OnMessageReceiveActionCreator[]
  ) {
    for (const action of actions) {
      client.on("messageCreate", (message) => action.execute(message));
    }
  }
}
