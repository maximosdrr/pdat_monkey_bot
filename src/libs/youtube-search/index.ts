import * as yts from "yt-search";
import play, { YouTubeVideo } from "play-dl";
import { ISearchResult } from "./interfaces";

export class YoutubeSearch {
  async search(target: string): Promise<ISearchResult> {
    return yts.search(target);
  }

  async searchPlaylist(url: string): Promise<ISearchResult> {
    return yts.search(url);
  }

  async getPlaylist(url: string): Promise<YouTubeVideo[]> {
    try {
      const playlist = await play.playlist_info(url);
      return await playlist.all_videos();
    } catch (e) {
      throw new Error("Cannot get playlist videos");
    }
  }
}
