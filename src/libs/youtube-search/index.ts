import * as yts from "yt-search";
import play, { YouTubeVideo } from "play-dl";
import { ISearchResult } from "./interfaces";

export class YoutubeSearch {
  async search(target: string): Promise<ISearchResult> {
    return yts.search(target);
  }

  async getPlaylist(url: string): Promise<YouTubeVideo[]> {
    try {
      console.log(url);
      const playlist = await play.playlist_info(url.replace(" ", ""));
      console.log("playlist", playlist);
      return await playlist.all_videos();
    } catch (e) {
      console.log(e);
      throw new Error("Cannot get playlist videos");
    }
  }
}
