import DiscordJs, { Client, Intents } from "discord.js";
import { AppConfig } from "../config/env";
import { OnMessageReceiveActionCreator } from "../interfaces";
import onMessageReceiveActions from "./actions/onMessageReceive";

export class Bot {
  public run() {
    const client = new DiscordJs.Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });

    this.registerOnMessageReceiveActions(client, onMessageReceiveActions);

    client.login(AppConfig.botToken);
    console.log(AppConfig.botToken)

    console.log("Pdat team monkey is running 🐵🐵")
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
