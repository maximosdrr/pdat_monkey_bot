import { Message } from "discord.js";
import { ISong } from "../interfaces/interfaces";

export class SongQueue {
  songs: ISong[] = [];

  addSong(song: ISong) {
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

  clearQueue() {
    this.songs = [];
  }

  pushBatch(songs: ISong[]) {
    this.songs = [...this.songs, ...songs];
  }

  getSongsAsString() {
    return this.songs.reduce(
      (prev, current, i) =>
        (prev += `${i + 1} - ${current.title} - Duração: ${
          current.duration
        } segundos\n`),
      ""
    );
  }
}
