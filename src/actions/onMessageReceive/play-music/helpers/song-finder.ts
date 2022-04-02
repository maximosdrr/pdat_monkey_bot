import ytdl, { MoreVideoDetails, videoInfo } from "ytdl-core";
import * as yts from "yt-search";
import { AppConfig } from "../../../../config/env";
import { Message } from "discord.js";
import { ISong } from "../interfaces";

export class SongFinder {
  async getSong(trigger: string, message: Message<boolean>): Promise<ISong> {
    try {
      const songUrl = await this.getSongUrl(trigger, message);
      const songInfo = await ytdl.getInfo(songUrl);

      const songDuration = this.getSongDuration(songInfo);
      return {
        url: songUrl,
        title: songInfo?.videoDetails?.title ?? "NOT FOUND",
        duration: songDuration,
      };
    } catch (e) {
      message.reply(
        `Cannot add this song to queue reason ${e.message ?? "Unknown"}`
      );
      return null;
    }
  }

  private getSongDuration(details: videoInfo) {
    const seconds = Number(details?.videoDetails?.lengthSeconds);

    if (Number.isNaN(seconds)) {
      return 1;
    }

    return seconds;
  }

  private async getSongUrl(
    trigger: string,
    message: Message<boolean>
  ): Promise<string> {
    const target = this.getTarget(trigger, message);

    if (this.isYoutubeUrl(target)) {
      return target;
    }

    const result = await yts.search(target);

    for (const song of result.videos) {
      const { url } = song;

      if (!url) return AppConfig.defaultSong;

      return url;
    }
  }

  private isYoutubeUrl(song: string): boolean {
    const result = ytdl.validateURL(song);
    return result;
  }

  private getTarget(trigger: string, message: Message<boolean>): string {
    const target = message.content.split(trigger)[1];

    if (!target) {
      return "Bury the Light";
    }

    return target;
  }
}
