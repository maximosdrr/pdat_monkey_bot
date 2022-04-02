import { Message } from "discord.js";
import { OnMessageReceiveActionCreator } from "../interfaces";
import { SongPlayer } from "./helpers/player";
import { SongFinder } from "./helpers/song-finder";

export class PlayMusic implements OnMessageReceiveActionCreator {
  songFinder = new SongFinder();
  actionTrigger: string;
  stop: string;
  skip: string;

  constructor({ play, stop, skip }) {
    this.actionTrigger = play;
    this.stop = stop;
    this.skip = skip;
  }

  async execute(message: Message<boolean>) {
    if (message.content.includes(this.actionTrigger)) {
      const song = await this.songFinder.getSong(this.actionTrigger, message);
      const player = new SongPlayer();

      player.playSong(message, song);

      message.reply(song.title);
    }
  }
}
