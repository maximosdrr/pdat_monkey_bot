import { Message } from "discord.js";
import { ISong } from "../interfaces";

export class SongQueue {
  songs: ISong[] = [];

  addSong(message: Message<boolean>, song: ISong) {
    message.reply(`${song.title} added to queue`);
    this.songs.push(song);
  }

  getNext(): ISong {
    return this.songs.shift();
  }

  isEmpty(): boolean {
    return this.songs.length === 0;
  }

  getLength() {
    return this.songs.length;
  }

  getSongs() {
    return this.songs;
  }
}
