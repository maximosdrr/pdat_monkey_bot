import { Message } from "discord.js";
import { OnMessageReceiveActionCreator } from "../interfaces";
import { SongPlayer } from "./helpers/player";
import { SongQueue } from "./helpers/queue";
import { SongFinder } from "./helpers/song-finder";

export class PlayMusic implements OnMessageReceiveActionCreator {
  songFinder = new SongFinder();
  songQueue = new SongQueue();
  player: SongPlayer;
  actionTrigger: string;
  stop: string;
  next: string;

  constructor({ play, stop, next }) {
    this.actionTrigger = play;
    this.stop = stop;
    this.next = next;
    this.player = new SongPlayer(this.songQueue);
  }

  async execute(message: Message<boolean>) {
    if (message.content.includes(this.actionTrigger)) {
      const song = await this.songFinder.getSong(this.actionTrigger, message);

      if (song) {
        this.player.play(message, song);
      }
    }

    if (message.content.includes(this.stop)) {
      this.player.stop(message);
    }

    if (message.content.includes(this.next)) {
      this.player.next(message);
    }
  }
}
