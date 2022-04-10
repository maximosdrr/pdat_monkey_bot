import * as yts from "yt-search";
import { ISearchResult } from "./interfaces";

export class YoutubeSearch {
  async search(target: string): Promise<ISearchResult> {
    return yts.search(target);
  }
}
