import { IVideoDetails } from "./interfaces";
import ytdl from "ytdl-core";

export class VideoDetailsSeeker {
  async getInfo(url: string): Promise<IVideoDetails> {
    return ytdl.getInfo(url);
  }

  validateURL(url: string): boolean {
    return ytdl.validateURL(url);
  }
}
