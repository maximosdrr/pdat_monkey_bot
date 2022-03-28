import DiscordJs, { Client, Intents } from "discord.js";
import { OnMessageReceiveActionCreator } from "../interfaces";
import onMessageReceiveActions from "./actions/onMessageReceive";

export class Bot {
  public run(token: string) {
    const client = new DiscordJs.Client({
      intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    });

    this.registerOnMessageReceiveActions(client, onMessageReceiveActions);

    client.login(token);
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
