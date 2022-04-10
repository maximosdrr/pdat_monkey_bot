import play from "play-dl";
import { IYouTubeStream } from "./interface";

export class YoutubeStreamProvider {
  async stream(url: string): Promise<IYouTubeStream> {
    return play.stream(url, {
      discordPlayerCompatibility: true,
    });
  }
}
