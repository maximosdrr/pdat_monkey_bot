import { Message } from "discord.js";
import { helpMessages, songQueue } from "../constants";
import { OnMessageReceiveActionCreator } from "../interfaces";
import { SongPlayer } from "./helpers/player";
import { SongFinder } from "./helpers/song-finder";

export class PlayMusic implements OnMessageReceiveActionCreator {
  songFinder = new SongFinder();
  songQueue = songQueue;
  player: SongPlayer;
  actionTrigger: string;
  stop: string;
  next: string;
  getQueueSongs: string;

  constructor({ play, stop, next, getQueueSongs }) {
    this.actionTrigger = play;
    this.stop = stop;
    this.next = next;
    this.player = new SongPlayer(this.songQueue);
    this.getQueueSongs = getQueueSongs;
    this.registerHelpMessage();
  }

  async execute(message: Message<boolean>) {
    if (message.content.includes(this.actionTrigger)) {
      const song = await this.songFinder.getSong(this.actionTrigger, message);

      if (song) {
        await this.player.play(message, song);
      }
    }

    if (message.content.includes(this.stop)) {
      this.player.stop(message);
    }

    if (message.content.includes(this.next)) {
      await this.player.next(message);
    }

    if (message.content.includes(this.getQueueSongs)) {
      const messageContent = this.getQueueSongsMessage();
      message.reply(messageContent);
    }
  }

  getQueueSongsMessage() {
    const message = this.songQueue.getSongsAsString();

    if (!message.length) return "Queue is empty";

    return message;
  }

  registerHelpMessage() {
    const playMusic = `${this.actionTrigger} (Link do youtube ou nome da musica) => Toca uma musica`;
    const skipMusic = `${this.next} => Passa uma musica`;
    const stopMusic = `${this.stop} => Para a musica e limpa a fila`;

    helpMessages.push(playMusic);
    helpMessages.push(skipMusic);
    helpMessages.push(stopMusic);
  }
}
